'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUp,
  Download,
  Scale,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/nkap/auth-context'
import {
  clearActivity,
  readActivity,
  type ActivityEntry,
} from '@/lib/nkap/activity'
import { CORRIDORS, formatLocal, formatUsd } from '@/lib/nkap/rates'
import { cn } from '@/lib/utils'

type TypeFilter = 'all' | 'check' | 'visit'
type DateFilter = 'all' | '7' | '30' | '90' | 'custom'

interface Filters {
  date: DateFilter
  from: string
  to: string
  type: TypeFilter
  country: string // corridor slug, or 'all'
  provider: string // provider name, or 'all'
}

const DEFAULT_FILTERS: Filters = {
  date: 'all',
  from: '',
  to: '',
  type: 'all',
  country: 'all',
  provider: 'all',
}

const TYPE_LABEL: Record<TypeFilter, string> = {
  all: 'All activity',
  check: 'Comparisons',
  visit: 'Provider visits',
}

/** "Nov 13th" style group heading, like the reference app. */
function dayLabel(ts: number): string {
  const d = new Date(ts)
  const day = d.getDate()
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'
  return `${d.toLocaleDateString('en-US', { month: 'short' })} ${day}${suffix}`
}

function matchesFilters(e: ActivityEntry, f: Filters): boolean {
  if (f.type !== 'all' && e.type !== f.type) return false
  if (f.country !== 'all' && e.corridorSlug !== f.country) return false
  if (f.provider !== 'all' && e.providerName !== f.provider) return false
  if (f.date === '7' || f.date === '30' || f.date === '90') {
    const days = Number(f.date)
    if (e.ts < Date.now() - days * 86_400_000) return false
  } else if (f.date === 'custom') {
    if (f.from) {
      const start = new Date(`${f.from}T00:00:00`).getTime()
      if (!Number.isNaN(start) && e.ts < start) return false
    }
    if (f.to) {
      const end = new Date(`${f.to}T23:59:59`).getTime()
      if (!Number.isNaN(end) && e.ts > end) return false
    }
  }
  return true
}

function toCsv(entries: ActivityEntry[]): string {
  const esc = (v: string | number | undefined) =>
    v === undefined ? '' : `"${String(v).replace(/"/g, '""')}"`
  const lines = [
    'Date,Type,Destination,Amount sent (USD),Provider,Recipient gets,Currency,Rate per USD',
  ]
  for (const e of entries) {
    lines.push(
      [
        esc(new Date(e.ts).toISOString()),
        esc(e.type === 'check' ? 'Comparison' : 'Provider visit'),
        esc(e.country),
        esc(e.amountUsd),
        esc(e.providerName ?? ''),
        esc(e.receiverGets ?? ''),
        esc(e.currencyCode),
        esc(e.ratePerUsd ?? ''),
      ].join(','),
    )
  }
  return lines.join('\n')
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-4 py-2 text-sm transition-colors',
        selected
          ? 'border-primary/40 bg-primary/10 font-semibold text-primary'
          : 'border-border bg-card text-foreground hover:border-primary/40',
      )}
    >
      {children}
    </button>
  )
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-2.5 text-sm font-medium text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

/**
 * Activity screen (modelled on the reference app's Transactions tab):
 * the visitor's own comparison checks and provider visits, grouped by
 * day, searchable, filterable via a bottom-sheet (Date / Type /
 * Destination / Provider) and downloadable as CSV. Everything lives on
 * this device only — and the page says plainly these are checks, not
 * transfers: Nkap never processes transfers, so there are no deposit,
 * pending or completed statuses to filter by.
 */
