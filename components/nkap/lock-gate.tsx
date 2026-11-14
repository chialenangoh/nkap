'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Fingerprint, LockKeyhole, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/nkap/auth-context'
import {
  getDeviceLock,
  hasAnyLock,
  isUnlocked,
  markUnlocked,
  unlockWithBiometrics,
  verifyPin,
  isValidPin,
} from '@/lib/nkap/device-lock'

/**
 * Gates children behind this device's lock (PIN and/or Face ID) when the
 * signed-in user has set one up. A fresh password sign-in bypasses it for
 * the session (handled in the auth provider); signing out is always
 * available here.
 */
export function LockGate({
  uid,
  email,
  children,
}: {
  uid: string
  email: string
  children: ReactNode
}) {
  const { signOutUser } = useAuth()
  const [state, setState] = useState<'checking' | 'locked' | 'open'>(
    'checking',
  )
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [hasPin, setHasPin] = useState(false)
  const [hasBio, setHasBio] = useState(false)

  useEffect(() => {
    const lock = getDeviceLock(uid)
    if (!hasAnyLock(lock) || isUnlocked(uid)) {
      setState('open')
      return
    }
    setHasPin(Boolean(lock?.pinHash))
    setHasBio(Boolean(lock?.credId))
    setState('locked')
    // Offer Face ID / fingerprint straight away when it is set up.
    if (lock?.credId) {
      void (async () => {
        if (await unlockWithBiometrics(uid)) {
          markUnlocked(uid)
          setState('open')
        }
      })()
    }
  }, [uid])

  if (state === 'checking') {
    return <p className="text-sm text-muted-foreground">Checking device lock…</p>
  }
  if (state === 'open') return <>{children}</>

  const initial = (email.charAt(0) || 'N').toUpperCase()

  const tryPin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidPin(pin)) {
      setError('Enter your 4–6 digit PIN.')
      return
    }
    setBusy(true)
    try {
      if (await verifyPin(uid, pin)) {
        markUnlocked(uid)
        setState('open')
      } else {
        setError('That PIN does not match. Try again.')
        setPin('')
      }
    } finally {
      setBusy(false)
    }
  }

  const tryBio = async () => {
    setBusy(true)
    setError(null)
    try {
      if (await unlockWithBiometrics(uid)) {
        markUnlocked(uid)
        setState('open')
      } else {
        setError('Face ID / fingerprint was not recognised or was cancelled.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 text-center shadow-xl">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary font-heading text-2xl font-bold text-primary-foreground">
        {initial}
      </span>
      <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
        Account locked
      </h2>
      <p className="mt-1 break-all text-sm text-muted-foreground">{email}</p>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <LockKeyhole className="h-3.5 w-3.5" />
        This device asks for your PIN or Face ID before showing your account.
      </p>

      {hasBio && (
        <button
          type="button"
          disabled={busy}
          onClick={tryBio}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Fingerprint className="h-5 w-5" />
          Unlock with Face ID / fingerprint
        </button>
      )}

      {hasPin && (
        <form onSubmit={tryPin} className="mt-4">
          <label className="sr-only" htmlFor="nkap-lock-pin">
            PIN
          </label>
          <input
            id="nkap-lock-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="••••"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-2xl tracking-[0.5em] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-3 w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary disabled:opacity-60"
          >
            {busy ? 'Checking…' : 'Unlock with PIN'}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
      )}

      <button
        type="button"
        onClick={() => signOutUser()}
        className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="h-4 w-4" /> Sign out instead
      </button>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Forgot your PIN? Sign out and sign back in with your email and
        password — that always works.
      </p>
    </div>
  )
}
