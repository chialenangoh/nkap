import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Eye,
  ListOrdered,
  Scale,
  ShieldCheck,
  CirclePlay,
} from 'lucide-react'
import { Calculator } from '@/components/nkap/calculator'
import { WelcomeBar } from '@/components/nkap/welcome-bar'
import { SecurityBanner } from '@/components/nkap/security-banner'
import { RewardsCard } from '@/components/nkap/rewards-card'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { CORRIDORS } from '@/lib/nkap/rates'
import { SITE } from '@/lib/nkap/site'

export const metadata: Metadata = {
  title: 'Nkap — Compare what your family actually receives | Money in America',
  description: SITE.description,
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        {/* Hero + calculator */}
        <section className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-10">
          <div className="mx-auto max-w-4xl">
            <WelcomeBar />
            <div className="mt-5">
              <SecurityBanner />
            </div>
            <h1 className="mt-8 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              Sending money home? Check what they’ll{' '}
              <span className="text-primary">actually receive.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              “No fee” does not mean no cost. Every service takes its cut in two
              places — the fee you see, and the exchange rate you don’t. Nkap
              compares them all on the one number that matters: what lands in
              your family’s hands.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl">
            <Calculator defaultCorridor="cameroon" defaultAmount={500} />
          </div>

          <div className="mx-auto mt-6 max-w-4xl">
            <RewardsCard />
          </div>
        </section>

        {/* Corridor cards */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Cheapest way to send money home
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Each corridor page runs the same honest comparison for one
              destination — the exact search families run every payday.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CORRIDORS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/send-money-to-${c.slug}`}
                  className="group rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary"
                >
                  <span className="text-3xl">{c.flag}</span>
                  <span className="mt-3 block font-heading text-lg font-bold text-foreground">
                    Send money to {c.country}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    Compare {c.currencyCode} received on every major service,
                    fee + rate included.
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Compare now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            The 60-second check, before every send
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Step
              icon={<Eye className="h-5 w-5" />}
              title="1. Look past the fee"
              body="A $0 fee with a weak rate can cost more than a $4 fee at a strong rate. The World Bank puts the average cost of sending $200 at 6.36% worldwide — and 8.46% to Sub-Saharan Africa (Q3 2025). Most of it hides in the rate."
            />
            <Step
              icon={<Scale className="h-5 w-5" />}
              title="2. Compare what arrives"
              body="Enter the same amount and the same payout method in two or three apps, and compare the amount received in home currency. That single number — not the fee, not the headline rate — tells you the truth."
            />
            <Step
              icon={<ShieldCheck className="h-5 w-5" />}
              title="3. Beware the welcome rate"
              body="First-transfer rates are real but temporary — Remitly’s Cameroon welcome rate, for example, covers only your first $500. Compare standard rates for the sends you’ll make every month."
            />
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ListOrdered className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-heading text-lg font-bold text-foreground">
                Ranked by what your family receives. Always.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Some services pay us a referral bonus and some pay nothing at
                all. The ranking never knows the difference — it sorts purely
                by the amount that arrives. Trust is the product.
              </p>
            </div>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              How Nkap works <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Channel CTA */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CirclePlay className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-heading text-xl font-bold text-foreground">
                New to {SITE.channelName}?
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Nkap is the companion tool to the {SITE.channelName} YouTube
                channel — diaspora money, explained by us, for us. Start with
                “Sending Money Home? The Fees Are Eating It”, the episode this
                comparison was built from.
              </p>
            </div>
            <a
              href={SITE.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <CirclePlay className="h-4 w-4" /> Watch on YouTube
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Step({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <h3 className="mt-4 font-heading text-base font-bold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  )
}
