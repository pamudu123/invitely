# Invitely: product plan

Living digital invitations that open like a ceremony. Weddings first, every celebration after.

This plan comes from a teardown of 26 competitor sites (fetched on 24 November 2026) and sets out what Invitely is, what makes it different, and how it gets built in phases. Phase 1 is built and in this repository.

## 1. What the market looks like

### Two business models

| Model | How it works | Examples | Weakness |
| --- | --- | --- | --- |
| Designer-led studio | Customer picks a design, pays, fills in a form, waits for a designer | Webgency (EUR 35 to 155), The Digital Invite (EUR 159 to 975), Ivy, Invity, Luvbee | 2 to 14 day wait, no self editing, hard to scale |
| Self-service platform | Customer edits a template, pays to publish | Wedvite (USD 89), Join Wedding (USD 59), Vowberry (USD 39 to 59), Invitation.lk, Invito Studio | Designs can feel generic, few are truly mobile-first in the editor |

Invitely is self-service first, with a designer-made tier (Atelier) on top. That is the hybrid that Wedvite and Occavia use, and it lets revenue start without a design team.

### Sri Lanka

Eleven local sites were reviewed. The useful numbers:

| Tier | LKR | Examples |
| --- | --- | --- |
| Low | 1,000 to 3,000 | WeddingInvites.lk Mini, Invity Silver, InviteBloom |
| Typical | 3,500 to 5,500 | Ivy, Invito Studio, Luvbee, Invity Gold and Royal, Invitation.lk Essential |
| Premium | 10,000 to 20,000 | Invitation.lk Complete and Custom, WeddingInvite.lk |

What the strongest local players already do:

- **Invitation.lk**: self-service editor, per-guest WhatsApp links with opened tracking, 58 templates, nakath times, wedding plus homecoming bundle.
- **Invito Studio**: one plan at LKR 4,500, 47 templates, wax seal and candle openings, table lookup, Sinhala and Tamil.
- **Ivy Invitations**: the best cultural artwork (poruwa, punkalasa, bulath), but designer-led and only 7 templates.

Most others order by WhatsApp, pay by bank transfer, and keep links live for only 30 days to 12 months.

### International

Opening animations, music, RSVP and schedule are now table stakes (7 of 7 products reviewed). Envelope and wax seal is the default opening (5 of 7). Guest-name links (3 of 7), wishes walls (3 of 7) and analytics (2 of 7) are much rarer. Nobody offers a gift registry block. One-time pricing per event has replaced subscriptions among newer players.

### Gaps nobody owns

1. A guest-side language switch between Sinhala, Tamil and English. Several sites say they support the languages, none showed a toggle.
2. Auspicious times as structured data, each with its own countdown.
3. Real designs for non-wedding Sri Lankan occasions: housewarming, coming of age, almsgiving, first birthday.
4. Check-in at the door. Table lookup exists, check-in does not.
5. An invitation that changes on the day and after it.
6. Links that do not expire.
7. USD pricing and card payment for the diaspora.
8. A proper mobile editor. Most customers will design on a phone.

## 2. Positioning and the unique idea

**Invitations that open like a ceremony.**

Every Sri Lankan celebration begins by lighting the oil lamp. Invitely makes that the product. The guest does not tap a generic "open" button. They light a brass lamp and its glow fills the screen, or part velvet curtains, or open a lotus petal by petal. Envelopes and wax seals are everywhere. A lamp is ours.

Three ideas carry the brand:

1. **Openings as rituals.** Ten gestures: light the lamp, accept the betel sheaf, open the carved doors, draw the curtains, open the lotus, break the seal, scratch the foil, pop the balloon, snap the clapperboard, open the gift. Each is drawn in code, themed to the invitation's colours, and works with a single thumb.
2. **One link, three lives.** Before the day it is an invitation with countdown and RSVP. On the day it shows what is happening now and next. Afterwards it becomes a thank you page with photos and wishes.
3. **Made for how we celebrate.** Auspicious time countdowns, a language switch, personal links sent on WhatsApp, and designs named for what they are drawn from: Pahana, Mahanuwara, Nelum, Kolam, Noor.

