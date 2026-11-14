import type { Metadata } from 'next'
import Link from 'next/link'
import { BellRing, Coins, Share2, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { RewardsCard } from '@/components/nkap/rewards-card'
import { ShareButtons } from '@/components/nkap/share-buttons'

export const metadata: Metadata = {
  title: 'Rewards | Nkap',
  description:
    'Real rewards on Nkap: $20 off your first Remitly transfer with code AMB887P, rate alerts, and sharing better rates with family.',
  alternates: { canonical: '/rewards' },
}

export default function RewardsPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3" aria-hidden>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Coins className="h-7 w-7" />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/25 text-amber-500">
            <Sparkles className="h-6 w-6" />
          </span>
        </div>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground">
          Welcome to Rewards!
        </h1>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
          Real rewards, honestly labelled. No points, no streaks, no games —
          just money your family keeps.
        </p>

        <div className="mt-8">
          <RewardsCard />
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Share2 className="h-4 w-4" /> Share and save
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
            The best reward is a better rate for your people
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Most senders lose money on the exchange rate without knowing it.
            Send Nkap to a friend or family member who sends money home, and
            their next transfer could arrive hundreds of units bigger — same
            dollars sent.
          </p>
          <div className="mt-4">
            <ShareButtons
              url="https://freenkap.com"
              text="Before you send money home, check what your family will actually receive — fees and exchange rate compared honestly:"
            />
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <BellRing className="h-4 w-4" /> Save by timing
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
            Get emailed when the best rate improves
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Rates move every day. Join the free rate alerts and we’ll email
            you when the best verified rate to your corridor gets better —
            sometimes waiting a day is worth real money.
          </p>
          <Link
            href="/#rate-alerts"
            className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Join rate alerts
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
