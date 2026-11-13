'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import { useAuth, authErrorMessage } from '@/lib/nkap/auth-context'

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'

export function AuthFormShell({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {intro}
      </p>
      <div className="mt-8">{children}</div>
    </div>
  )
}

export function SignUpForm() {
  const { signUp, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  if (!configured) {
    return (
      <p className="text-sm text-muted-foreground">
        Accounts are being switched on — please check back shortly.
      </p>
    )
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <MailCheck className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-3 font-heading text-xl font-bold text-foreground">
          Check your inbox
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We sent a verification email to <strong>{email}</strong>. Click the
          link in it to verify your account — then you can sign in. If it is
          not there in a couple of minutes, check your spam folder.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Already verified?{' '}
          <Link href="/sign-in" className="font-medium text-primary underline">
            Sign in
          </Link>
        </p>
      </div>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError(
        'Use at least 8 characters with a mix of letters and numbers.',
      )
      return
    }
    setBusy(true)
    try {
      await signUp(email.trim(), password)
      setSent(true)
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="su-email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="su-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="su-password" className="mb-1.5 block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="su-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          At least 8 characters, mixing letters and numbers. Passwords are
          stored securely by our sign-in provider — never by Nkap itself.
        </p>
      </div>
      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {busy ? 'Creating your account…' : 'Create account'}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-primary underline">
          Sign in
        </Link>
      </p>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Education, not financial advice. By creating an account you agree to
        our{' '}
        <Link href="/terms" className="underline">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}

export function SignInForm() {
  const { signIn, resetPassword, configured, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!configured) {
    return (
      <p className="text-sm text-muted-foreground">
        Accounts are being switched on — please check back shortly.
      </p>
    )
  }

  if (user) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <h2 className="font-heading text-xl font-bold text-foreground">
          You are signed in
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as {user.email}
          {user.emailVerified ? ' — email verified ✓' : ' — your email is not verified yet; use “Verify email” in the header to resend the link.'}
        </p>
        <p className="mt-4 text-sm">
          <Link href="/" className="font-medium text-primary underline">
            Back to the comparison
          </Link>
        </p>
      </div>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setBusy(true)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function onForgot() {
    setError(null)
    setNotice(null)
    if (!email.trim()) {
      setError('Enter your email above first, then tap “Forgot password”.')
      return
    }
    setBusy(true)
    try {
      await resetPassword(email.trim())
      setNotice(
        'Password reset email sent — check your inbox for the link to set a new password.',
      )
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="si-email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="si-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="si-password" className="mb-1.5 block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="si-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-foreground">
          {notice}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onForgot}
          disabled={busy}
          className="text-muted-foreground underline transition-colors hover:text-foreground disabled:opacity-50"
        >
          Forgot password?
        </button>
        <Link href="/sign-up" className="font-medium text-primary underline">
          Create an account
        </Link>
      </div>
    </form>
  )
}
