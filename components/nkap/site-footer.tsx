import Link from 'next/link'
import { CirclePlay } from 'lucide-react'
import { CORRIDORS } from '@/lib/nkap/rates'
import { AFFILIATE_DISCLOSURE, EDUCATION_NOTICE, SITE } from '@/lib/nkap/site'
import { BottomNav } from './bottom-nav'

/**
 * Footer carries the compliance lines that must appear on every page:
 * the FTC affiliate disclosure and the education-not-advice notice.
 */
export function SiteFooter() {
  return (
    <>
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt={SITE.name}
              width={1000}
              height={298}
              className="h-9 w-auto"
            />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline} A free comparison tool from the{' '}
              {SITE.channelName} YouTube channel — made for families who send
              money home.
            </p>
            <a
              href={SITE.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <CirclePlay className="h-4 w-4" />
              Watch {SITE.channelName}
            </a>
          </div>

          <nav>
            <p className="font-heading text-sm font-semibold text-foreground">
              Send money to
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {CORRIDORS.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/send-money-to-${c.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.flag} {c.country} ({c.currencyCode})
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <p className="font-heading text-sm font-semibold text-foreground">
              About
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  How Nkap ranks services
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 space-y-3 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>{AFFILIATE_DISCLOSURE}</p>
          <p>{EDUCATION_NOTICE}</p>
          <p>
            Nkap compares published rates and fees; it does not send money and
            is not a bank or money transmitter. Provider names and trademarks
            belong to their owners; listing a service is a comparison, not an
            endorsement.
          </p>
        </div>
      </div>
    </footer>
    <BottomNav />
    </>
  )
}
