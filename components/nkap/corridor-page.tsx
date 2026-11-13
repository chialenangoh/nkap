import Link from 'next/link'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { Calculator } from '@/components/nkap/calculator'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { CORRIDORS, type Corridor } from '@/lib/nkap/rates'

const TIPS = [
  'Compare the amount received — in home currency, same payout method — across two or three apps before you confirm. It takes 60 seconds.',
  'Watch for first-transfer welcome rates: they are real savings once, but the standard rate is what your monthly sends will actually get.',
  'When you can, send on a weekday — rates are usually steadier than at weekends.',
  'Keep your receipts and a screenshot of the amount promised. If less arrives, you have proof.',
]

export function CorridorPage({ corridor }: { corridor: Corridor }) {
  const others = CORRIDORS.filter((c) => c.slug !== corridor.slug)
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            United States → {corridor.country}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Cheapest way to send money to {corridor.country} {corridor.flag}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {corridor.localContext} Below, every major service is compared on
            the same send — fee plus exchange rate — ranked by how many{' '}
            {corridor.currencyName} your family actually receives.
          </p>

          <div className="mt-10 max-w-4xl">
            <Calculator defaultCorridor={corridor.slug} defaultAmount={500} />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground">
                Receiving in {corridor.country}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {corridor.payoutNotes}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Payout method matters: the same service can pay a different
                rate for mobile money, bank deposit and cash pickup. Nkap’s
                figures use each provider’s standard online quote for this
                corridor — check the exact payout you plan to use in the
                provider’s app before sending.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground">
                Before you send to {corridor.country}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav className="mt-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Other destinations
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {others.map((c) => (
                <Link
                  key={c.slug}
                  href={`/send-money-to-${c.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary"
                >
                  {c.flag} Send money to {c.country}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </nav>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
