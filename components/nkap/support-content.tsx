'use client'

import Link from 'next/link'
import {
  BookOpen,
  ChevronRight,
  CirclePlay,
  Headphones,
  Info,
  Mail,
} from 'lucide-react'
import { useAuth } from '@/lib/nkap/auth-context'
import { SITE } from '@/lib/nkap/site'

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'Does Nkap send money?',
    a: 'No. Nkap is a comparison and education tool from Money in America. We compare what each service would deliver, then you finish your transfer in that service’s own app. We never hold or move your money.',
  },
  {
    q: 'Why is the amount in the provider’s app slightly different?',
    a: 'Rates move constantly. Nkap’s verified figures are checked on each provider’s own pages (the check date is shown beside every rate), but the live number in the provider’s app at the moment you send is always the final one. Check it before you confirm.',
  },
  {
    q: 'What does “Preview rate” mean?',
    a: 'It is an estimate we have not yet been able to verify on the provider’s own public pages. Preview rates are clearly badged, are never ranked above a verified rate, and never take the “Most received” tag.',
  },
  {
    q: 'Is an Nkap account free? Do I need one?',
    a: 'Accounts are free, and you don’t need one to compare — the calculator works for everyone. An account lets you add a PIN or Face ID lock on your device and keeps your place as we add member features.',
  },
  {
    q: 'How do I clear my activity or delete my account?',
    a: 'Your activity history lives only on your device — clear it anytime from the Activity tab. To delete your account entirely, email us and we will remove it.',
  },
]

const rowClass =
  'flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/50'

/** Help & Support screen, modelled on the reference app. */
export function SupportContent() {
  const { user, signOutUser } = useAuth()

  return (
    <div>
      <div className="flex justify-center" aria-hidden>
        <span className="flex h-32 w-32 items-center justify-center rounded-full bg-card text-primary shadow-xl ring-1 ring-border">
          <Headphones className="h-16 w-16" />
        </span>
      </div>
      <h1 className="mt-6 text-center font-heading text-3xl font-bold tracking-tight text-foreground">
        Help and Support
      </h1>

      <div className="mt-8 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <a href="mailto:chialenangoh@gmail.com" className={rowClass}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <span className="flex-1 font-heading text-lg font-semibold text-foreground">
            Contact Us via Email
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </a>
        <a href="#faq" className={rowClass}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="flex-1 font-heading text-lg font-semibold text-foreground">
            FAQ
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </a>
        <Link href="/how-it-works" className={rowClass}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <Info className="h-5 w-5" />
          </span>
          <span className="flex-1 font-heading text-lg font-semibold text-foreground">
            How Nkap Works
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <a
          href={SITE.channelUrl}
          target="_blank"
          rel="noreferrer"
          className={rowClass}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <CirclePlay className="h-5 w-5" />
          </span>
          <span className="flex-1 font-heading text-lg font-semibold text-foreground">
            Watch {SITE.channelName}
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </a>
      </div>

      <section id="faq" className="mt-10 scroll-mt-24">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        <div className="mt-4 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-heading text-base font-semibold text-foreground marker:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {user && (
        <button
          type="button"
          onClick={() => signOutUser()}
          className="mt-10 w-full rounded-full bg-red-500/10 py-4 font-heading text-lg font-bold text-red-500 transition-colors hover:bg-red-500/15"
        >
          Logout
        </button>
      )}
    </div>
  )
}
