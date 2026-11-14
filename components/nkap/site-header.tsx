import Link from 'next/link'
import { CirclePlay } from 'lucide-react'
import { CORRIDORS } from '@/lib/nkap/rates'
import { SITE } from '@/lib/nkap/site'
import { AccountMenu } from './account-menu'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex flex-col justify-center" aria-label={`${SITE.name} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={SITE.name}
            width={1000}
            height={298}
            className="h-10 w-auto sm:h-11"
          />
          <span className="mt-0.5 text-[11px] leading-none text-muted-foreground">
            by {SITE.channelName}
          </span>
        </Link>

        <nav className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:order-2 sm:w-auto sm:flex-1">
          {CORRIDORS.map((c) => (
            <Link
              key={c.slug}
              href={`/send-money-to-${c.slug}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.flag} {c.country}
            </Link>
          ))}
          <Link
            href="/how-it-works"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
        </nav>

        <div className="order-2 ml-auto flex items-center gap-4 sm:order-3 sm:ml-0">
          <a
            href={SITE.channelUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
          >
            <CirclePlay className="h-4 w-4" />
            {SITE.channelHandle}
          </a>
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
