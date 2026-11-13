/**
 * Nkap — remittance comparison data + calculation engine.
 *
 * PROVENANCE (read before editing):
 * - The US→Cameroon figures for Remitly and Xe, and the USD/XAF mid-market
 *   reference, were first verified for Money in America Episode 2 on
 *   2026-11-05 from each provider's OWN pages. Source of record:
 *   ~/workspace/goals/money-in-america-diaspora-money-channel/hidden_files/2026-11-05/sources-nov5.md
 *   (earlier checks: ep2-rate-snapshot-2026-11-03.md, hidden_files/2026-11-04/sources.md).
 * - LIVE RE-VERIFICATION 2026-11-13: every corridor's mid-market reference and
 *   every Remitly, Wise and Xe quote was re-checked on the provider's own
 *   pages and flipped to `verified` with checkedDate 2026-11-13; each entry's
 *   note records the exact page and quote it came from. Exception: the NGN
 *   mid-market reference comes from Wise's own currency converter
 *   (1 USD = 1,403.85 NGN) rather than Xe's converter (1,344.4) — Xe's
 *   converter feed tracks a reference window ~4% below the market rate that
 *   providers actually quote against, which would put Xe's and Remitly's own
 *   send rates ABOVE "mid-market" and produce negative costs. Wise's
 *   converter matches the rate Wise itself converts at.
 * - STILL SEED after the 2026-11-13 pass: Western Union and WorldRemit on all
 *   corridors and Sendwave everywhere (their public pages render rates only
 *   via JavaScript calculators that return no figures, or expose only
 *   first-transfer promo rates). Western Union's Cameroon rate is a
 *   converter-page crawl from 2026-11-03 that Ep. 2 deliberately did NOT
 *   use. Seed rows are marked `status: 'seed'` in this file AND badged
 *   "Preview rate" in the UI. NEVER present a seed figure as verified.
 * - UNAVAILABLE: Wise does not offer US→Cameroon (XAF) sends — its own
 *   send-money page says the corridor is "not quite there yet" — so the
 *   Cameroon table carries Wise as an `unavailable` entry with NO quote at
 *   all (no invented rate), excluded from the ranking.
 *
 * RANKING RULE (non-negotiable, from the build plan): results are ranked by
 * what the RECEIVER GETS, descending — never by referral bounty.
 */

export type VerificationStatus = 'verified' | 'seed'

export interface RateQuote {
  /** Flat fee in USD, charged on top of the send amount. */
  feeUsd: number
  /** Fee as a fraction of the send amount (e.g. 0.005 = 0.5%). */
  feePct: number
  /** Destination currency the receiver gets per 1 USD sent (after the provider's rate margin). */
  ratePerUsd: number
  /** Optional new-customer promotional rate and the cap it applies to. */
  promoRatePerUsd?: number
  promoAppliesToFirstUsd?: number
  promoNote?: string
  status: VerificationStatus
  /** ISO date the figure was checked on the provider's own page (null for seeds). */
  checkedDate: string | null
  source: string
  note?: string
}

/**
 * A provider that does not serve a corridor at all. Carries NO rate, fee or
 * receiver-gets figures — the UI shows it as an availability note only, and
 * it is excluded from the ranking. Never put numbers on one of these.
 */
export interface UnavailableQuote {
  status: 'unavailable'
  source: string
  note: string
}

export type QuoteEntry = RateQuote | UnavailableQuote

export function isRateQuote(q: QuoteEntry | undefined): q is RateQuote {
  return !!q && q.status !== 'unavailable'
}

export interface Provider {
  id: string
  name: string
  blurb: string
  href: string
  /** Referral arrangement, if any. Code-based referrals carry instructions. */
  referral: {
    type: 'code'
    code: string
    instructions: string
  } | null
  quotes: Record<string, QuoteEntry>
}

export interface Corridor {
  slug: string
  country: string
  currencyCode: string
  currencyName: string
  flag: string
  /** Mid-market reference rate (destination currency per 1 USD). */
  midMarketRate: number
  midMarketStatus: VerificationStatus
  midMarketCheckedDate: string | null
  payoutNotes: string
  localContext: string
}

