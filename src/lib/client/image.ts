/** Resize and compress a photo in the browser so uploads stay small and fast on mobile data. */
export async function compressImage(file: File, maxDim = 1600, targetBytes = 480_000): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image.");
  // JPEG has no transparency, and an empty canvas would turn black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  let quality = 0.86;
  let out = canvas.toDataURL("image/jpeg", quality);
  // base64 is about 4/3 the size of the bytes it encodes
  while (out.length * 0.75 > targetBytes && quality > 0.4) {
    quality -= 0.1;
    out = canvas.toDataURL("image/jpeg", quality);
  }
  return out;
}

export interface CardImage {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Prepare a picture for an image card or a printed card. Keeps more pixels than
 * a web photo, because it may be printed, and keeps see-through areas of a logo.
 */
export async function prepareCardImage(file: File, maxDim = 2600, maxBytes = 1_300_000): Promise<CardImage> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const bitmap = await loadBitmap(file);
  const source = Math.max(bitmap.width, bitmap.height);
  // An SVG with no size of its own reports zero
  if (!source) throw new Error("That picture has no size. Please save it as a PNG or JPG.");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not process the image.");
  const small = (url: string) => url.length * 0.75 <= maxBytes;
  const draw = (scale: number, backdrop?: string) => {
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    if (backdrop) {
      ctx.fillStyle = backdrop;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  };
  const result = (dataUrl: string): CardImage => ({ dataUrl, width: canvas.width, height: canvas.height });

  const start = Math.min(1, maxDim / source);
  const mayBeClear = !/jpe?g$/.test(file.type);
  if (mayBeClear) {
    draw(start);
    if (hasClearPixels(ctx, canvas.width, canvas.height)) {
      for (let scale = start; ; scale *= 0.8) {
        draw(scale);
        const url = canvas.toDataURL("image/png");
        if (small(url)) return result(url);
        if (Math.max(canvas.width, canvas.height) < 200) throw new Error("That picture is too large. Please use a smaller one.");
      }
    }
  }
  for (let scale = start; ; scale *= 0.8) {
    draw(scale, "#ffffff");
    for (const quality of [0.9, 0.82, 0.74]) {
      const url = canvas.toDataURL("image/jpeg", quality);
      if (small(url)) return result(url);
    }
    if (Math.max(canvas.width, canvas.height) < 200) throw new Error("That picture is too large. Please use a smaller one.");
  }
}

function hasClearPixels(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  const { data } = ctx.getImageData(0, 0, w, h);
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) return true;
  return false;
}

/** Pixel size of a picture that is already stored. */
export async function measureImage(src: string): Promise<{ width: number; height: number }> {
  const img = new Image();
  img.src = src;
  await img.decode();
  return { width: img.naturalWidth, height: img.naturalHeight };
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // fall through to the <img> path
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read the image."));
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}
