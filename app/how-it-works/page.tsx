import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { AFFILIATE_DISCLOSURE, EDUCATION_NOTICE, SITE } from '@/lib/nkap/site'

export const metadata: Metadata = {
  title: 'How Nkap ranks money-transfer services | Nkap',
  description:
    'How Nkap compares fees and exchange rates, where its numbers come from, and why rankings are always by what the receiver gets — never by referral earnings.',
  alternates: { canonical: '/how-it-works' },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How Nkap works
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Nkap is a comparison tool from the {SITE.channelName} YouTube
          channel. It exists because of one lesson from our episode “Sending
          Money Home? The Fees Are Eating It”: <strong className="text-foreground">the fee is
          not the cost</strong>. Every transfer loses money in two places — the
          fee you see, and the margin hidden in the exchange rate you don’t.
        </p>

        <Section title="The only ranking that matters">
          <p>
            For any amount and destination, Nkap calculates what each service
            would deliver: <em>amount sent × the provider’s exchange rate</em>,
            with the provider’s fee shown beside it. Services are then ranked
            by that delivered amount, highest first. Referral earnings are
            never an input to the ranking — a service that pays us nothing can
            and does rank first when it delivers the most.
          </p>
        </Section>

        <Section title="Where the numbers come from">
          <p>
            Rates and fees are checked on each provider’s own website or app —
            never on third-party aggregator tables, which we have caught
            publishing stale rates above the market rate itself. Every figure
            shows the date it was checked. Figures still being verified are
            marked “Preview rate” and are replaced as the scheduled
            re-verification reaches them. Rates move daily, sometimes hourly:
            treat every comparison as a close guide, and confirm the final
            amount in the provider’s app before you send.
          </p>
          <p>
            For context, the World Bank’s Remittance Prices Worldwide (Q3
            2025) puts the global average cost of sending $200 at 6.36%, the
            average to Sub-Saharan Africa at 8.46%, and banks — the costliest
            channel — at 14.99%. The differences between services on a single
            send are real money for the family at home.
          </p>
        </Section>

        <Section title="How Nkap earns">
          <p>{AFFILIATE_DISCLOSURE}</p>
          <p>
            Concretely, today: our Remitly Ambassador code (AMB887P) earns
            Money in America a referral bonus when a new sender uses it on a
            qualifying first transfer — and gives that sender $20 off. Wise is
            listed with a plain link and no referral arrangement while our
            application to its influencer program is pending. Xe, Sendwave,
            WorldRemit and Western Union are listed purely for comparison.
          </p>
        </Section>

        <Section title="What Nkap is not">
          <p>{EDUCATION_NOTICE}</p>
          <p>
            Nkap does not send money, hold balances, or give personal
            financial advice. It is an education tool — the 60-second check
            from the channel, turned into a page you can open on payday.
          </p>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-xl font-bold text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}
