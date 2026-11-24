import QRCode from "qrcode";

/**
 * QR code drawn as one SVG path. Built synchronously, so it renders on the
 * server and stays sharp at any print size.
 */
export function QrCode({ value, color = "currentColor", className = "" }: { value: string; color?: string; className?: string }) {
  let size = 0;
  let d = "";
  try {
    const qr = QRCode.create(value || " ", { errorCorrectionLevel: "M" });
    size = qr.modules.size;
    const bits = qr.modules.data;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (bits[y * size + x]) d += `M${x} ${y}h1v1h-1z`;
      }
    }
  } catch {
    return null;
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} shapeRendering="crispEdges" role="img" aria-label="QR code">
      <path d={d} fill={color} />
    </svg>
  );
}
