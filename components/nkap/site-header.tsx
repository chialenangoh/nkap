import Link from 'next/link'
import { Coins, CirclePlay } from 'lucide-react'
import { CORRIDORS } from '@/lib/nkap/rates'
import { SITE } from '@/lib/nkap/site'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Coins className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-lg font-bold tracking-tight text-foreground">
              {SITE.name}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              by {SITE.channelName}
            </span>
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
        </div>
      </div>
    </header>
  )
}