### Visual direction

The reference studio (Samana Studios) builds cinematic sites: near-black gradients, oversized type, small tracked mono labels, hairline borders. Invitely's site follows that, lit by one warm colour.

- Site chrome: night green-black `#060b0b`, paper text `#f4eddf`, one flame accent `#e8b565`.
- Type: Instrument Serif for display at very large sizes, Instrument Sans for interface, Geist Mono for labels.
- No drop shadows on cards, pill buttons, hairline rules.
- The invitations themselves are light, warm and typographic, so they glow against the dark site.
- Everything is designed at phone size first. Templates are always shown inside phone frames, drawn at true 390 by 844 size and scaled.

## 3. Features and phases

### Phase 1: the core product (built)

| Area | What is built |
| --- | --- |
| Invitation engine | One theme-driven renderer. 32 palettes, 11 lettering pairs, 18 ornament sets drawn as SVG, 9 cover layouts, 10 openings, 3 generated soundscapes, 4 floating effects |
| Designs | 34 templates across 15 occasions: wedding, homecoming, engagement, mehendi, save the date, birthday, anniversary, baby shower, housewarming, coming of age, almsgiving, graduation, festive gatherings (Avurudu, Christmas, Eid, Deepavali), corporate, other |
| Sections | Cover, message, countdown, auspicious times, schedule, venue with map and calendar link, story, gallery, good to know, gift note, RSVP, wishes wall |
| Studio | Live preview while typing. Phone frame on desktop, full screen with bottom sheet editor on mobile. Change design, colours, lettering, ornament, cover, opening, sound, sections, order, wording, photos |
| Try before sign up | Design without an account. The draft is kept on the device and moved into the account at sign up |
| Guests | Personal link per guest or family with name greeting and reserved seats. Bulk add by pasting a list |
| RSVP | Accept or decline, party size, meal choice, a custom question, a wish. Replies matched to the guest list |
| Languages | English, Sinhala and Tamil labels and dates, guest-side switch, host-written translations for the main lines |
| Living invitation | Automatic before, on the day and after views, with a preview switch in the studio |
| Dashboard | Invitations list, reply stats, guest list with WhatsApp send, replies with CSV export, QR code, door check-in, link settings |
| Site | Landing page with a live tappable demo, designs gallery with occasion filter, design pages, pricing, accounts |

### Phase 2: money and trust

1. Payments: PayHere for LKR, Stripe or similar for USD. A manual bank transfer mode already exists as a switch (`PAYMENTS_MODE=manual`), and needs an admin screen to confirm payments.
2. Plan gating: enforce the Essential and Signature feature split, which is currently open.
3. Password reset and email verification (needs an email provider).
4. Object storage for photos (currently stored in the database, fine for launch volume only).
5. Share image polish: the WhatsApp preview card exists, and should use the invitation's own lettering and support Sinhala and Tamil names.
6. Terms, privacy policy and refund policy pages.
7. Native speaker review of Sinhala and Tamil labels.
8. Sample photography for the demo invitations.

### Phase 3: growth

1. RSVP reminders to guests who have not replied, by WhatsApp.
2. Guest photo upload and shared album after the event.
3. Seating plan with table lookup on the day.
4. Opened and viewed tracking per guest in the dashboard (the data is already recorded).
5. Gift registry and cash gift block with bank details or a payment link.
6. Custom domains.
7. Save the date as a lighter product that credits toward the full invitation.
8. Duplicate an invitation, to make the homecoming from the wedding in one tap.
9. More openings (carved doors, betel leaf sheaf, kuthu vilakku with five wicks) and more designs per occasion.

### Phase 4: scale

