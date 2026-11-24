# Things that need you

Nothing here blocked the build. Each item has a working default in place. They are listed in the order I would tackle them.

## Decisions

1. **Brand name.** I used the repository name, Invitely. Check the domain and trademark before launch. The name appears in `src/components/ui/kit.tsx` (logo), `src/app/layout.tsx` (titles) and the footer.
2. **Prices.** The plans in `src/lib/plans.ts` are my proposal from the market research (LKR 3,900 / 6,900 / 9,900 and from 20,000). Change the numbers there and every page follows. The reasoning is in `docs/PLAN.md`, section 4.
3. **Free publishing during testing.** With no payment gateway yet, publishing is free and unlocks every feature (`PAYMENTS_MODE` unset). Set `PAYMENTS_MODE=manual` to hold invitations until payment is confirmed. That mode shows a message to the host, but the admin screen to confirm a payment is not built yet.
4. **Refund and hosting promises.** The pricing page says "full refund within 7 days if the link has not been shared", "Essential lives 12 months" and "Signature never expires". These are placeholders for your policy. Edit them in `src/app/pricing/page.tsx`, `src/components/site/Faq.tsx` and `src/lib/plans.ts`.

## Services to set up

5. **Production database.** Create a libSQL database (Turso has a free tier) and set `DATABASE_URL` and `DATABASE_AUTH_TOKEN`. Without them the app writes to a local file, which does not survive on serverless hosting.
6. **Hosting.** The project builds cleanly for Vercel. I did not deploy anything, because that creates resources on your account. Say the word and I will deploy a preview. Set `NEXT_PUBLIC_SITE_URL` to the public address so share links and previews use it.
7. **Payment gateway.** PayHere for LKR and Stripe (or similar) for USD. I need merchant accounts and API keys to wire these in.
8. **Email or WhatsApp provider.** Needed for RSVP notifications and for sending a host their manage link if they lose it. Hosts have no accounts or passwords. They get back into a card with its private manage link, or with the invitation link plus the edit PIN they chose. A host who loses the link and set no PIN can only be helped by you, using the contact they left when creating the card.
9. **Photo storage.** Photos are compressed on the phone and stored in the database. That is fine for a launch, and should move to object storage (Vercel Blob, S3 or Cloudinary) as volume grows.

## Content I could not produce or verify

10. **Sinhala and Tamil wording.** I wrote the interface labels and two sample greetings in both languages (`src/lib/invitation/labels.ts`, `src/lib/invitation/templates.ts`). Please have a native speaker review them before launch.
11. **Sample photographs.** The demo invitations have no photos, because I had no licensed images to use. Arch and full photo covers show a drawn placeholder until a host adds a photo. A set of 10 to 15 licensed wedding photos would lift the designs gallery a lot.
12. **Samana Studios Instagram.** Instagram blocks automated viewing, so I could not see the posts. I studied their public website instead and followed that style: near-black background, oversized type, small tracked labels, hairline borders. If particular posts matter to you, send screenshots and I will adjust.
13. **Cultural details.** Ritual names, nekath examples and wording for the Tamil, Muslim, church, mehendi and almsgiving designs are my best understanding. The Avurudu design shows sample auspicious times and directions only, which change every year. Please check all of these with people from each tradition.
14. **Legal pages.** Terms, privacy policy and refund policy are not written.

## Known limits in this version

15. **Abuse protection.** Anyone can create a draft card without an account, so there is a light limit of 20 new cards per hour per network, and the public RSVP form has a simple flood guard per invitation. PIN entry locks for 15 minutes after five wrong tries. Add stronger rate limiting and a cleanup of old unpaid drafts before a public launch.
16. **Plan limits are not enforced.** Every published invitation currently has every feature.
17. **Music.** The three soundscapes are generated in the browser, so they are gentle ambience and not songs. Hosts can link their own MP3. A licensed music library is a later decision.
18. **Share preview image.** Links shared on WhatsApp show a generated card with the names, date and venue. It uses a plain built-in font, and names written in Sinhala or Tamil script are left off the card (the occasion, date and venue still show). Adding the invitation fonts to the card is a small follow-up.
19. **Competitor prices.** The figures in `docs/PLAN.md` were read from live sites on 24 November 2026 and will drift.

20. **Check-in link.** The door check-in page lives under the private manage link. Sharing it with an usher gives them full control of the card. A separate check-in only link is a small follow-up.
21. **Unused file.** `src/lib/server/auth.ts` is the old email and password code. Nothing uses it now. I could not remove it from this session, so please delete it, or keep it if you want a sign in for a future admin panel.
