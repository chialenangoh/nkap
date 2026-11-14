'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  BellRing,
  KeyRound,
  LogOut,
  MailWarning,
  Scale,
} from 'lucide-react'
import { useAuth, authErrorMessage } from '@/lib/nkap/auth-context'
import { CORRIDORS } from '@/lib/nkap/rates'
import { LockGate } from './lock-gate'
import { SecuritySettings } from './security-settings'

function formatDate(value: string | undefined): string | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
}

const actionClass =
  'flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary disabled:opacity-50'

/** The signed-in user's account page: identity, verification, actions. */
export function AccountPageContent() {
  const { user, loading, configured, signOutUser, resendVerification, resetPassword } =
    useAuth()
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  if (!configured) {
    return (
      <p className="text-sm text-muted-foreground">
        Accounts are being switched on — please check back shortly.
      </p>
    )
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading your account…</p>
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <h2 className="font-heading text-xl font-bold text-foreground">
          You are not signed in
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to see your account, or create one in under a minute.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-in"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            Create account
          </Link>
        </div>
      </div>
    )
  }

  const created = formatDate(user.metadata.creationTime)
  const lastSignIn = formatDate(user.metadata.lastSignInTime)

  async function run(key: string, fn: () => Promise<void>, ok: string) {
    setBusy(key)
    setNotice(null)
    try {
      await fn()
      setNotice(ok)
    } catch (e) {
      setNotice(authErrorMessage(e))
    } finally {
      setBusy(null)
    }
  }

  return (
    <LockGate uid={user.uid} email={user.email ?? ''}>
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-2xl font-bold text-primary-foreground">
            {(user.email?.charAt(0) || 'N').toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="break-all font-heading text-lg font-bold text-foreground">
              {user.email}
            </p>
            {user.emailVerified ? (
              <p className="mt-0.5 flex items-center gap-1 text-sm font-medium text-primary">
                <BadgeCheck className="h-4 w-4" /> Email verified
              </p>
            ) : (
              <p className="mt-0.5 flex items-center gap-1 text-sm font-medium text-amber-500">
                <MailWarning className="h-4 w-4" /> Email not verified yet —
                check your inbox for the link
              </p>
            )}
          </div>
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          {created && (
            <div>
              <dt className="text-muted-foreground">Account created</dt>
              <dd className="font-medium text-foreground">{created}</dd>
            </div>
          )}
          {lastSignIn && (
            <div>
              <dt className="text-muted-foreground">Last sign-in</dt>
              <dd className="font-medium text-foreground">{lastSignIn}</dd>
            </div>
          )}
        </dl>
        {notice && (
          <p className="mt-4 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-foreground">
            {notice}
          </p>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {!user.emailVerified && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() =>
                run(
                  'verify',
                  resendVerification,
                  'Verification email sent — check your inbox.',
                )
              }
              className={actionClass}
            >
              <MailWarning className="h-4 w-4" />
              {busy === 'verify' ? 'Sending…' : 'Resend verification email'}
            </button>
          )}
          <button
            type="button"
            disabled={busy !== null}
            onClick={() =>
              run(
                'reset',
                () => resetPassword(user.email ?? ''),
                'Password reset email sent — check your inbox to set a new password.',
              )
            }
            className={actionClass}
          >
            <KeyRound className="h-4 w-4" />
            {busy === 'reset' ? 'Sending…' : 'Change password'}
          </button>
          <button
            type="button"
            onClick={() => signOutUser()}
            className={actionClass}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Quick links
        </h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <Link href="/" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-foreground transition-colors hover:bg-primary/10">
            <Scale className="h-4 w-4 text-muted-foreground" /> Compare rates
          </Link>
          <Link href="/#rate-alerts" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-foreground transition-colors hover:bg-primary/10">
            <BellRing className="h-4 w-4 text-muted-foreground" /> Rate alerts
          </Link>
          {CORRIDORS.map((c) => (
            <Link
              key={c.slug}
              href={`/send-money-to-${c.slug}`}
              className="rounded-lg px-2 py-1.5 text-foreground transition-colors hover:bg-primary/10"
            >
              {c.flag} Send money to {c.country}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Nkap never handles your money — we only compare what each service
          delivers. Education, not financial advice. To delete your account,
          contact us via the email in the footer and we will remove it.
        </p>
      </div>

      <SecuritySettings uid={user.uid} email={user.email ?? ''} />
    </div>
    </LockGate>
  )
}
