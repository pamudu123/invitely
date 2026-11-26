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

### Visual direction: four seasons (November 2026)

The site has a winter, spring, summer and autumn look. Visitors choose one in Preferences (palette button in the header, or on My cards) and the `invitely_season` cookie remembers it. Winter, called Frost, came first and is the default. Invitations always keep the colours their host chose.

- `src/lib/season.ts` lists the seasons. `data-season` on `<html>` is set before the first paint, so pages stay static and do not flash.
- Colours for all four are in `src/components/site/season/seasons.css`. The drawings are next to it. `BySeason` writes words or drawings for each season and CSS shows one.

**Winter (Frost)**

A snow globe with a palace and a couple inside. Ice-light pages, navy text, royal blue actions, with violet, lagoon and mint as supporting colours. Deep blue is used for the hero, the closing section and the footer (the `.on-deep` class swaps the colour roles).

- Winter colour roles live in `src/app/globals.css`: page `#eef7ff`, text `#0f1c5c`, brand `#2740c9`. Winter artwork and the section styles shared by all seasons live in `src/components/site/frost/`.
- Every text and background pair on the site is kept at 4.5:1 contrast or better.
- Type: Marcellus for large headings only, Figtree for everything else. No text below 12px.
- The site is in English only and prices are in USD only. New cards are English only. The Sinhala and Tamil labels remain in the code for cards saved before this change, and earlier mentions of LKR and languages in this document are research history.

## 3. Features and phases

### Phase 1: the core product (built)

| Area | What is built |
| --- | --- |
| Invitation engine | One theme-driven renderer. 32 palettes, 11 lettering pairs, 18 ornament sets drawn as SVG, 9 cover layouts, 10 openings, 3 generated soundscapes, 4 floating effects |
| Designs | 34 templates across 15 occasions: wedding, homecoming, engagement, mehendi, save the date, birthday, anniversary, baby shower, housewarming, coming of age, almsgiving, graduation, festive gatherings (Avurudu, Christmas, Eid, Deepavali), corporate, other |
| Sections | Cover, message, countdown, auspicious times, schedule, venue with map and calendar link, story, gallery, good to know, gift note, RSVP, wishes wall |
| Studio | Live preview while typing. Phone frame on desktop, full screen with bottom sheet editor on mobile. Change design, colours, lettering, ornament, cover, opening, sound, sections, order, wording, photos |
| No accounts | A host never signs up. Each card has a private manage link, plus an optional edit PIN to open it on another phone. Cards opened on a device are remembered under My cards |
| Guests | Personal link per guest or family with name greeting and reserved seats. Bulk add by pasting a list |
| RSVP | Accept or decline, party size, meal choice, a custom question, a wish. Replies matched to the guest list |
| Languages | English, Sinhala and Tamil labels and dates, guest-side switch, host-written translations for the main lines |
| Living invitation | Automatic before, on the day and after views, with a preview switch in the studio |
| Manage page | Reply stats, guest list with WhatsApp send, replies with CSV export, QR code, door check-in, link settings |
| Site | Landing page with a live tappable demo, designs gallery with occasion filter, design pages, pricing |

### Phase 2: money and trust

1. Payments: PayHere for LKR, Stripe or similar for USD. A manual bank transfer mode already exists as a switch (`PAYMENTS_MODE=manual`), and needs an admin screen to confirm payments.
2. Plan gating: enforce the Essential and Signature feature split, which is currently open.
3. Lost link recovery by email or WhatsApp, for hosts who did not set a PIN (needs an email or messaging provider).
4. Object storage for photos (currently stored in the database, fine for launch volume only).
5. Share image polish: the WhatsApp preview card exists, and should use the invitation's own lettering and support Sinhala and Tamil names.
6. Terms, privacy policy and refund policy pages.
7. Native speaker review of Sinhala and Tamil labels.
8. Sample photography for the demo invitations.

### Phase 3: growth

1. RSVP reminders to guests who have not replied, by WhatsApp.
2. Guest photo upload and shared album after the event.
3. Seating plan with table lookup on the day.
4. Opened and viewed tracking per guest on the manage page (the data is already recorded).
5. Gift registry and cash gift block with bank details or a payment link.
6. Custom domains.
7. Save the date as a lighter product that credits toward the full invitation.
8. Duplicate an invitation, to make the homecoming from the wedding in one tap.
9. More openings (carved doors, betel leaf sheaf, kuthu vilakku with five wicks) and more designs per occasion.

### Phase 4: scale

1. Atelier workflow: brief form, proofs and revision rounds inside the product.
2. A designer marketplace for templates.
3. Analytics for hosts: opens over time, reply rate, device split.
4. More languages for diaspora and regional markets.

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

### Review by the team

After editing, a host can ask the team to finish the card for them.

1. On the review page the host taps any spot on their card. A numbered pin drops there and they type what should change. Each pin records the section and the words under the tap.
2. They send the list. The card shows as "With our team".
3. The team sees a queue at `/admin`, opens the card with its pins, and edits it in the studio or with Claude Code.
4. The team marks it ready with a short reply. The host sees "Ready for you to check".
5. The host confirms, or pins more changes for another round. Review stays open until the host confirms. After that it closes.

