#!/usr/bin/env node
// Work on one invitation card as a file.
//
//   npm run card -- list
//   npm run card -- pull <slug>
//   npm run card -- push <slug> [--ready "message to the host"]
//
// INVITELY_URL is the site to talk to (default http://localhost:3000).
// ADMIN_PASSWORD is the team password (default "admin", which only works on a local dev server).

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const base = (process.env.INVITELY_URL ?? "http://localhost:3000").replace(/\/$/, "");
const key = process.env.ADMIN_PASSWORD ?? "admin";
const [command, slug, ...rest] = process.argv.slice(2);
const headers = { "x-admin-key": key, "content-type": "application/json" };

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

async function call(method, url, body) {
  const res = await fetch(`${base}${url}`, { method, headers, body: body ? JSON.stringify(body) : undefined }).catch((e) =>
    fail(`Could not reach ${base}. Is the site running? (${e.message})`),
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) fail(`${res.status}: ${json.error ?? "request failed"}`);
  return json;
}

const sectionName = (id) => ({ cover: "Cover (names, date, top of the card)", footer: "Footer" })[id] ?? `Section: ${id}`;

function reviewMarkdown({ card, review, options }) {
  const lines = [
    `# Review notes for ${card.title}`,
    "",
    `- Card link: ${base}/i/${card.slug}`,
    `- Card status: ${card.status}. Review status: ${card.reviewStatus}.`,
    card.ownerName || card.ownerContact ? `- Host: ${[card.ownerName, card.ownerContact].filter(Boolean).join(", ")}` : "",
    "",
  ];
  if (!review) {
    lines.push("There is no open review request for this card.", "");
  } else {
    lines.push(`## Round ${review.round}`, "");
    if (review.note) lines.push("General note from the host:", "", `> ${review.note.replace(/\n/g, "\n> ")}`, "");
    if (review.pins.length) {
      lines.push("The host tapped these places on the card:", "");
      review.pins.forEach((p, i) => {
        lines.push(`${i + 1}. **${sectionName(p.section)}**${p.done ? " (already done)" : ""}`);
        if (p.context) lines.push(`   - Words at that spot: "${p.context}"`);
        lines.push(`   - Asked for: ${p.comment}`);
      });
      lines.push("");
    }
  }
  lines.push(
    "## How to make the changes",
    "",
    "Edit `card.json` in this folder and nothing else. Field guide:",
    "",
    "- Cover: `name1`, `name2`, `kicker` (line above the names), `subline` (line below), `date` (yyyy-mm-dd), `time` (HH:mm), `venueName`, `heroPhoto`",
    "- Message: `message`, `hostsLine`. Other languages: `translations.si` and `translations.ta`",
    "- Schedule: `events[]` with `title`, `time`, `place`, `note`",
    "- Auspicious times: `nekath[]` with `title`, `time`, `note`",
    "- Venue: `venueName`, `venueAddress`, `mapQuery`",
    "- Story: `story[]`. Gallery: `gallery[]`. Good to know: `dressCode`, `notes`, `contacts[]`. Gift note: `giftNote`",
    "- RSVP: `rsvp` (deadline, maxPartySize, askMeal, mealOptions, customQuestion)",
    "- Which sections show and in what order: `sections[]`",
    "- Look: `theme.paletteId`, `theme.custom` (hex colours: bg, ink, accent, deep), `theme.fontPair`, `theme.ornament`, `theme.hero`, `theme.ritual`, `theme.music`, `theme.effect`",
    "",
    "Allowed values:",
    "",
    ...Object.entries(options).map(([k, v]) => `- \`${k}\`: ${v.join(", ")}`),
    "",
    "When done, run `npm run card -- push " + card.slug + ' --ready "short message to the host"`.',
    "",
  );
  return lines.filter((l) => l !== undefined).join("\n");
}

if (command === "list") {
  const { cards } = await call("GET", "/api/admin/cards");
  if (!cards.length) console.log("No cards.");
  for (const c of cards) console.log(`${c.reviewStatus.padEnd(10)} ${String(c.openPins).padStart(2)} notes  ${c.slug}  (${c.title})`);
} else if (command === "pull" && slug) {
  const result = await call("GET", `/api/admin/cards/${encodeURIComponent(slug)}`);
  const dir = path.join("cards", result.card.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "card.json"), `${JSON.stringify(result.data, null, 2)}\n`);
  await writeFile(path.join(dir, "REVIEW.md"), reviewMarkdown(result));
  console.log(`Saved ${dir}/card.json and ${dir}/REVIEW.md`);
  console.log(result.review ? `${result.review.pins.length} notes in round ${result.review.round}.` : "No open review request.");
} else if (command === "push" && slug) {
  const file = path.join("cards", slug, "card.json");
  const data = JSON.parse(await readFile(file, "utf8").catch(() => fail(`Could not read ${file}. Pull the card first.`)));
  const i = rest.indexOf("--ready");
  const ready = i !== -1;
  const reply = ready ? rest[i + 1] ?? "" : "";
  const result = await call("PUT", `/api/admin/cards/${encodeURIComponent(slug)}`, { data, ready, reply });
  console.log(`Updated ${base}/i/${result.slug}`);
  if (ready) console.log(result.markedReady ? "The host has been asked to check the card." : "There was no open review to mark as ready.");
} else {
  fail('Usage: npm run card -- list | pull <slug> | push <slug> [--ready "message"]');
}