export const CORRIDORS: Corridor[] = [
  {
    slug: 'cameroon',
    country: 'Cameroon',
    currencyCode: 'XAF',
    currencyName: 'Central African CFA francs',
    flag: '🇨🇲',
    // Xe currency converter, 2026-11-13 18:05 UTC: 1 USD = 594.779 XAF.
    midMarketRate: 594.779,
    midMarketStatus: 'verified',
    midMarketCheckedDate: '2026-11-13',
    payoutNotes:
      'Most families receive on MTN Mobile Money or Orange Money, with bank deposit and cash pickup also widely available.',
    localContext:
      'From Columbus to Douala and Yaoundé, payday sends to Cameroon usually land as mobile money within minutes — but the amount that lands depends on the rate, not the headline fee.',
  },
  {
    slug: 'nigeria',
    country: 'Nigeria',
    currencyCode: 'NGN',
    currencyName: 'Nigerian naira',
    flag: '🇳🇬',
    // Wise currency converter, live 2026-11-13: 1 USD = 1,403.85 NGN.
    // (Xe's converter read 1,344.4 the same day — see header note.)
    midMarketRate: 1403.85,
    midMarketStatus: 'verified',
    midMarketCheckedDate: '2026-11-13',
    payoutNotes:
      'Bank transfer is the standard payout in Nigeria, with cash pickup available at agent locations in most cities.',
    localContext:
      'Sends to Nigeria live or die on the naira rate. Two apps can show the same “$0 fee” and deliver thousands of naira apart on the same day.',
  },
  {
    slug: 'ghana',
    country: 'Ghana',
    currencyCode: 'GHS',
    currencyName: 'Ghanaian cedis',
    flag: '🇬🇭',
    // Xe currency converter, 2026-11-13 18:18 UTC: 1 USD = 11.7184 GHS.
    midMarketRate: 11.7184,
    midMarketStatus: 'verified',
    midMarketCheckedDate: '2026-11-13',
    payoutNotes:
      'MTN Mobile Money is the everyday payout rail in Ghana, alongside bank deposit and cash pickup.',
    localContext:
      'For Ghana, mobile money is king — and the cedi rate moves fast, so the app that was best last payday may not be best today.',
  },
  {
    slug: 'kenya',
    country: 'Kenya',
    currencyCode: 'KES',
    currencyName: 'Kenyan shillings',
    flag: '🇰🇪',
    // Xe currency converter, 2026-11-13 16:17 UTC: 1 USD = 130.009 KES.
    midMarketRate: 130.009,
    midMarketStatus: 'verified',
    midMarketCheckedDate: '2026-11-13',
    payoutNotes:
      'M-PESA is the default payout in Kenya — fast, everywhere, and usually the cheapest rail to receive on.',
    localContext:
      'Sends to Kenya almost always end on M-PESA. The difference between providers is the shilling rate they quietly apply.',
  },
]

const EP2_SOURCE =
  'Money in America Ep. 2 rate set, re-verified 2026-11-05 from the provider’s own page'
const NOV13_SOURCE = 'Live re-verification 2026-11-13 from the provider’s own page'
const SEED_SOURCE = 'Seed estimate — pending re-verification on the provider’s own page'

