'use client'

import { useEffect, useState } from 'react'
import { Fingerprint, KeyRound, ShieldCheck, Trash2 } from 'lucide-react'
import {
  biometricsAvailable,
  enrolBiometrics,
  getDeviceLock,
  isValidPin,
  markUnlocked,
  removeBiometrics,
  removePin,
  setPin,
  verifyPin,
} from '@/lib/nkap/device-lock'

type Flow =
  | { kind: 'none' }
  | { kind: 'pin'; stage: 'current' | 'new' | 'confirm'; changing: boolean; draft?: string }
  | { kind: 'remove-pin'; stage: 'current' }

const primaryBtn =
  'rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60'
const ghostBtn =
  'rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary disabled:opacity-60'
const pinInputClass =
  'w-44 rounded-xl border border-input bg-background px-4 py-2.5 text-center text-xl tracking-[0.4em] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30'

/**
 * Security card on the account page: manage the device lock (PIN and/or
 * Face ID / fingerprint) for this device. Everything here is local to this
 * browser — nothing is sent to a server.
 */
export function SecuritySettings({
  uid,
  email,
}: {
  uid: string
  email: string
}) {
  const [hasPin, setHasPin] = useState(false)
  const [hasBio, setHasBio] = useState(false)
  const [bioSupported, setBioSupported] = useState<boolean | null>(null)
  const [flow, setFlow] = useState<Flow>({ kind: 'none' })
  const [pinValue, setPinValue] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = () => {
    const lock = getDeviceLock(uid)
    setHasPin(Boolean(lock?.pinHash))
    setHasBio(Boolean(lock?.credId))
  }

  useEffect(() => {
    refresh()
    void biometricsAvailable().then(setBioSupported)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  const resetFlow = () => {
    setFlow({ kind: 'none' })
    setPinValue('')
    setError(null)
  }

  const done = (message: string) => {
    refresh()
    markUnlocked(uid)
    resetFlow()
    setNotice(message)
  }

  const submitPinStep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (flow.kind !== 'pin' && flow.kind !== 'remove-pin') return
    setError(null)
    if (flow.stage === 'current') {
      if (!(await verifyPin(uid, pinValue))) {
        setError('That PIN does not match your current PIN.')
        setPinValue('')
        return
      }
      setPinValue('')
      if (flow.kind === 'remove-pin') {
        removePin(uid)
        done('PIN removed. Your account no longer asks for a PIN on this device.')
      } else {
        setFlow({ ...flow, stage: 'new' })
      }
      return
    }
    if (!isValidPin(pinValue)) {
      setError('Choose a PIN of 4 to 6 digits.')
      return
    }
    if (flow.kind === 'pin' && flow.stage === 'new') {
      setFlow({ ...flow, stage: 'confirm', draft: pinValue })
      setPinValue('')
      return
    }
    if (flow.kind === 'pin' && flow.stage === 'confirm') {
      if (pinValue !== flow.draft) {
        setError('The two PINs do not match. Start again.')
        setFlow({ kind: 'pin', stage: 'new', changing: flow.changing })
        setPinValue('')
        return
      }
      await setPin(uid, pinValue)
      done(
        flow.changing
          ? 'PIN changed on this device.'
          : 'PIN set. This device will ask for it before showing your account.',
      )
    }
  }

  const enableBio = async () => {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await enrolBiometrics(uid, email)
      done('Face ID / fingerprint is on for this device.')
    } catch {
      setError(
        'That did not complete. Your device may have cancelled it, or biometrics are not set up on this device yet.',
      )
    } finally {
      setBusy(false)
    }
  }

  const flowTitle =
    flow.kind === 'remove-pin'
      ? 'Remove PIN — enter your current PIN'
      : flow.kind === 'pin'
        ? flow.stage === 'current'
          ? 'Enter your current PIN'
          : flow.stage === 'new'
            ? flow.changing
              ? 'Choose a new PIN (4–6 digits)'
              : 'Choose a PIN (4–6 digits)'
            : 'Enter the PIN again to confirm'
        : ''

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
        <ShieldCheck className="h-5 w-5 text-primary" /> Security on this
        device
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Add a lock so this phone or computer asks for a PIN or your face /
        fingerprint before showing your account. It works on this device
        only, alongside your password — your password always still works.
      </p>

      {notice && (
        <p className="mt-4 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-foreground">
          {notice}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="mt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/60 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <KeyRound className="h-4 w-4 text-primary" /> PIN lock
            <span className="text-muted-foreground">
              {hasPin ? '· On' : '· Off'}
            </span>
          </p>
          {flow.kind === 'none' && (
            <div className="flex gap-2">
              {hasPin ? (
                <>
                  <button
                    type="button"
                    className={ghostBtn}
                    onClick={() =>
                      setFlow({ kind: 'pin', stage: 'current', changing: true })
                    }
                  >
                    Change PIN
                  </button>
                  <button
                    type="button"
                    className={ghostBtn}
                    onClick={() => setFlow({ kind: 'remove-pin', stage: 'current' })}
                  >
                    <Trash2 className="mr-1 inline h-3.5 w-3.5" />
                    Remove
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={primaryBtn}
                  onClick={() =>
                    setFlow({ kind: 'pin', stage: 'new', changing: false })
                  }
                >
                  Set up PIN
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/60 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Fingerprint className="h-4 w-4 text-primary" /> Face ID /
            fingerprint
            <span className="text-muted-foreground">
              {bioSupported === null
                ? '· checking…'
                : !bioSupported
                  ? '· not available on this device'
                  : hasBio
                    ? '· On'
                    : '· Off'}
            </span>
          </p>
          {bioSupported && (
            <div>
              {hasBio ? (
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={() => {
                    removeBiometrics(uid)
                    done('Face ID / fingerprint turned off for this device.')
                  }}
                >
                  Turn off
                </button>
              ) : (
                <button
                  type="button"
                  className={primaryBtn}
                  disabled={busy}
                  onClick={enableBio}
                >
                  {busy ? 'Waiting for device…' : 'Turn on'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {flow.kind !== 'none' && (
        <form
          onSubmit={submitPinStep}
          className="mt-5 rounded-2xl border border-dashed border-border p-4"
        >
          <p className="text-sm font-medium text-foreground">{flowTitle}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              autoFocus
              value={pinValue}
              onChange={(e) =>
                setPinValue(e.target.value.replace(/[^0-9]/g, ''))
              }
              placeholder="••••"
              aria-label={flowTitle}
              className={pinInputClass}
            />
            <button type="submit" className={primaryBtn}>
              Continue
            </button>
            <button type="button" className={ghostBtn} onClick={resetFlow}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Your PIN is stored on this device as a scrambled code — never the
        digits themselves, and never on our servers. Face ID and fingerprint
        checks happen inside your device; Nkap never sees or stores your
        face or fingerprint.
      </p>
    </div>
  )
}
