'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, BadgeCheck, Copy, FlaskConical, Info, Trophy } from 'lucide-react'
import {
  CORRIDORS,
  compare,
  corridorHasSeeds,
  formatDate,
  formatLocal,
  formatRate,
  formatUsd,
  getCorridor,
  lastVerifiedDate,
  unavailableIn,
  type ComparisonRow,
  type Provider,
  type UnavailableQuote,
} from '@/lib/nkap/rates'
import { cn } from '@/lib/utils'

const QUICK_AMOUNTS = [100, 200, 500, 1000]

export function Calculator({
  defaultCorridor = 'cameroon',
  defaultAmount = 500,
}: {
  defaultCorridor?: string
  defaultAmount?: number
}) {
  const [slug, setSlug] = useState(defaultCorridor)
  const [amountText, setAmountText] = useState(String(defaultAmount))

  const corridor = getCorridor(slug)
  const amount = Number.parseFloat(amountText.replace(/[^0-9.]/g, '')) || 0
  const rows = useMemo(
    () => (amount > 0 ? compare(corridor, amount) : []),
    [corridor, amount],
  )
  const verifiedDate = lastVerifiedDate(corridor)
  const hasSeeds = corridorHasSeeds(corridor)
  const unavailable = useMemo(() => unavailableIn(corridor), [corridor])
  const best = rows[0]
  const worst = rows[rows.length - 1]

  return (
    <section id="compare" className="scroll-mt-24">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              You send (USD)
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <input
                inputMode="decimal"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-7 pr-3 text-lg font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                aria-label="Amount in US dollars"
              />
            </div>
            <div className="mt-2 flex gap-1.5">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmountText(String(q))}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                    amount === q
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  ${q}
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Sending to
            </span>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {CORRIDORS.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setSlug(c.slug)}
                  className={cn(
                    'rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                    c.slug === slug
                      ? 'border-primary bg-primary/10 font-semibold text-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span className="block text-base leading-none">{c.flag}</span>
                  <span className="mt-1 block">{c.country}</span>
                  <span className="block text-xs text-muted-foreground">
                    {c.currencyCode}
                  </span>
                </button>
              ))}
            </div>
          </label>
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            Market reference: 1 USD ≈ {formatRate(corridor.midMarketRate)}{' '}
            {corridor.currencyCode}
            {corridor.midMarketStatus === 'verified' &&
            corridor.midMarketCheckedDate
              ? ` (checked ${formatDate(corridor.midMarketCheckedDate)})`
              : ' (preview estimate)'}
            . Ranked by what the receiver gets — never by what we earn.
          </span>
        </p>

        {hasSeeds && (
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Rows marked <strong className="text-foreground">Preview rate</strong>{' '}
              are estimates still being verified against each provider’s own
              pages
              {verifiedDate
                ? ` — the verified figures on this page were last checked ${formatDate(verifiedDate)}`
                : ''}
              . Always confirm the final amount in the provider’s app before
              you send.
            </span>
          </p>
        )}

        {amount > 0 ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Service</th>
                  <th className="py-2 pr-3 font-medium">Fee</th>
                  <th className="py-2 pr-3 font-medium">Rate (per $1)</th>
                  <th className="py-2 pr-3 font-medium">Total cost</th>
                  <th className="py-2 pr-3 text-right font-medium">
                    Receiver gets
                  </th>
                  <th className="py-2 font-medium" aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <ResultRow key={row.provider.id} row={row} rank={i} corridor={corridor} />
                ))}
                {unavailable.map(({ provider, quote }) => (
                  <UnavailableRow
                    key={provider.id}
                    provider={provider}
                    quote={quote}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Enter an amount to compare what each service would deliver.
          </p>
        )}

        {best && worst && rows.length > 1 && (
          <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm leading-relaxed text-foreground">
            On {formatUsd(amount)}, the best and worst options above differ by{' '}
            <strong>
              {formatLocal(
                best.receiverGets - worst.receiverGets,
                corridor.currencyCode,
              )}
            </strong>{' '}
            — money your family either receives or loses to fees and the rate.
            That gap, not the headline fee, is the number to check before every
            send.
          </p>
        )}
      </div>
    </section>
  )
}