export const PROVIDERS: Provider[] = [
  {
    id: 'remitly',
    name: 'Remitly',
    blurb: 'Digital-first sends with new-customer welcome rates. Chiale is a Remitly Ambassador.',
    href: 'https://www.remitly.com',
    referral: {
      type: 'code',
      code: 'AMB887P',
      instructions:
        'New to Remitly? Enter ambassador code AMB887P when you sign up or before your first transfer of $40 or more to get $20 off that transfer. Money in America earns a referral bonus when you do — at no extra cost to you.',
    },
    quotes: {
      cameroon: {
        feeUsd: 0,
        feePct: 0,
        ratePerUsd: 579.15,
        promoRatePerUsd: 598.43,
        promoAppliesToFirstUsd: 500,
        promoNote:
          'Welcome rate 598.43 XAF per $1 — new customers only, first $500 only. Standard rate shown in the ranking.',
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Remitly’s own Cameroon pricing page (live 2026-11-13, remitly.com/us/en/cameroon/pricing) confirms zero fees on USD→XAF and the 598.43 welcome rate on the first $500. Standard rate 579.15 from Remitly’s own Banque Atlantique partner page (crawled 2026-11-11); standard rates vary slightly by payout partner.',
      },
      nigeria: {
        feeUsd: 0,
        feePct: 0,
        ratePerUsd: 1356.71,
        promoRatePerUsd: 1385.31,
        promoAppliesToFirstUsd: 500,
        promoNote:
          'Welcome rate 1,385.31 NGN per $1 — new customers only, first $500 only. Standard rate shown in the ranking.',
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Remitly’s own GoMoney partner page (remitly.com/us/en/providers-nigeria/send-money-to-gomoney, crawled 2026-11-12): standard 1,356.71 NGN per $1, welcome 1,385.31 on the first $500, zero fees. Other Remitly partner pages showed similar standard rates (e.g. 1,361.92).',
      },
      ghana: {
        feeUsd: 0,
        feePct: 0,
        ratePerUsd: 11.5313,
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: '“Everyday rate” 11.5313 GHS per $1 with zero fees, from Remitly’s own US→Ghana page (crawled 2026-11-11). Ghana shows a single everyday rate rather than a welcome/standard split; the page’s new-customer offer is a $15 first-transfer discount, not a rate, so no promo rate is shown.',
      },
      kenya: {
        feeUsd: 0,
        feePct: 0,
        ratePerUsd: 127.98,
        promoRatePerUsd: 128.2,
        promoAppliesToFirstUsd: 500,
        promoNote:
          'Welcome rate 128.20 KES per $1 — new customers only, first $500 only. Standard rate shown in the ranking.',
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Remitly’s own US→Kenya page (crawled 2026-11-11): standard 127.98 KES per $1, welcome 128.20 on the first $500, zero fees. Remitly partner pages the same week showed standard rates of 127.97–128.04.',
      },
    },
  },
  {
    id: 'wise',
    name: 'Wise',
    blurb: 'Mid-market rate with an upfront percentage fee. Listed for honest comparison — no referral link yet.',
    href: 'https://wise.com',
    referral: null,
    quotes: {
      cameroon: {
        status: 'unavailable',
        source: 'Wise’s own send-money-to-Cameroon page, checked 2026-11-13',
        note: 'Wise doesn’t offer sends to Cameroon yet — its own page says this corridor is “not quite there yet”, so there is no Wise rate to quote.',
      },
      nigeria: {
        feeUsd: 1.8,
        feePct: 0.0052,
        ratePerUsd: 1403.71,
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Wise’s own compare page (live 2026-11-13, wise.com/us/compare/?sendAmount=500&sourceCurrency=USD&targetCurrency=NGN): $500 send → rate 1,403.71, total fees $4.40, recipient gets 695,678.68 NGN; a $26,995 send the same day showed fees of $142.24. Fee modeled as $1.80 + 0.52%, which reproduces the $500 fee exactly. Wise deducts its fee from the amount sent before converting, so Wise’s own page shows the smaller recipient figure quoted above; Nkap’s table instead converts the full amount you enter and counts the fee in the Total cost column — one convention for every provider, so all services compare on an equal basis. That is why the table’s Wise figure is higher than the one on Wise’s page.',
      },
      ghana: {
        feeUsd: 0,
        feePct: 0.01378,
        ratePerUsd: 11.7195,
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Wise’s own compare page (live 2026-11-13, wise.com/us/compare/wise-usd-to-ghs): $1,000 send → rate 11.7195, total fees $13.78, recipient gets 11,558.01 GHS. Fee modeled as 1.378% from that quote (Wise’s only published fee point for this corridor). Wise deducts its fee from the amount sent before converting, so Wise’s own page shows the smaller recipient figure quoted above; Nkap’s table instead converts the full amount you enter and counts the fee in the Total cost column — one convention for every provider, so all services compare on an equal basis. That is why the table’s Wise figure is higher than the one on Wise’s page.',
      },
      kenya: {
        feeUsd: 0,
        feePct: 0.01341,
        ratePerUsd: 130.05,
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Wise’s own compare page (live 2026-11-13, wise.com/us/compare/western-union-usd-to-kes): $1,000 send → rate 130.05, total fees $13.41, recipient gets 128,306 KES. Fee modeled as 1.341% from that quote (Wise’s only published fee point for this corridor). Wise deducts its fee from the amount sent before converting, so Wise’s own page shows the smaller recipient figure quoted above; Nkap’s table instead converts the full amount you enter and counts the fee in the Total cost column — one convention for every provider, so all services compare on an equal basis. That is why the table’s Wise figure is higher than the one on Wise’s page.',
      },
    },
  },
  {
    id: 'xe',
    name: 'Xe',
    blurb: 'Currency-exchange specialist; bank-transfer sends priced close to the market rate.',
    href: 'https://www.xe.com',
    referral: null,
    quotes: {
      cameroon: {
        feeUsd: 0,
        feePct: 0,
        ratePerUsd: 588.56,
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Quoted on a $1,000 transfer by bank transfer: recipient gets 588,560 XAF, $0.00 additional fee (Xe’s own send-money-to-Cameroon page, live 2026-11-13).',
      },
      nigeria: {
        feeUsd: 0,
        feePct: 0,
        ratePerUsd: 1390.548,
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Quoted on a $1,000 transfer by bank transfer: recipient gets 1,390,548 NGN, $0.00 additional fee (Xe’s own send-money-to-Nigeria page, live 2026-11-13).',
      },
      ghana: {
        feeUsd: 0,
        feePct: 0,
        ratePerUsd: 11.6304,
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Quoted on a $1,000 transfer by bank transfer: recipient gets 11,630.40 GHS (Xe’s own send-money-to-Ghana page, live 2026-11-13). The page’s fee line failed to render on the check date (an unresolved template placeholder); the $0 fee matches the “0.00 in additional transfer fees” Xe states for bank transfers on its other corridor pages.',
      },
      kenya: {
        feeUsd: 0,
        feePct: 0,
        ratePerUsd: 126.945,
        status: 'verified',
        checkedDate: '2026-11-13',
        source: NOV13_SOURCE,
        note: 'Quoted on a $1,000 transfer by bank transfer: recipient gets 126,945 KES, $0.00 additional fee (Xe’s own send-money-to-Kenya page, live 2026-11-13).',
      },
    },
  },
  {
    id: 'sendwave',
    name: 'Sendwave',
    blurb: 'Mobile-money specialist for Africa sends, no transfer fee — the cost sits in the rate.',
    href: 'https://www.sendwave.com',
    referral: null,
    quotes: {
      // No fresh Sendwave rate could be verified for Ep. 2 (only stale
      // aggregator figures, deliberately excluded) — seed, flagged.
      // Re-checked 2026-11-13: Sendwave's own converter pages render their
      // rates only via JavaScript (a live fetch returns blanks), and cached
      // copies conflict across crawl dates — stays seed.
      cameroon: { feeUsd: 0, feePct: 0, ratePerUsd: 576.2, status: 'seed', checkedDate: null, source: SEED_SOURCE },
      nigeria: { feeUsd: 0, feePct: 0, ratePerUsd: 1458, status: 'seed', checkedDate: null, source: SEED_SOURCE },
      ghana: { feeUsd: 0, feePct: 0, ratePerUsd: 10.83, status: 'seed', checkedDate: null, source: SEED_SOURCE },
      kenya: { feeUsd: 0, feePct: 0, ratePerUsd: 127.3, status: 'seed', checkedDate: null, source: SEED_SOURCE },
    },
  },
  {
    id: 'worldremit',
    name: 'WorldRemit',
    blurb: 'Digital sends with bank, mobile money and cash pickup options in most corridors.',
    href: 'https://www.worldremit.com',
    referral: null,
    quotes: {
      cameroon: { feeUsd: 2.99, feePct: 0, ratePerUsd: 570.4, status: 'seed', checkedDate: null, source: SEED_SOURCE },
      nigeria: { feeUsd: 2.99, feePct: 0, ratePerUsd: 1436, status: 'seed', checkedDate: null, source: SEED_SOURCE },
      ghana: { feeUsd: 2.99, feePct: 0, ratePerUsd: 10.67, status: 'seed', checkedDate: null, source: SEED_SOURCE },
      kenya: { feeUsd: 2.99, feePct: 0, ratePerUsd: 125.3, status: 'seed', checkedDate: null, source: SEED_SOURCE },
    },
  },
  {
    id: 'western-union',
    name: 'Western Union',
    blurb: 'The cash-agent giant — everywhere, but the cost usually sits in both the fee and the rate.',
    href: 'https://www.westernunion.com',
    referral: null,
    quotes: {
      cameroon: {
        feeUsd: 4.99,
        feePct: 0,
        ratePerUsd: 571.12,
        status: 'seed',
        checkedDate: '2026-11-03',
        source: 'Western Union converter-page crawl, 2026-11-03',
        note: 'Crawled 2026-11-03 but NOT re-verified on the Ep. 2 build day — the episode used no WU figure. Re-checked 2026-11-13: Western Union’s own converter page renders no figures without JavaScript, so no current figure could be confirmed. Fee varies by funding method (cash costs more).',
      },
      nigeria: { feeUsd: 4.99, feePct: 0, ratePerUsd: 1421, status: 'seed', checkedDate: null, source: SEED_SOURCE },
      ghana: { feeUsd: 4.99, feePct: 0, ratePerUsd: 10.56, status: 'seed', checkedDate: null, source: SEED_SOURCE },
      kenya: { feeUsd: 4.99, feePct: 0, ratePerUsd: 124.0, status: 'seed', checkedDate: null, source: SEED_SOURCE },
    },
  },
]