**Editing one card with Claude Code.** `npm run card -- pull <slug>` saves that card as `cards/<slug>/card.json` with the host's notes in `REVIEW.md`. `npm run card -- push <slug> --ready "message"` sends it back and tells the host. The `/revise-card <slug>` command in Claude Code does the whole loop and is told to touch only that one file. Pushed data goes through the same checks as the studio, so a wrong value cannot break a card.

### Image cards and printed cards

Two separate features sit on top of every web card.

**Image card (included).** The web design as a picture, for WhatsApp, a status or a family group. Seven layouts follow the card's colours, lettering and ornament, in portrait, story, square and wide shapes. It can carry a guest's name, and it is shared straight to the phone's share sheet or downloaded as a PNG.

**Printed card (optional add-on).** A separate collection of designs for physical cards. Research into what print shops sell showed that arch tops are the leading shaped card this year, followed by scalloped edges, circles, tickets and hexagons, and that nobody sells a betel leaf, moonstone or lotus petal card. So most of the collection is not rectangular:

| Shape | Design |
| --- | --- |
| Temple arch | Thorana |
| Betel leaf | Bulath Kole |
| Arch top | Archway |
| Round | Sanda |
| Moonstone half circle | Sandakada |
| Scalloped flower | Araliya |
| Lotus petal | Nelum Pethi |
| Long strip with string holes | Ola Leaf |
| Scooped corners | Deco Plaque |
| Hexagon | Kavaya |
| Luggage tag with punched hole | Journey Tag |
| Ticket with stub | Admit One |
| Rectangle | Heirloom, Pahana, Twilight, Margin |

Every printed card has a back with a QR code that opens the web card, so paper and screen work together. A guest can be picked to print their name and their personal QR code. The download is a PDF with the front and back at 300 dpi and a 3 mm bleed, plus a page with the cut line as a vector outline, which is what print shops ask for when a card is die cut or laser cut.

**Make it yours.** Both cards start out matching the web card, and a host can change each one on its own: colours, lettering, type sizes, light or dark, wording, ornament, and which parts show. Straight edged printed cards can also take another front layout. Hosts upload their own pictures: a main picture behind the words, in a round frame above the names, or as the whole side for artwork made elsewhere, plus up to six logos or small pictures they drag into place. Printed cards warn when a picture is too small to print well. Changes save by themselves and are stored with the card under `cards.image` and `cards.print`, apart from what the studio edits. On the web card, paper covers can show a photo behind the words.

Ideas held for later: gatefold and pocket folds, a sesath fan, a pun kalasa pot, a standing lamp silhouette, vellum overlays and belly bands.

## 4. Pricing proposal

One payment per event, no subscription, unlimited guests. Free to design, pay to publish. Numbers sit in `src/lib/plans.ts`.

| Plan | LKR | USD | For |
| --- | --- | --- | --- |
| Design | Free | Free | Build and preview privately |
| Essential | 3,900 | 19 | One invitation with everything guests need, live 12 months |
| Signature | 6,900 | 35 | Personal links, languages, auspicious times, day-of view, check-in, link never expires |
| Duo | 9,900 | 49 | Wedding plus homecoming |
| Atelier | from 20,000 | from 99 | Designed for you |
| Printed card design (add-on) | 1,500 | 7 | Print-ready file for a physical card, per design |

Reasoning: Essential sits inside the LKR 3,500 to 5,500 band where most local buyers shop. Signature is priced above the band because nothing local combines its features, and stays below Invitation.lk's LKR 10,000 bundle. USD prices undercut Join Wedding (59), Vowberry (39 to 59) and Wedvite (89).

## 5. How it is built

- **Next.js 16** (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4.
- **Storage**: libSQL. A local SQLite file in development, a hosted libSQL database (for example Turso) in production through `DATABASE_URL`.
- **No accounts**: charging is per card, so there is no sign up. Whoever holds a card's private manage link owns it. The link is a long random token, kept out of search engines and referrer headers. An optional 4 to 8 digit edit PIN, stored as a scrypt hash and locked for 15 minutes after five wrong tries, opens the card from another device.
- **Invitation data**: one JSON document per invitation, validated and clamped on every save.
- **Rendering**: a single `InvitationView` component driven by CSS variables and container queries, so the same markup is correct full screen on a phone and inside the studio's phone frame.
- **No media licensing**: ornaments are SVG drawn in code and music is synthesised in the browser with the Web Audio API.

Key folders:

```
src/lib/invitation    types, palettes, lettering, occasions, templates, labels, time helpers
src/components/invitation   the renderer, sections, openings, effects, soundscapes
src/components/studio       the editor
src/components/site         marketing pages
src/components/dashboard    host manage pages
src/lib/server              database, manage tokens, invitation queries
src/app/actions             server actions
```

## 6. Sources

Research was done by fetching each site's live pages on 24 November 2026. Sites that could not be fetched: Greenvelope (blocked), Instagram (blocked, so Samana Studios was studied through its own website), HostMyWedding (did not resolve). Prices can change, so check them again before quoting them publicly.
