/*
  Simple demo auth utilities: localStorage-backed failed attempts tracking,
  lockout logic, remember-me, and basic user registry with hashed passwords
  and email verification tokens (simulated).
*/
export type FailedAttempt = {
  email: string
  timestamp: number
  userAgent?: string
};

const ATTEMPTS_KEY = 'auth:failedAttempts';
const LOCKOUT_KEY = 'auth:lockout';
const REMEMBER_KEY = 'auth:remember';
const USERS_KEY = 'auth:users';
const VERIFICATIONS_KEY = 'auth:verifications'; // token -> email
const RESET_TOKENS_KEY = 'auth:resetTokens'; // token -> email

export type User = {
  name: string;
  company: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  createdAt: number;
};

export type LockoutInfo = {
  email: string
  until: number // epoch ms
  count: number
};

// Policy
export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15; // demo value

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Password reset flow (simulado)
export function startPasswordReset(email: string): { ok: boolean; message?: string; token?: string } {
  const user = getUserByEmail(email);
  if (!user) return { ok: false, message: 'If the email address exists, well send you a reset link.' };
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const map = readJSON<Record<string, string>>(RESET_TOKENS_KEY, {});
  map[token] = email;
  writeJSON(RESET_TOKENS_KEY, map);
  console.info(`[auth] Password reset email queued for ${email}. Token: ${token}`);
  return { ok: true, token };
}

export function getEmailForResetToken(token: string): string | null {
  const map = readJSON<Record<string, string>>(RESET_TOKENS_KEY, {});
  return map[token] ?? null;
}

export async function resetPassword(token: string, newPassword: string): Promise<{ ok: boolean; message?: string }>{
  if (newPassword.length < 8) return { ok: false, message: 'The password must be at least 8 characters.' };
  const map = readJSON<Record<string, string>>(RESET_TOKENS_KEY, {});
  const email = map[token];
  if (!email) return { ok: false, message: 'Invalid or expired token.' };
  const users = listUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return { ok: false, message: 'User not found.' };
  const hash = await sha256(newPassword);
  users[idx].passwordHash = hash;
  writeJSON(USERS_KEY, users);
  delete map[token];
  writeJSON(RESET_TOKENS_KEY, map);
  return { ok: true };
}

function writeJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getFailedAttempts(): FailedAttempt[] {
  return readJSON<FailedAttempt[]>(ATTEMPTS_KEY, []);
}

export function addFailedAttempt(email: string) {
  const attempts = getFailedAttempts();
  attempts.push({ email, timestamp: Date.now(), userAgent: navigator.userAgent });
  writeJSON(ATTEMPTS_KEY, attempts);
}

export function clearFailedAttempts(email: string) {
  const attempts = getFailedAttempts().filter(a => a.email !== email);
  writeJSON(ATTEMPTS_KEY, attempts);
}

export function getAttemptsCount(email: string): number {
  return getFailedAttempts().filter(a => a.email === email).length;
}

export function setLockout(email: string, count: number) {
  const until = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
  writeJSON<LockoutInfo>(LOCKOUT_KEY, { email, until, count });
}

export function getLockout(): LockoutInfo | null {
  const info = readJSON<LockoutInfo | null>(LOCKOUT_KEY, null);
  if (!info) return null;
  if (Date.now() >= info.until) {
    // expired
    localStorage.removeItem(LOCKOUT_KEY);
    return null;
  }
  return info;
}

export function clearLockout() {
  localStorage.removeItem(LOCKOUT_KEY);
}

export function setRemember(email: string) {
  writeJSON(REMEMBER_KEY, { email, ts: Date.now() });
}

export function getRemember(): string | null {
  const v = readJSON<{ email: string } | null>(REMEMBER_KEY, null);
  return v?.email ?? null;
}

export function clearRemember() {
  localStorage.removeItem(REMEMBER_KEY);
}

// Users helpers
export function listUsers(): User[] {
  return readJSON<User[]>(USERS_KEY, []);
}

export function getUserByEmail(email: string): User | undefined {
  return listUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function isEmailTaken(email: string): boolean {
  return !!getUserByEmail(email);
}

async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function registerUser(params: { name: string; company: string; email: string; password: string }): Promise<{ ok: boolean; message?: string; verificationToken?: string }>{
  const { name, company, email, password } = params;
  // Basic validations
  if (!/.+@.+\..+/.test(email)) return { ok: false, message: 'Invalid email.' };
  if (isEmailTaken(email)) return { ok: false, message: 'The email is already registered.' };
  if (password.length < 8) return { ok: false, message: 'The password must be at least 8 characters.' };

  const passwordHash = await sha256(password);
  const users = listUsers();
  const user: User = { name, company, email, passwordHash, verified: false, createdAt: Date.now() };
  users.push(user);
  writeJSON(USERS_KEY, users);

  // Create verification token
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const verifications = readJSON<Record<string, string>>(VERIFICATIONS_KEY, {});
  verifications[token] = email;
  writeJSON(VERIFICATIONS_KEY, verifications);

  // Simulate sending email by logging and storing; a real app would call an email API
  console.info(`[auth] Verification email queued for ${email}. Token: ${token}`);
  return { ok: true, verificationToken: token };
}

export function verifyEmail(token: string): { ok: boolean; message?: string } {
  const verifications = readJSON<Record<string, string>>(VERIFICATIONS_KEY, {});
  const email = verifications[token];
  if (!email) return { ok: false, message: 'Invalid or expired token.' };
  const users = listUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return { ok: false, message: 'User not found.' };
  users[idx].verified = true;
  writeJSON(USERS_KEY, users);
  delete verifications[token];
  writeJSON(VERIFICATIONS_KEY, verifications);
  return { ok: true };
}

// Authentication using stored users
export async function authenticate(email: string, password: string): Promise<{ ok: boolean; message?: string }>{
  await new Promise(r => setTimeout(r, 300));
  if (!/.+@.+\..+/.test(email)) return { ok: false, message: 'Invalid email format.' };
  const user = getUserByEmail(email);
  if (!user) return { ok: false, message: 'User not found.' };
  const passwordHash = await sha256(password);
  if (user.passwordHash !== passwordHash) return { ok: false, message: 'Invalid password.' };
  if (!user.verified) return { ok: false, message: 'You must verify your email to log in.' };
  return { ok: true };
}
