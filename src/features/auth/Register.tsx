import { useEffect, useMemo, useRef, useState } from 'react'
import { isEmailTaken, registerUser } from '../../utils/auth'

export default function Register() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'error' | 'info' | 'success'>('info')
  const liveRef = useRef<HTMLDivElement>(null)

  const emailTaken = useMemo(() => (!!email && isEmailTaken(email)), [email])
  const passwordTooShort = useMemo(() => password.length > 0 && password.length < 8, [password])
  const confirmMismatch = useMemo(() => confirm.length > 0 && password !== confirm, [password, confirm])

  useEffect(() => {
    // limpiar mensajes al cambiar input
    setMessage(null)
  }, [name, company, email, password, confirm])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (!/.+@.+\..+/.test(email)) {
      setMessageType('error'); setMessage('Invalid email.'); return
    }
    if (emailTaken) { setMessageType('error'); setMessage('The email is already registered.'); return }
    if (passwordTooShort) { setMessageType('error'); setMessage('The password must be at least 8 characters.'); return }
    if (confirmMismatch) { setMessageType('error'); setMessage('The passwords do not match.'); return }
    if (!name.trim() || !company.trim()) { setMessageType('error'); setMessage('Enter name and company.'); return }

    setLoading(true)
    const res = await registerUser({ name: name.trim(), company: company.trim(), email: email.trim(), password })
    setLoading(false)
    if (!res.ok) { setMessageType('error'); setMessage(res.message || 'Could not register.'); return }

    setMessageType('success')
    setMessage('Registration successful. Check your email to verify your account.')
    // para demo, redirigimos a verify con el token simulado
    if (res.verificationToken) {
      location.hash = `#/verify?token=${encodeURIComponent(res.verificationToken)}`
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-4">
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src="/logo-preview-placeholder.svg" alt="Logo" className="h-12 w-12" />
          <h1 className="text-center text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-gray-600">Create a new account to access</p>
        </div>

        <div role="status" aria-live="polite" aria-atomic="true" ref={liveRef} className={`mb-3 text-sm ${messageType === 'error' ? 'text-red-600' : messageType === 'success' ? 'text-emerald-600' : 'text-gray-700'}`}>
          {message}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">Full name</label>
            <input id="name" required placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="placeholder:text-gray-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
          </div>
          <div>
            <label htmlFor="company" className="sr-only">Company</label>
            <input id="company" required placeholder="Company" value={company} onChange={e=>setCompany(e.target.value)} className="placeholder:text-gray-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input id="email" type="email" inputMode="email" autoComplete="username" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} aria-invalid={Boolean(emailTaken)} className="placeholder:text-gray-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
            {emailTaken && <p className="mt-1 text-xs text-red-600">El correo ya está registrado.</p>}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} aria-invalid={passwordTooShort} className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
              <button type="button" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword} onClick={()=>setShowPassword(s=>!s)} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-700 hover:text-gray-900 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-r-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-5 transition-transform duration-200 ${showPassword ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}`}>
                  {showPassword ? (
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                  ) : (
                    <path d="M2 12s3-7 10-7c2.5 0 4.5.8 6 1.9L20.6 4 22 5.4 4.4 23 3 21.6l3.1-3.1C3.5 16.9 2 12 2 12zm8.6 1.8l1.6-1.6a2 2 0 00-2.8-2.8l-1.6 1.6a4 4 0 002.8 2.8z" />
                  )}
                </svg>
              </button>
            </div>
            {passwordTooShort && <p className="mt-1 text-xs text-red-600">The password must be at least 8 characters.</p>}
          </div>
          <div>
            <label htmlFor="confirm" className="sr-only">Confirm password</label>
            <div className="relative">
              <input id="confirm" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" required placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} aria-invalid={confirmMismatch} className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
              <button type="button" aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showConfirm} onClick={()=>setShowConfirm(s=>!s)} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-700 hover:text-gray-900 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-r-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-5 transition-transform duration-200 ${showConfirm ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}`}>
                  {showConfirm ? (
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                  ) : (
                    <path d="M2 12s3-7 10-7c2.5 0 4.5.8 6 1.9L20.6 4 22 5.4 4.4 23 3 21.6l3.1-3.1C3.5 16.9 2 12 2 12zm8.6 1.8l1.6-1.6a2 2 0 00-2.8-2.8l-1.6 1.6a4 4 0 002.8 2.8z" />
                  )}
                </svg>
              </button>
            </div>
            {confirmMismatch && <p className="mt-1 text-xs text-red-600">The passwords do not match.</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-md bg-indigo-600 py-2.5 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
            {loading ? 'Creating…' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-gray-700">
            Already have an account?{' '}
            <a href="#/login" className="font-medium text-indigo-700 hover:underline">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  )
}
