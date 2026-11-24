# Invitely

Living digital invitations that open like a ceremony. Guests light the lamp, break the seal or draw the curtains, and your day unfolds on their phone.

- Product plan and market research: [`docs/PLAN.md`](docs/PLAN.md)
- Open decisions and things that need the owner: [`docs/NEEDS-YOUR-INPUT.md`](docs/NEEDS-YOUR-INPUT.md)

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. No configuration is needed for development. Data is stored in a local SQLite file at `.data/invitely.db`, created on first use.

## Where to look

| Page | Path |
| --- | --- |
| Landing page with a live demo | `/` |
| Designs gallery | `/templates` |
| One design, live | `/templates/pahana` |
| Full screen demo invitation | `/demo/pahana` |
| Design studio, no account needed | `/studio/new?template=pahana` |
| Pricing | `/pricing` |
| Cards remembered on this device, and find a card by PIN | `/my` |
| Manage one card (private link) | `/m/manage-token` |
| A published invitation | `/i/your-link` |
| A guest's personal link | `/i/your-link?g=token` |

## Configuration

Copy `.env.example` to `.env.local` and fill in what you need. Everything is optional in development.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | libSQL database URL, for example a Turso database. Defaults to a local file |
| `DATABASE_AUTH_TOKEN` | Token for the hosted database |
| `NEXT_PUBLIC_SITE_URL` | Public address of the site, used in share links |
| `PAYMENTS_MODE` | `off` (default, publishing is free) or `manual` (hold until payment is confirmed) |

## Scripts

```bash
npm run build
```

```bash
npm run lint
```

## Stack

Next.js 16 (App Router with Cache Components), React 19, TypeScript, Tailwind CSS 4, libSQL. Ornaments are SVG drawn in code and the soundscapes are synthesised in the browser, so the project ships no licensed media.

## Changing things

- Prices and plan features: `src/lib/plans.ts`
- Designs: `src/lib/invitation/templates.ts`
- Colours and lettering: `src/lib/invitation/theme.ts`
- Occasions and default wording: `src/lib/invitation/occasions.ts`
- Sinhala and Tamil labels: `src/lib/invitation/labels.ts`
- Ornaments: `src/components/invitation/ornaments.tsx`
- Openings: `src/components/invitation/rituals/`
