'use client'

import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import { useAuth } from '@/lib/nkap/auth-context'

/**
 * Landing page for Firebase's email-verification continue URL. By the time
 * a visitor arrives here, Firebase's own handler has verified the email.
 */
export function ConfirmedContent() {
  const { user } = useAuth()
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 text-center sm:px-6">
      <BadgeCheck className="mx-auto h-12 w-12 text-primary" />
      <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground">
        Email verified
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {user
          ? `Your account (${user.email}) is verified and ready.`
          : 'Your email address has been verified. Your Nkap account is ready — sign in to continue.'}
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/sign-in"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground underline transition-colors hover:text-foreground"
        >
          Back to the comparison
        </Link>
      </div>
    </div>
  )
}