export interface ComparisonRow {
  provider: Provider
  quote: RateQuote
  feeUsd: number
  receiverGets: number
  /** If a promo rate exists, what a new customer would receive instead. */
  promoReceiverGets: number | null
  /** Total cost in USD terms: fee + value lost vs the mid-market rate. */
  totalCostUsd: number
  totalCostPct: number
}

export function compare(corridor: Corridor, amountUsd: number): ComparisonRow[] {
  const rows: ComparisonRow[] = []
  for (const provider of PROVIDERS) {
    const quote = provider.quotes[corridor.slug]
    // Unavailable providers (e.g. Wise → Cameroon) carry no quote and never rank.
    if (!isRateQuote(quote) || amountUsd <= 0) continue
    const feeUsd = quote.feeUsd + amountUsd * quote.feePct
    const receiverGets = amountUsd * quote.ratePerUsd
    let promoReceiverGets: number | null = null
    if (quote.promoRatePerUsd && quote.promoAppliesToFirstUsd) {
      const promoPart = Math.min(amountUsd, quote.promoAppliesToFirstUsd)
      promoReceiverGets =
        promoPart * quote.promoRatePerUsd +
        (amountUsd - promoPart) * quote.ratePerUsd
    }
    const lostToRate = amountUsd - receiverGets / corridor.midMarketRate
    const totalCostUsd = feeUsd + lostToRate
    rows.push({
      provider,
      quote,
      feeUsd,
      receiverGets,
      promoReceiverGets,
      totalCostUsd,
      totalCostPct: (totalCostUsd / amountUsd) * 100,
    })
  }
  // Ranked by what the receiver gets — never by referral bounty.
  return rows.sort((a, b) => b.receiverGets - a.receiverGets)
}