export function ActivityList() {
  const { user, loading } = useAuth()
  const owner = user?.uid ?? 'guest'
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [query, setQuery] = useState('')
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS)
  const [draft, setDraft] = useState<Filters>(DEFAULT_FILTERS)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    if (!loading) setEntries(readActivity(owner))
  }, [loading, owner])

  const providers = useMemo(() => {
    const names = new Set<string>()
    for (const e of entries) if (e.providerName) names.add(e.providerName)
    return [...names].sort()
  }, [entries])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      if (!matchesFilters(e, applied)) return false
      if (!q) return true
      return (
        e.country.toLowerCase().includes(q) ||
        (e.providerName ?? '').toLowerCase().includes(q) ||
        e.currencyCode.toLowerCase().includes(q)
      )
    })
  }, [entries, query, applied])

  const groups = useMemo(() => {
    const out: Array<{ label: string; items: ActivityEntry[] }> = []
    for (const e of visible) {
      const label = dayLabel(e.ts)
      const last = out[out.length - 1]
      if (last && last.label === label) last.items.push(e)
      else out.push({ label, items: [e] })
    }
    return out
  }, [visible])

  const filtersActive =
    JSON.stringify(applied) !== JSON.stringify(DEFAULT_FILTERS)

  const download = () => {
    const blob = new Blob([toCsv(visible)], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nkap-activity.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const openSheet = () => {
    setDraft(applied)
    setSheetOpen(true)
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading activity…</p>
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">Search activity</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-border bg-card py-3.5 pl-12 pr-4 text-base text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <button
          type="button"
          onClick={openSheet}
          aria-label="Open filters"
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-opacity hover:opacity-90"
        >
          <SlidersHorizontal className="h-5 w-5" />
          {filtersActive && (
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-primary" />
          )}
        </button>
      </div>
      <p className="mt-2 text-xs font-medium text-muted-foreground">
        {TYPE_LABEL[applied.type]}
        {filtersActive && (
          <>
            {' · filters on · '}
            <button
              type="button"
              onClick={() => setApplied(DEFAULT_FILTERS)}
              className="font-semibold text-primary hover:underline"
            >
              Reset
            </button>
          </>
        )}
        {visible.length > 0 && (
          <>
            {' · '}
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <Download className="h-3.5 w-3.5" /> Download CSV
            </button>
          </>
        )}
      </p>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-border bg-card p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Scale className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            No activity yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Run your first comparison and it will appear here — every check
            you make and every provider you visit, kept on this device.
          </p>
          <Link
            href="/#compare"
            className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Compare rates now
          </Link>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing matches your search and filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setApplied(DEFAULT_FILTERS)
            }}
            className="mt-3 font-semibold text-primary hover:underline"
          >
            Reset search and filters
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-6">
          {groups.map((g) => (
            <section key={g.label}>
              <h2 className="mb-2 px-1 text-sm font-medium text-muted-foreground">
                {g.label}
              </h2>
              <div className="divide-y divide-border rounded-3xl border border-border bg-card px-5 shadow-sm">
                {g.items.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 py-4">
                    <span
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                        e.type === 'visit'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-primary/10 text-primary',
                      )}
                    >
                      {e.type === 'visit' ? (
                        <ArrowUp className="h-5 w-5" />
                      ) : (
                        <Scale className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-base font-bold text-foreground">
                        {e.type === 'visit'
                          ? `Visited ${e.providerName ?? 'provider'} · ${e.country}`
                          : `Checked ${formatUsd(e.amountUsd)} to ${e.country}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {e.type === 'visit'
                          ? 'Opened the provider’s site'
                          : `Best: ${e.providerName ?? '—'}`}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-heading text-base font-bold text-foreground">
                        {formatUsd(e.amountUsd)}
                      </p>
                      {e.receiverGets !== undefined && (
                        <p className="text-sm text-muted-foreground">
                          {e.currencyCode === 'XAF'
                            ? `FCFA ${new Intl.NumberFormat('en-US').format(Math.round(e.receiverGets))}`
                            : formatLocal(e.receiverGets, e.currencyCode)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="text-center">
            {confirmClear ? (
              <span className="inline-flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Clear all activity on this device?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearActivity(owner)
                    setEntries([])
                    setConfirmClear(false)
                  }}
                  className="font-semibold text-destructive hover:underline"
                >
                  Yes, clear it
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="font-medium text-muted-foreground hover:underline"
                >
                  Keep it
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Clear activity on this device
              </button>
            )}
          </div>
        </div>
      )}

      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Filter activity"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="max-h-[88svh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Filter
              </h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <FilterSection title="Date">
                <Chip
                  selected={draft.date === 'all'}
                  onClick={() => setDraft({ ...draft, date: 'all' })}
                >
                  All
                </Chip>
                <Chip
                  selected={draft.date === '7'}
                  onClick={() => setDraft({ ...draft, date: '7' })}
                >
                  7 Days
                </Chip>
                <Chip
                  selected={draft.date === '30'}
                  onClick={() => setDraft({ ...draft, date: '30' })}
                >
                  30 Days
                </Chip>
                <Chip
                  selected={draft.date === '90'}
                  onClick={() => setDraft({ ...draft, date: '90' })}
                >
                  90 Days
                </Chip>
                <Chip
                  selected={draft.date === 'custom'}
                  onClick={() => setDraft({ ...draft, date: 'custom' })}
                >
                  Custom
                </Chip>
                {draft.date === 'custom' && (
                  <div className="flex w-full flex-wrap items-center gap-2 pt-1">
                    <label className="text-sm text-muted-foreground">
                      From{' '}
                      <input
                        type="date"
                        value={draft.from}
                        onChange={(e) =>
                          setDraft({ ...draft, from: e.target.value })
                        }
                        className="ml-1 rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-foreground"
                      />
                    </label>
                    <label className="text-sm text-muted-foreground">
                      To{' '}
                      <input
                        type="date"
                        value={draft.to}
                        onChange={(e) =>
                          setDraft({ ...draft, to: e.target.value })
                        }
                        className="ml-1 rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-foreground"
                      />
                    </label>
                  </div>
                )}
              </FilterSection>

              <FilterSection title="Type">
                <Chip
                  selected={draft.type === 'all'}
                  onClick={() => setDraft({ ...draft, type: 'all' })}
                >
                  All
                </Chip>
                <Chip
                  selected={draft.type === 'check'}
                  onClick={() => setDraft({ ...draft, type: 'check' })}
                >
                  Comparisons
                </Chip>
                <Chip
                  selected={draft.type === 'visit'}
                  onClick={() => setDraft({ ...draft, type: 'visit' })}
                >
                  Provider visits
                </Chip>
              </FilterSection>

              <FilterSection title="Destination">
                <Chip
                  selected={draft.country === 'all'}
                  onClick={() => setDraft({ ...draft, country: 'all' })}
                >
                  All
                </Chip>
                {CORRIDORS.map((c) => (
                  <Chip
                    key={c.slug}
                    selected={draft.country === c.slug}
                    onClick={() => setDraft({ ...draft, country: c.slug })}
                  >
                    {c.flag} {c.currencyCode}
                  </Chip>
                ))}
              </FilterSection>

              {providers.length > 0 && (
                <FilterSection title="Provider">
                  <Chip
                    selected={draft.provider === 'all'}
                    onClick={() => setDraft({ ...draft, provider: 'all' })}
                  >
                    All
                  </Chip>
                  {providers.map((p) => (
                    <Chip
                      key={p}
                      selected={draft.provider === p}
                      onClick={() => setDraft({ ...draft, provider: p })}
                    >
                      {p}
                    </Chip>
                  ))}
                </FilterSection>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setDraft(DEFAULT_FILTERS)}
                className="flex-1 rounded-full bg-primary/10 py-3.5 font-heading text-base font-bold text-primary transition-colors hover:bg-primary/15"
              >
                Reset filter
              </button>
              <button
                type="button"
                onClick={() => {
                  setApplied(draft)
                  setSheetOpen(false)
                }}
                className="flex-1 rounded-full bg-primary py-3.5 font-heading text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Apply filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
