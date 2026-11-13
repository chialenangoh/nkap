# Nkap

**See what home actually receives.** Nkap is the remittance-comparison tool
from the [Money in America](https://www.youtube.com/@MoneyInAmericaUS)
YouTube channel. A visitor enters an amount and a destination; Nkap shows
what the receiver **actually gets** from each major service — the visible fee
plus the hidden exchange-rate margin — ranked strictly by what the receiver
gets, never by referral bounty.

Launch corridors (US →): Cameroon · Nigeria · Ghana · Kenya, each with its
own page ("Cheapest way to send money to Cameroon", etc.).

This is a standalone public website: no accounts, no sign-in, no database,
and it never touches anyone's money — comparison and referral only.

## Run it locally

```bash
npm install
npm run build
npm start          # production server on http://localhost:3000
# or: npm run dev  # development server
```

## What's inside

- `/` — hero + comparison calculator + corridor cards
- `/send-money-to-cameroon|nigeria|ghana|kenya` — corridor pages
- `/how-it-works` — methodology, ranking rule, the 60-second check
- `/privacy`, `/terms` — written for this site (no accounts, no money handling)
- `lib/nkap/rates.ts` — rate data + comparison engine. **Read its header
  before editing:** only the Cameroon Remitly/Xe figures are verified
  (2026-11-05, Money in America Ep. 2 rate set); everything else is a seed
  estimate, marked `status: 'seed'` in data and badged "Preview rate" in the
  UI. Never present a seed figure as verified.
- `lib/nkap/site.ts` — brand constants + the two compliance lines (FTC
  affiliate disclosure, "Education, not financial advice") that the footer
  renders on every page.

## Deployment — remaining steps (not yet done)

1. Put this folder in its own Git repository / hosting route (it was split
   out of the KingdomTube repo on 2026-11-13; KingdomTube itself was restored
   untouched and is a separate app).
2. Create the Render service from `render.yaml` in this repo — the service
   is named **nkap**, so its Render URL is **https://nkap.onrender.com**.
3. (Optional, later) Attach the custom domain `nkap.kingdomtube.company`:
   add it under the service's Custom Domains, then add a CNAME at Name.com:
   host `nkap` → `nkap.onrender.com`.
4. Before public launch: re-verify every seed rate on the providers' own
   pages and flip them to `verified` with dates (build-plan step 3), and wire
   the scheduled re-verification so no stale rate stays up.
5. Funnel: link Nkap from Money in America video descriptions, the "Check
   THIS Number" Short, community posts, and the My Businesses page.

## Compliance (non-negotiable)

- FTC affiliate disclosure wherever a referral link/code appears.
- "Education, not financial advice" on every page (site footer).
- Rankings by receiver-gets only. Trust is the product.