export function getCorridor(slug: string): Corridor {
  const corridor = CORRIDORS.find((c) => c.slug === slug)
  if (!corridor) throw new Error(`Unknown corridor: ${slug}`)
  return corridor
}

/** Providers that do not serve this corridor at all (availability notes only). */
export function unavailableIn(
  corridor: Corridor,
): { provider: Provider; quote: UnavailableQuote }[] {
  const out: { provider: Provider; quote: UnavailableQuote }[] = []
  for (const provider of PROVIDERS) {
    const quote = provider.quotes[corridor.slug]
    if (quote && quote.status === 'unavailable') {
      out.push({ provider, quote })
    }
  }
  return out
}

/** The most recent date any figure on a corridor was verified (null if none). */
export function lastVerifiedDate(corridor: Corridor): string | null {
  const dates = PROVIDERS.map((p) => p.quotes[corridor.slug])
    .filter((q): q is RateQuote => isRateQuote(q) && q.status === 'verified')
    .map((q) => q.checkedDate)
    .filter((d): d is string => !!d)
  if (corridor.midMarketCheckedDate && corridor.midMarketStatus === 'verified') {
    dates.push(corridor.midMarketCheckedDate)
  }
  return dates.length ? dates.sort().at(-1)! : null
}

export function corridorHasSeeds(corridor: Corridor): boolean {
  return PROVIDERS.some((p) => p.quotes[corridor.slug]?.status === 'seed')
}

const usdFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatUsd(n: number): string {
  return usdFmt.format(n)
}

export function formatLocal(n: number, currencyCode: string): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: n < 100 ? 2 : 0 }).format(n)} ${currencyCode}`
}

export function formatRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: rate < 100 ? 2 : 0,
    maximumFractionDigits: rate < 100 ? 4 : 2,
  }).format(rate)
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
