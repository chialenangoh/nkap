'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  BellRing,
  ChevronRight,
  CircleUserRound,
  Fingerprint,
  Gift,
  History,
  KeyRound,
  Languages,
  MailWarning,
  Scale,
} from 'lucide-react'
import { useAuth, authErrorMessage } from '@/lib/nkap/auth-context'
import { CORRIDORS } from '@/lib/nkap/rates'
import { getDeviceLock, hasAnyLock } from '@/lib/nkap/device-lock'
import { displayNameFromEmail } from './welcome-bar'
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

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const groupClass =
  'divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-sm'
const rowClass =
  'flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-secondary/50'
const iconWrapClass =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary'

function Row({
  icon,
  label,
  right,
  chevron = true,
}: {
  icon: ReactNode
  label: string
  right?: ReactNode
  chevron?: boolean
}) {
  return (
    <>
      <span className={iconWrapClass}>{icon}</span>
      <span className="flex-1 font-heading text-base font-semibold text-foreground">
        {label}
      </span>
      {right}
      {chevron && (
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      )}
    </>
  )
}

function Pill({
  tone,
  children,
}: {
  tone: 'green' | 'amber' | 'grey'
  children: ReactNode
}) {
  const styles =
    tone === 'green'
      ? 'bg-emerald-500/15 text-emerald-600'
      : tone === 'amber'
        ? 'bg-amber-500/15 text-amber-600'
        : 'bg-secondary text-muted-foreground'
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles}`}
    >
      {children}
    </span>
  )
}

/**
 * Settings screen (modelled on the reference app): profile header, then
 * grouped list cards — profile, your tools, security — a Logout pill and
 * legal links. Every row does something real; transfer-app rows that
 * don't exist on a comparison tool (limits, recipients, stored cards)
 * are deliberately absent.
 */
export function AccountPageContent() {
  const {
    user,
    loading,
    configured,
    signOutUser,
    resendVerification,
    resetPassword,
  } = useAuth()
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [lockOn, setLockOn] = useState(false)

  useEffect(() => {
    if (user) setLockOn(hasAnyLock(getDeviceLock(user.uid)))
  }, [user])

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
      <div className="rounded-3xl border border-border bg-card p-6 text-center">
        <h2 className="font-heading text-xl font-bold text-foreground">
          You are not signed in
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to see your settings, or create an account in under a
          minute.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-in"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            Create account
          </Link>
        </div>
      </div>
    )
  }

  const email = user.email ?? ''
  const name = displayNameFromEmail(email)
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
    <LockGate uid={user.uid} email={email}>
      <div className="space-y-5">
        {/* Profile header */}
        <div className="pt-2 text-center">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary font-heading text-3xl font-bold text-primary-foreground ring-4 ring-primary/25">
            {initials(name)}
          </span>
          <h2 className="mt-3 font-heading text-2xl font-bold text-foreground">
            {name}
          </h2>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            {user.emailVerified ? (
              <>
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                Email verified
              </>
            ) : (
              <>
                <MailWarning className="h-4 w-4 text-amber-500" />
                Email not verified yet
              </>
            )}
          </p>
          {notice && (
            <p className="mx-auto mt-4 max-w-md rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-foreground">
              {notice}
            </p>
          )}
        </div>

        {/* Group 1 — profile */}
        <div className={groupClass}>
          <details className="group">
            <summary className={`${rowClass} cursor-pointer list-none marker:hidden`}>
              <Row
                icon={<CircleUserRound className="h-5 w-5" />}
                label="Profile Information"
                right={
                  user.emailVerified ? (
                    <Pill tone="green">Active</Pill>
                  ) : (
                    <Pill tone="amber">Verify email</Pill>
                  )
                }
              />
            </summary>
            <dl className="space-y-2 px-5 pb-5 pt-1 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="break-all text-right font-medium text-foreground">
                  {email}
                </dd>
              </div>
              {created && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Account created</dt>
                  <dd className="font-medium text-foreground">{created}</dd>
                </div>
              )}
              {lastSignIn && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Last sign-in</dt>
                  <dd className="font-medium text-foreground">{lastSignIn}</dd>
                </div>
              )}
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
                  className="mt-1 font-semibold text-primary hover:underline disabled:opacity-50"
                >
                  {busy === 'verify'
                    ? 'Sending…'
                    : 'Resend verification email'}
                </button>
              )}
            </dl>
          </details>

          <button
            type="button"
            disabled={busy !== null}
            onClick={() =>
              run(
                'reset',
                () => resetPassword(email),
                'Password reset email sent — check your inbox to set a new password.',
              )
            }
            className={`${rowClass} disabled:opacity-60`}
          >
            <Row
              icon={<KeyRound className="h-5 w-5" />}
              label={busy === 'reset' ? 'Sending email…' : 'Change Password'}
            />
          </button>

          <details className="group">
            <summary className={`${rowClass} cursor-pointer list-none marker:hidden`}>
              <Row
                icon={<Languages className="h-5 w-5" />}
                label="Language"
                right={<Pill tone="grey">English</Pill>}
              />
            </summary>
            <p className="px-5 pb-5 pt-1 text-sm leading-relaxed text-muted-foreground">
              Nkap is in English for now. The rates, fees and comparisons are
              the same in every language — what your family receives is the
              number that matters.
            </p>
          </details>
        </div>

        {/* Group 2 — your tools */}
        <div className={groupClass}>
          <Link href="/activity" className={rowClass}>
            <Row icon={<History className="h-5 w-5" />} label="My Activity" />
          </Link>
          <Link href="/#rate-alerts" className={rowClass}>
            <Row icon={<BellRing className="h-5 w-5" />} label="Rate Alerts" />
          </Link>
          <Link href="/rewards" className={rowClass}>
            <Row icon={<Gift className="h-5 w-5" />} label="Rewards" />
          </Link>
          <Link href="/#compare" className={rowClass}>
            <Row icon={<Scale className="h-5 w-5" />} label="Compare Rates" />
          </Link>
          {CORRIDORS.map((c) => (
            <Link
              key={c.slug}
              href={`/send-money-to-${c.slug}`}
              className={rowClass}
            >
              <Row
                icon={<span className="text-lg leading-none">{c.flag}</span>}
                label={`Send money to ${c.country}`}
              />
            </Link>
          ))}
        </div>

        {/* Group 3 — security */}
        <div className={groupClass}>
          <a href="#security" className={rowClass}>
            <Row
              icon={<Fingerprint className="h-5 w-5" />}
              label="Biometric / PIN"
              right={
                lockOn ? (
                  <Pill tone="green">On</Pill>
                ) : (
                  <Pill tone="grey">Off</Pill>
                )
              }
            />
          </a>
          {!user.emailVerified ? (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() =>
                run(
                  'verify2',
                  resendVerification,
                  'Verification email sent — check your inbox.',
                )
              }
              className={`${rowClass} disabled:opacity-60`}
            >
              <Row
                icon={<MailWarning className="h-5 w-5" />}
                label="Email Verification"
                right={<Pill tone="amber">Not verified</Pill>}
              />
            </button>
          ) : (
            <div className={rowClass}>
              <Row
                icon={<BadgeCheck className="h-5 w-5" />}
                label="Email Verification"
                right={<Pill tone="green">Verified</Pill>}
                chevron={false}
              />
            </div>
          )}
        </div>

        <div id="security" className="scroll-mt-24">
          <SecuritySettings uid={user.uid} email={email} />
        </div>

        {/* Logout + legal */}
        <button
          type="button"
          onClick={() => signOutUser()}
          className="w-full rounded-full bg-red-500/10 py-4 font-heading text-lg font-bold text-red-500 transition-colors hover:bg-red-500/15"
        >
          Logout
        </button>
        <p className="text-center text-sm">
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms of Service
          </Link>
          {' · '}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          {' · '}
          <Link href="/support" className="font-medium text-primary hover:underline">
            Support
          </Link>
        </p>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Nkap never handles your money — we only compare what each service
          delivers. Education, not financial advice. To delete your account,
          contact us via the email on the Support page and we will remove it.
        </p>
      </div>
    </LockGate>
  )
}