function ResultRow({
  row,
  rank,
  corridor,
}: {
  row: ComparisonRow
  rank: number
  corridor: ReturnType<typeof getCorridor>
}) {
  const [copied, setCopied] = useState(false)
  const { provider, quote } = row
  const isBest = rank === 0

  const copyCode = async () => {
    if (!provider.referral) return
    try {
      await navigator.clipboard.writeText(provider.referral.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <tr
        className={cn(
          'border-b border-border align-top',
          isBest && 'bg-primary/5',
        )}
      >
        <td className="py-3 pr-3">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            {provider.name}
            {isBest && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                <Trophy className="h-3 w-3" /> Most received
              </span>
            )}
          </span>
          <span className="mt-0.5 block max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
            {provider.blurb}
          </span>
          <span className="mt-1 block text-[11px] text-muted-foreground">
            {quote.status === 'verified' && quote.checkedDate ? (
              <span className="inline-flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-primary" />
                Rate checked {formatDate(quote.checkedDate)}
              </span>
            ) : (
              <span className="font-medium text-foreground/70">
                Preview rate
                {quote.checkedDate
                  ? ` · last seen ${formatDate(quote.checkedDate)}`
                  : ''}
              </span>
            )}
          </span>
        </td>
        <td className="py-3 pr-3 text-foreground">
          {row.feeUsd <= 0.005 ? (
            <span className="font-medium">$0</span>
          ) : (
            formatUsd(row.feeUsd)
          )}
          {quote.feePct > 0 && (
            <span className="block text-xs text-muted-foreground">
              {(quote.feePct * 100).toFixed(2)}% of amount
            </span>
          )}
        </td>
        <td className="py-3 pr-3 text-foreground">
          {formatRate(quote.ratePerUsd)} {corridor.currencyCode}
        </td>
        <td className="py-3 pr-3 text-muted-foreground">
          {quote.status === 'seed' ? (
            <>
              —
              <span className="block text-xs">
                estimate — cost not shown for preview rates
              </span>
            </>
          ) : (
            <>
              ≈ {formatUsd(row.totalCostUsd)}
              <span className="block text-xs">
                {row.totalCostPct.toFixed(1)}% of send
              </span>
            </>
          )}
        </td>
        <td className="py-3 pr-3 text-right">
          <span className="font-heading text-base font-bold text-foreground">
            {formatLocal(row.receiverGets, corridor.currencyCode)}
          </span>
          {row.promoReceiverGets !== null && (
            <span className="block text-xs text-muted-foreground">
              New customers:{' '}
              {formatLocal(row.promoReceiverGets, corridor.currencyCode)}
            </span>
          )}
        </td>
        <td className="py-3 text-right">
          <a
            href={provider.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Visit <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </td>
      </tr>
      {(quote.promoNote || quote.note || provider.referral) && (
        <tr className="border-b border-border">
          <td colSpan={6} className="pb-3 pt-0">
            <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
              {quote.promoNote && <p>★ {quote.promoNote}</p>}
              {quote.note && <p>{quote.note}</p>}
              {provider.referral && (
                <p className="flex flex-wrap items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-foreground">
                  <span>{provider.referral.instructions}</span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs font-bold"
                  >
                    {provider.referral.code}
                    <Copy className="h-3 w-3" />
                  </button>
                  {copied && <span className="text-primary">Copied!</span>}
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/**
 * A provider that does not serve this corridor: shown for completeness with
 * an availability note only — no rate, no cost, no receiver-gets, and it is
 * never part of the ranking.
 */
function UnavailableRow({
  provider,
  quote,
}: {
  provider: Provider
  quote: UnavailableQuote
}) {
  return (
    <tr className="border-b border-border align-top opacity-75">
      <td className="py-3 pr-3">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          {provider.name}
          <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            Not available yet
          </span>
        </span>
        <span className="mt-0.5 block max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
          {quote.note}
        </span>
      </td>
      <td className="py-3 pr-3 text-muted-foreground">—</td>
      <td className="py-3 pr-3 text-muted-foreground">—</td>
      <td className="py-3 pr-3 text-muted-foreground">—</td>
      <td className="py-3 pr-3 text-right text-muted-foreground">—</td>
      <td className="py-3 text-right">
        <a
          href={provider.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary"
        >
          Visit <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </td>
    </tr>
  )
}
