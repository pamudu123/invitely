---
description: Apply a host's review notes to one invitation card, and only that card
argument-hint: <card-slug>
---

Work on exactly one invitation card: `$ARGUMENTS`.

1. Run `npm run card -- pull $ARGUMENTS`. This saves two files in `cards/$ARGUMENTS/`:
   - `card.json`, the card's content and design
   - `REVIEW.md`, the notes the host pinned on their card, with a guide to the fields and the allowed values
2. Read both files.
3. Make each requested change by editing `cards/$ARGUMENTS/card.json`. Rules:
   - Do not edit any other file in this repository. The card is data, not code.
   - Use only the allowed values listed in `REVIEW.md` for design options.
   - Keep dates as `yyyy-mm-dd` and times as 24 hour `HH:mm`.
   - If a note is unclear, or asks for something the card cannot do, leave that part unchanged and say so.
4. Show a short list of what changed, one line per note, and what was left undone.
5. Ask before sending. When told to go ahead, run
   `npm run card -- push $ARGUMENTS --ready "one or two friendly sentences for the host about what was changed"`.
   Leave out `--ready` to save the changes without telling the host.

The commands talk to the site at `INVITELY_URL` (default `http://localhost:3000`) using `ADMIN_PASSWORD`.
If no slug was given, run `npm run card -- list` and show the cards that are waiting.
