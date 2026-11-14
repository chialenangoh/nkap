'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LockKeyhole, X } from 'lucide-react'
import { useAuth } from '@/lib/nkap/auth-context'

const DISMISS_KEY = 'nkap-secbanner-dismissed'

/**
 * The dark "Keep your account secure" card from the reference app,
 * adapted to the user's real next step: create an account, verify the
 * email, or add the device lock (PIN / Face ID). Dismissible per device.
 */
export function SecurityBanner() {
  const { user, loading, configured } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') setDismissed(true)
    } catch {
      /* storage unavailable — banner simply shows */
    }
  }, [])

  if (!configured || loading || dismissed) return null

  let title = 'Keep your account secure'
  let body =
    'Create a free account and verify your email — then add a PIN or Face ID lock on this device.'
  let cta = 'Create account'
  let href = '/sign-up'
  if (user && !user.emailVerified) {
    title = 'Verify your email'
    body =
      'Your account is created — tap the link in the verification email to finish securing it.'
    cta = 'Go to my account'
    href = '/account'
  } else if (user && user.emailVerified) {
    title = 'Add a PIN or Face ID lock'
    body =
      'Lock your account on this device, so only you can open it — even if someone picks up your phone.'
    cta = 'Set up security'
    href = '/account'
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-foreground p-5 text-background shadow-xl sm:p-6">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          setDismissed(true)
          try {
            localStorage.setItem(DISMISS_KEY, '1')
          } catch {
            /* ignore */
          }
        }}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground shadow"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-xl font-bold">{title}</h2>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed opacity-75">
            {body}
          </p>
          <Link
            href={href}
            className="mt-4 inline-block rounded-full bg-background px-4 py-2 text-sm font-semibold text-primary shadow transition-opacity hover:opacity-90"
          >
            {cta}
          </Link>
        </div>
        <span className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg sm:flex">
          <LockKeyhole className="h-10 w-10" />
        </span>
      </div>
    </div>
  )
}
