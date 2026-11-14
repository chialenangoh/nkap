'use client'

import { useState } from 'react'
import { Copy, Gift } from 'lucide-react'

/**
 * Rewards card: the one real reward Nkap can offer — the Remitly
 * Ambassador $20-off code. The Ambassador disclosure rides along every
 * time the code is promoted (#Ad – paid #RemitlyAmbassador).
 */
export function RewardsCard() {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText('AMB887P')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="rewards" className="scroll-mt-24">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Gift className="h-4 w-4" /> Rewards
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
          Get $20 off your first Remitly transfer
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          New to Remitly? Enter this code when you sign up, and your first
          transfer of $40 or more gets $20 off. The code works on any
          corridor — Cameroon, Nigeria, Ghana, Kenya and beyond.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary/60 bg-primary/5 px-4 py-2.5 font-mono text-base font-bold tracking-widest text-foreground transition-colors hover:border-primary"
          >
            AMB887P <Copy className="h-4 w-4 text-primary" />
          </button>
          {copied && (
            <span className="text-sm font-medium text-primary">Copied!</span>
          )}
          <a
            href="https://www.remitly.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go to Remitly
          </a>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          #Ad – paid #RemitlyAmbassador. Money in America earns a bonus when
          new senders use this code. It never changes Nkap’s ranking — every
          service is still sorted only by what your family receives.
        </p>
      </div>
    </section>
  )
}
