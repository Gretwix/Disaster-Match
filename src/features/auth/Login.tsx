import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MAX_ATTEMPTS,
  LOCKOUT_MINUTES,
  addFailedAttempt,
  authenticate,
  clearFailedAttempts,
  clearLockout,
  getAttemptsCount,
  getLockout,
  getRemember,
  setLockout,
  setRemember,
  type LockoutInfo,
} from '../../utils/auth'

const LOGO_PREVIEW_SRC = '/logo-preview-placeholder.svg' 
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRememberChecked] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'error' | 'info' | 'success'>('info')
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const [lockout, setLockoutState] = useState<LockoutInfo | null>(getLockout())

  useEffect(() => {
    const saved = getRemember()
    if (saved) setEmail(saved)
  }, [])

  // Actualizar lockout automáticamente si expira mientras el usuario está en la página
  useEffect(() => {
    const id = setInterval(() => {
      const info = getLockout()
      setLockoutState(info)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const lockedForCurrent = useMemo(() => {
    if (!lockout) return false
    return lockout.email === email
  }, [lockout, email])

  const remainingSeconds = useMemo(() => {
    if (!lockout || !lockedForCurrent) return 0
    return Math.max(0, Math.ceil((lockout.until - Date.now()) / 1000))
  }, [lockout, lockedForCurrent])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    const lock = getLockout()
    if (lock && lock.email === email && Date.now() < lock.until) {
      setLockoutState(lock)
      setMessageType('error')
      setMessage(`Your account is blocked for security reasons. Please try again later. ${Math.ceil((lock.until - Date.now())/60000)} min.`)
      return
    }

    setLoading(true)
    const result = await authenticate(email.trim(), password)
    setLoading(false)

    if (!result.ok) {
      addFailedAttempt(email)
      const count = getAttemptsCount(email)
      const remaining = Math.max(0, MAX_ATTEMPTS - count)
      setMessageType('error')
      setMessage(result.message ?? 'Authentication error.')
      if (remaining === 0) {
        setLockout(email, count)
        setLockoutState(getLockout())
        setMessage(`The maximum number of attempts has been reached. Account blocked by ${LOCKOUT_MINUTES} min.`)
      } else {
        setMessage(prev => `${prev ?? ''} You have left ${remaining} attempt(s) before blocking.`)
      }
      liveRegionRef.current?.focus()
      return
    }

    // éxito
    clearFailedAttempts(email)
    clearLockout()
    setMessageType('success')
    setMessage('Login successful.')

    if (remember) setRemember(email)

    // Aquí redirigirías a tu dashboard. Para demo: limpiar password
    setPassword('')
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-4">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={LOGO_PREVIEW_SRC}
            alt="Logo"
            className="h-12 w-12"
          />
          <h1 className="text-center text-2xl font-semibold tracking-tight">Sign in to your account</h1>
        </div>

        {/* Región para mensajes accesibles */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={-1}
          ref={liveRegionRef}
          className={`mb-3 text-sm ${
            messageType === 'error' ? 'text-red-600' : messageType === 'success' ? 'text-emerald-600' : 'text-gray-700'
          }`}
        >
          {message}
        </div>

        <form onSubmit={onSubmit} className="space-y-4" aria-describedby="form-help">
          <div className="space-y-1.5">
            {/* Etiqueta solo para lector de pantalla para accesibilidad */}
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="placeholder:text-gray-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            {/* Etiqueta solo para lector de pantalla para accesibilidad */}
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative group">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={messageType === 'error' && !!message}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />

              {/* Botón ojo accesible */}
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(s => !s)}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-700 hover:text-gray-900 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-r-md"
              >
                {/* Icono simple */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`size-5 transition-transform duration-200 ${showPassword ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}`}
                >
                  {showPassword ? (
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                  ) : (
                    <path d="M2 12s3-7 10-7c2.5 0 4.5.8 6 1.9L20.6 4 22 5.4 4.4 23 3 21.6l3.1-3.1C3.5 16.9 2 12 2 12zm8.6 1.8l1.6-1.6a2 2 0 00-2.8-2.8l-1.6 1.6a4 4 0 002.8 2.8z" />
                  )}
                </svg>
              </button>

            </div>
            <div className="flex items-center justify-between mt-1">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={remember}
                  onChange={(e) => setRememberChecked(e.target.checked)}
                />
                Remember me
              </label>

              <a href="#/forgot" className="text-sm font-medium text-indigo-700 hover:underline">Forgot password?</a>
            </div>
          </div>

          {lockedForCurrent && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2" role="alert">
              Account blocked. Please try again in {Math.ceil(remainingSeconds/60)} min ({remainingSeconds}s).
            </div>
          )}

          <button
            type="submit"
            disabled={loading || lockedForCurrent}
            className="w-full rounded-md bg-indigo-600 py-2.5 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            {loading ? 'Ingresando…' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-gray-700">
            Don’t have an account?{' '}
            <a href="#/signup" className="font-medium text-indigo-700 hover:underline">Sign up</a>
          </p>

          <p id="form-help" className="sr-only">
            Usa Tab para navegar. Los errores se anuncian automáticamente.
          </p>
        </form>
      </div>
    </div>
  )
}
