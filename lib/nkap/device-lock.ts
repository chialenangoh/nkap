'use client'

/**
 * Device lock for the Nkap account area: an optional PIN and/or Face ID /
 * fingerprint (WebAuthn platform authenticator) that gates the account
 * pages ON THIS DEVICE ONLY.
 *
 * Honest scope: this is a convenience lock for the browser on this phone or
 * computer — it is NOT a Firebase sign-in factor and stores nothing
 * server-side. The PIN is never stored; only a salted SHA-256 hash is kept
 * in localStorage. The WebAuthn private key never leaves the device's
 * secure hardware; we keep only the credential id. A fresh email+password
 * sign-in always bypasses the lock for that session (see auth-context),
 * and signing out is always available from the lock screen.
 */

export type DeviceLock = {
  v: 1
  pinSalt?: string
  pinHash?: string
  /** base64url WebAuthn credential id for biometric unlock */
  credId?: string
}

const lockKey = (uid: string) => `nkap-lock:${uid}`
const sessionKey = (uid: string) => `nkap-unlocked:${uid}`

export function getDeviceLock(uid: string): DeviceLock | null {
  try {
    const raw = localStorage.getItem(lockKey(uid))
    if (!raw) return null
    const parsed = JSON.parse(raw) as DeviceLock
    return parsed && parsed.v === 1 ? parsed : null
  } catch {
    return null
  }
}

function saveDeviceLock(uid: string, lock: DeviceLock | null) {
  try {
    if (lock) localStorage.setItem(lockKey(uid), JSON.stringify(lock))
    else localStorage.removeItem(lockKey(uid))
  } catch {
    /* storage unavailable — lock simply won't persist */
  }
}

export function hasAnyLock(lock: DeviceLock | null): boolean {
  return Boolean(lock && (lock.pinHash || lock.credId))
}

export function isUnlocked(uid: string): boolean {
  try {
    return sessionStorage.getItem(sessionKey(uid)) === '1'
  } catch {
    return false
  }
}

export function markUnlocked(uid: string) {
  try {
    sessionStorage.setItem(sessionKey(uid), '1')
  } catch {
    /* ignore */
  }
}

/* ---------------------------------- PIN ---------------------------------- */

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  )
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')
}

export function isValidPin(pin: string): boolean {
  return /^[0-9]{4,6}$/.test(pin)
}

export async function setPin(uid: string, pin: string): Promise<void> {
  const salt = randomHex(16)
  const pinHash = await sha256Hex(`${salt}:${pin}`)
  const existing = getDeviceLock(uid) ?? { v: 1 as const }
  saveDeviceLock(uid, { ...existing, pinSalt: salt, pinHash })
}

export async function verifyPin(uid: string, pin: string): Promise<boolean> {
  const lock = getDeviceLock(uid)
  if (!lock?.pinSalt || !lock.pinHash) return false
  return (await sha256Hex(`${lock.pinSalt}:${pin}`)) === lock.pinHash
}

export function removePin(uid: string) {
  const lock = getDeviceLock(uid)
  if (!lock) return
  const next = { ...lock }
  delete next.pinSalt
  delete next.pinHash
  saveDeviceLock(uid, hasAnyLock(next) ? next : null)
}

/* ------------------------------- Biometrics ------------------------------ */

function bufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBuffer(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '=',
  )
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export async function biometricsAvailable(): Promise<boolean> {
  try {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      return false
    }
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

function randomChallenge(): Uint8Array {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return arr
}

/** Enrol this device's Face ID / fingerprint for unlocking the account. */
export async function enrolBiometrics(
  uid: string,
  email: string,
): Promise<void> {
  if (!navigator.credentials) throw new Error('unsupported')
  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge: randomChallenge() as BufferSource,
      rp: { name: 'Nkap', id: window.location.hostname },
      user: {
        id: new TextEncoder().encode(uid) as BufferSource,
        name: email,
        displayName: email,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
    },
  })) as PublicKeyCredential | null
  if (!credential) throw new Error('cancelled')
  const existing = getDeviceLock(uid) ?? { v: 1 as const }
  saveDeviceLock(uid, {
    ...existing,
    credId: bufferToBase64Url(credential.rawId),
  })
}

/** Ask the device for Face ID / fingerprint; resolves true on success. */
export async function unlockWithBiometrics(uid: string): Promise<boolean> {
  const lock = getDeviceLock(uid)
  if (!lock?.credId || !navigator.credentials) return false
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomChallenge() as BufferSource,
        allowCredentials: [
          {
            type: 'public-key',
            id: base64UrlToBuffer(lock.credId) as BufferSource,
          },
        ],
        userVerification: 'required',
        timeout: 60000,
      },
    })
    return assertion !== null
  } catch {
    return false
  }
}

export function removeBiometrics(uid: string) {
  const lock = getDeviceLock(uid)
  if (!lock) return
  const next = { ...lock }
  delete next.credId
  saveDeviceLock(uid, hasAnyLock(next) ? next : null)
}

export function removeAllLocks(uid: string) {
  saveDeviceLock(uid, null)
}
