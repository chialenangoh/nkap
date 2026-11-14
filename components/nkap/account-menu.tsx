'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  BellRing,
  ChevronDown,
  CircleUserRound,
  Info,
  LogOut,
  MailWarning,
  Scale,
} from 'lucide-react'
import { useAuth, authErrorMessage } from '@/lib/nkap/auth-context'

const itemClass =
  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-primary/10'

/**
 * Header account control. Logged out: Sign in / Create account.
 * Logged in: an avatar button opening the user menu (account details,
 * verification status, quick links, sign out) — the email and actions live
 * inside the menu instead of stretching across the header.
 */
export function AccountMenu() {
  const { user, loading, configured, signOutUser, resendVerification } =
    useAuth()
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open ])

  if (!configured || loading) return null

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/sign-in"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create account
        </Link>
      </div>
    )
  }

  const email = user.email ?? ''
  const initial = (email.charAt(0) || 'N').toUpperCase()

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
        className="flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-1 pr-2 transition-colors hover:border-primary"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
          {initial}
        </span>
        <span className="hidden text-sm font-medium text-foreground sm:block">
          Menu
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Signed in as
            </p>
            <p className="mt-0.5 break-all text-sm font-medium text-foreground">
              {email}
            </p>
            {user.emailVerified ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary">
                <BadgeCheck className="h-3.5 w-3.5" /> Email verified
              </p>
            ) : (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-amber-500">
                <MailWarning className="h-3.5 w-3.5" /> Email not verified yet
              </p>
            )}
          </div>

          <nav className="p-1.5" aria-label="User">
            <Link href="/account" className={itemClass} onClick={() => setOpen(false)}>
              <CircleUserRound className="h-4 w-4 text-muted-foreground" />
              My account
            </Link>
            <Link href="/" className={itemClass} onClick={() => setOpen(false)}>
              <Scale className="h-4 w-4 text-muted-foreground" />
              Compare rates
            </Link>
            <Link href="/#rate-alerts" className={itemClass} onClick={() => setOpen(false)}>
              <BellRing className="h-4 w-4 text-muted-foreground" />
              Rate alerts
            </Link>
            <Link href="/how-it-works" className={itemClass} onClick={() => setOpen(false)}>
              <Info className="h-4 w-4 text-muted-foreground" />
              How Nkap works
            </Link>
          </nav>

          <div className="border-t border-border p-1.5">
            {!user.emailVerified && (
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true)
                  try {
                    await resendVerification()
                    setNotice('Verification email sent — check your inbox.')
                  } catch (e) {
                    setNotice(authErrorMessage(e))
                  } finally {
                    setBusy(false)
                  }
                }}
                className={`${itemClass} font-medium text-amber-500 disabled:opacity-50`}
              >
                <MailWarning className="h-4 w-4" />
                {busy ? 'Sending…' : 'Verify email'}
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                setOpen(false)
                await signOutUser()
              }}
              className={itemClass}
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              Sign out
            </button>
            {notice && (
              <p className="px-3 pb-2 pt-1 text-xs text-muted-foreground">
                {notice}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
