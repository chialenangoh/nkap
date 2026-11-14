'use client'

import { useState } from 'react'
import { BellRing, Mail } from 'lucide-react'
import { CORRIDORS, type Corridor } from '@/lib/nkap/rates'

/**
 * Rate-alert signup (v1): posts to FormSubmit's AJAX endpoint, which emails
 * each signup to Chiale. NOTE: FormSubmit requires a one-time activation
 * click from the first submission email before signups actually deliver.
 * This is an education tool only — never financial advice.
 */
export function RateAlertSignup({ corridor }: { corridor: Corridor }) {
  const [email, setEmail] = useState('')
  const [slug, setSlug] = useState(corridor.slug)
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>(
    'idle',
  )

  const selected = CORRIDORS.find((c) => c.slug === slug) ?? corridor

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')
    try {
      const res = await fetch(
        'https://formsubmit.co/ajax/chialenangoh@gmail.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email,
            corridor: `${selected.country} (${selected.currencyCode})`,
            _subject: 'Nkap rate alert signup',
          }),
        },
      )
      const data = (await res.json().catch(() => null)) as {
        success?: string | boolean
      } | null
      if (res.ok && data?.success !== 'false' && data?.success !== false) {
        setState('done')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <div id="rate-alerts" className="mt-6 scroll-mt-24 border-t border-border pt-5">
      <p className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
        <BellRing className="h-4.5 w-4.5 text-primary" />
        Get an email when the best rate to {selected.country} improves
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Rates move every day. Join the list and we’ll email you when the best
        verified rate to {selected.country} gets better — no spam, and this is
        an education tool, not financial advice.
      </p>

      {state === 'done' ? (
        <p className="mt-3 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-foreground">
          You’re on the list — we’ll email you when the best rate improves.
        </p>
      ) : (
        <form
          onSubmit={submit}
          className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <label className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label>
            <span className="sr-only">Destination</span>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary sm:w-auto"
            >
              {CORRIDORS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.flag} {c.country}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={state === 'sending'}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {state === 'sending' ? 'Joining…' : 'Alert me'}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p className="mt-2 text-sm font-medium text-destructive">
          Something went wrong signing you up — please try again in a moment.
        </p>
      )}
    </div>
  )
}
