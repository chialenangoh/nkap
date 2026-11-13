import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { SITE } from '@/lib/nkap/site'

export const metadata: Metadata = {
  title: 'Terms of Service | Nkap',
  description: 'The terms that govern your use of Nkap, the Money in America comparison tool.',
  alternates: { canonical: '/terms' },
}

const LAST_UPDATED = 'November 13, 2026'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="scroll-mt-24">
      <h2 className="mb-3 font-heading text-xl font-semibold text-foreground md:text-2xl">
        {title}
      </h2>
      <div className="space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
        <div className="mb-10">
          <h1 className="text-balance font-heading text-3xl font-bold text-foreground md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10">
          <Section title="What Nkap is">
            <p>
              Nkap is a free comparison and education tool from the{' '}
              {SITE.channelName} YouTube channel. It compares published fees
              and exchange rates of money-transfer services and shows what a
              receiver would get on a given send. Nkap is not a bank, not a
              money transmitter, and never receives, holds, or sends your
              money. Any transfer you make is a separate agreement between you
              and the provider you choose.
            </p>
          </Section>

          <Section title="Not financial advice">
            <p>
              Everything on this site is education, not financial advice.
              Nothing here is a personal recommendation. Providers&apos; fees
              and exchange rates change constantly — sometimes minute to
              minute — so always confirm the final fee, rate, and amount to be
              received in the provider&apos;s own app or website before you
              send.
            </p>
          </Section>

          <Section title="Rates, estimates, and ranking">
            <p>
              Figures on this site come from providers&apos; own published
              pages. Where a figure has been checked, the page shows the date
              it was checked. Figures marked &quot;Preview rate&quot; are
              estimates that have not yet been re-verified and may differ from
              a provider&apos;s live quote. Promotional and first-transfer
              rates are labelled wherever they appear and never decide the
              ranking.
            </p>
            <p>
              Results are ranked by what the receiver gets, highest first —
              never by referral payments. Some providers pay us a referral
              bonus and some pay nothing; the ranking does not take that into
              account. See the affiliate disclosure in the footer of every
              page.
            </p>
          </Section>

          <Section title="Provider names">
            <p>
              Provider names, logos, and trademarks belong to their owners.
              Listing a service is a comparison, not an endorsement, and Nkap
              is not affiliated with the providers it lists except where a
              referral arrangement is disclosed.
            </p>
          </Section>

          <Section title="No warranty; liability">
            <p>
              The site is provided &quot;as is&quot; without warranties of any
              kind. Rates and availability can change without notice, and we
              are not responsible for a provider&apos;s pricing, delivery
              times, or service. To the fullest extent allowed by law, our
              liability for any claim arising from use of this site is limited
              to the amount you paid us to use it — which is zero, because the
              site is free.
            </p>
          </Section>

          <Section title="Changes and contact">
            <p>
              We may update these terms; the current version will always be on
              this page with its date. Questions can be raised through the{' '}
              {SITE.channelName} YouTube channel ({SITE.channelHandle}).
            </p>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