1. Planner and studio accounts that manage many events, with their own branding.
2. A designer marketplace for templates.
3. Atelier workflow: brief form, proofs and revision rounds inside the product.
4. Analytics for hosts: opens over time, reply rate, device split.
5. More languages for diaspora and regional markets.

### The design library

A second research pass looked at the template catalogues of nine competitors. What everyone has: wax seal envelopes, watercolour florals, maroon or ivory with gold, minimal white, navy and gold, coastal. What nobody had: a boarding pass, a newspaper front page, a hill country train ticket, and any design for Avurudu, Eid, Deepavali, coming of age or almsgiving. The library was built to fill those gaps.

| Group | Designs |
| --- | --- |
| Sri Lankan tradition | Pahana, Bulath, Mahanuwara, Dorakada, Nelum, Kolam, Noor, Cathedral |
| Modern and evening | Atelier, Tharu, Pihatu, Monara, Ran, Verala, Promise |
| Novelty | The Gazette (newspaper), First Class (boarding pass), Udarata Menike (train ticket), Mathaka (polaroids), Premiere (film poster) |
| Pre-wedding and family | Maruthani (mehendi), Manel, Little Star, Piyum, Aluth Gedara, Pin |
| Festive | Suriya (Avurudu), Deepam (Deepavali), Hilal (Eid), Nattal (Christmas) |
| Parties and work | Pop!, Golden Year, Laurel (graduation), Keynote (corporate) |

Every design is a preset over shared parts, so a host can mix them: any of the 9 cover layouts with any of the 10 openings, 18 ornament sets, 32 palettes and 11 lettering pairs.

Ideas held for later: an ola leaf manuscript scroll, a Vesak lantern opening, a photo booth strip, a painted venue scene that shifts from day to night, a "find your seat" table finder, and couple caricatures.

## 4. Pricing proposal

One payment per event, no subscription, unlimited guests. Free to design, pay to publish. Numbers sit in `src/lib/plans.ts`.

| Plan | LKR | USD | For |
| --- | --- | --- | --- |
| Design | Free | Free | Build and preview privately |
| Essential | 3,900 | 19 | One invitation with everything guests need, live 12 months |
| Signature | 6,900 | 35 | Personal links, languages, auspicious times, day-of view, check-in, link never expires |
| Duo | 9,900 | 49 | Wedding plus homecoming |
| Atelier | from 20,000 | from 99 | Designed for you |

Reasoning: Essential sits inside the LKR 3,500 to 5,500 band where most local buyers shop. Signature is priced above the band because nothing local combines its features, and stays below Invitation.lk's LKR 10,000 bundle. USD prices undercut Join Wedding (59), Vowberry (39 to 59) and Wedvite (89).

## 5. How it is built

- **Next.js 16** (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4.
- **Storage**: libSQL. A local SQLite file in development, a hosted libSQL database (for example Turso) in production through `DATABASE_URL`.
- **Accounts**: email and password, scrypt hashes, server-side sessions in an http-only cookie.
- **Invitation data**: one JSON document per invitation, validated and clamped on every save.
- **Rendering**: a single `InvitationView` component driven by CSS variables and container queries, so the same markup is correct full screen on a phone and inside the studio's phone frame.
- **No media licensing**: ornaments are SVG drawn in code and music is synthesised in the browser with the Web Audio API.

Key folders:

```
src/lib/invitation    types, palettes, lettering, occasions, templates, labels, time helpers
src/components/invitation   the renderer, sections, openings, effects, soundscapes
src/components/studio       the editor
src/components/site         marketing pages
src/components/dashboard    host dashboard
src/lib/server              database, accounts, invitation queries
src/app/actions             server actions
```

## 6. Sources

Research was done by fetching each site's live pages on 24 November 2026. Sites that could not be fetched: Greenvelope (blocked), Instagram (blocked, so Samana Studios was studied through its own website), HostMyWedding (did not resolve). Prices can change, so check them again before quoting them publicly.
