'use client'

/**
 * On-device activity log for Nkap: the comparisons a visitor ran and the
 * provider sites they clicked through to, stored ONLY in this browser's
 * localStorage (per signed-in user, or "guest"). Nothing is uploaded.
 *
 * Honest scope: Nkap never processes transfers, so this is a history of
 * CHECKS, not of sends — the Activity page says exactly that.
 */

export type ActivityEntry = {
  id: string
  ts: number
  type: 'check' | 'visit'
  corridorSlug: string
  country: string
  currencyCode: string
  amountUsd: number
  providerName?: string
  receiverGets?: number
  ratePerUsd?: number
}

const MAX_ENTRIES = 100
const keyFor = (owner: string) => `nkap-activity:${owner}`

export function readActivity(owner: string): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(keyFor(owner))
    if (!raw) return []
    const parsed = JSON.parse(raw) as ActivityEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(owner: string, entries: ActivityEntry[]) {
  try {
    localStorage.setItem(keyFor(owner), JSON.stringify(entries.slice(0, MAX_ENTRIES)))
  } catch {
    /* storage full/unavailable — activity simply won't persist */
  }
}

export function recordActivity(
  owner: string,
  entry: Omit<ActivityEntry, 'id' | 'ts'>,
) {
  const entries = readActivity(owner)
  const now = Date.now()
  // A stream of identical checks (same corridor, amount and best provider)
  // is one piece of activity — refresh its timestamp instead of piling up.
  if (entry.type === 'check') {
    const last = entries[0]
    if (
      last &&
      last.type === 'check' &&
      last.corridorSlug === entry.corridorSlug &&
      last.amountUsd === entry.amountUsd &&
      last.providerName === entry.providerName
    ) {
      last.ts = now
      save(owner, entries)
      return
    }
  }
  entries.unshift({
    ...entry,
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    ts: now,
  })
  save(owner, entries)
}

export function clearActivity(owner: string) {
  try {
    localStorage.removeItem(keyFor(owner))
  } catch {
    /* ignore */
  }
}
