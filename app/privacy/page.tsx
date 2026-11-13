import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { SITE } from '@/lib/nkap/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | Nkap',
  description: 'How Nkap handles information — a comparison site with no accounts and no money handling.',
  alternates: { canonical: '/privacy' },
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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
        <div className="mb-10">
          <h1 className="text-balance font-heading text-3xl font-bold text-foreground md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10">
          <Section title="The short version">
            <p>
              Nkap is a comparison website from the {SITE.channelName} YouTube
              channel. There are no Nkap accounts, no sign-up, and we never
              handle your money. You can use every part of this site without
              giving us your name, email address, or payment details.
            </p>
          </Section>

          <Section title="What we collect">
            <p>
              We do not ask for or store personal information on this site.
              Like almost every website, our hosting provider automatically
              processes standard technical information when your browser loads
              a page — for example your IP address, browser type, and the page
              requested — in server logs used to operate and secure the site.
              Those logs are not used to build profiles of visitors.
            </p>
            <p>
              The comparison calculator runs entirely in your browser. The
              amounts and destinations you enter are never sent to us.
            </p>
          </Section>

          <Section title="Links to transfer providers">
            <p>
              When you click through to a transfer provider (such as Remitly
              or Wise) or enter our referral code on a provider&apos;s site,
              you are on that provider&apos;s service, and their own privacy
              policy governs what they collect. We do not receive your transfer
              details, your recipient&apos;s details, or your payment
              information from them. A provider may tell us, in aggregate, that
              a referral happened so a referral bonus can be paid — see the
              affiliate disclosure in the footer of every page.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Nkap does not set advertising or cross-site tracking cookies.
              If privacy-respecting, aggregate visit statistics are enabled by
              our host, they are collected without identifying individual
              visitors.
            </p>
          </Section>

          <Section title="Children">
            <p>
              Nkap is written for adults who send money internationally. It is
              not directed at children, and we do not knowingly collect
              information from children.
            </p>
          </Section>

          <Section title="Changes and contact">
            <p>
              If this policy changes, the updated version will be posted on
              this page with a new date. Questions about this policy can be
              raised through the {SITE.channelName} YouTube channel ({' '}
              {SITE.channelHandle}).
            </p>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
