import { useEffect, useMemo, useState } from 'react'
import { getEmailForResetToken, resetPassword } from '../../utils/auth'

function useQueryParam(name: string) {
  const [value, setValue] = useState<string | null>(() => new URLSearchParams(location.hash.split('?')[1] || '').get(name))
  useEffect(() => {
    const onHash = () => setValue(new URLSearchParams(location.hash.split('?')[1] || '').get(name))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [name])
  return value
}

export default function ResetPassword() {
  const token = useQueryParam('token') || ''
  const email = useMemo(() => (token ? getEmailForResetToken(token) : null), [token])

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [type, setType] = useState<'info'|'success'|'error'>('info')

  const tooShort = password.length > 0 && password.length < 8
  const mismatch = confirm.length > 0 && password !== confirm

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!token || !email) { setType('error'); setMessage('Invalid or expired token.'); return }
    if (tooShort) { setType('error'); setMessage('The password must be at least 8 characters.'); return }
    if (mismatch) { setType('error'); setMessage('The passwords do not match.'); return }

    setLoading(true)
    const res = await resetPassword(token, password)
    setLoading(false)
    if (!res.ok) { setType('error'); setMessage(res.message || 'Could not be restored.'); return }
    setType('success')
    setMessage('Password reset. You can now log in.')
    setPassword(''); setConfirm('')
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-4">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img src="/logo-preview-placeholder.svg" alt="Logo" className="h-12 w-12" />
          <h1 className="text-center text-2xl font-semibold tracking-tight">Reset password</h1>
          <p className="text-sm text-gray-600 text-center">{email ? `Para: ${email}` : 'The link may have expired.'}</p>
        </div>

        <div role="status" aria-live="polite" aria-atomic="true" className={`mb-3 text-sm ${type==='error'?'text-red-600':type==='success'?'text-emerald-600':'text-gray-700'}`}>
          {message}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">New password</label>
            <div className="relative">
              <input id="password" type={showPassword?'text':'password'} autoComplete="new-password" required placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} aria-invalid={tooShort} className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
              <button type="button" aria-label={showPassword?'Ocultar contraseña':'Mostrar contraseña'} aria-pressed={showPassword} onClick={()=>setShowPassword(s=>!s)} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-700 hover:text-gray-900 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-r-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-5 transition-transform duration-200 ${showPassword?'scale-110 rotate-6':'scale-100 rotate-0'}` }>
                  {showPassword ? (
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                  ) : (
                    <path d="M2 12s3-7 10-7c2.5 0 4.5.8 6 1.9L20.6 4 22 5.4 4.4 23 3 21.6l3.1-3.1C3.5 16.9 2 12 2 12zm8.6 1.8l1.6-1.6a2 2 0 00-2.8-2.8l-1.6 1.6a4 4 0 002.8 2.8z" />
                  )}
                </svg>
              </button>
            </div>
            {tooShort && <p className="mt-1 text-xs text-red-600">The password must be at least 8 characters.</p>}
          </div>

          <div>
            <label htmlFor="confirm" className="sr-only">Confirm new password</label>
            <div className="relative">
              <input id="confirm" type={showConfirm?'text':'password'} autoComplete="new-password" required placeholder="Confirm new password" value={confirm} onChange={e=>setConfirm(e.target.value)} aria-invalid={mismatch} className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
              <button type="button" aria-label={showConfirm?'Ocultar contraseña':'Mostrar contraseña'} aria-pressed={showConfirm} onClick={()=>setShowConfirm(s=>!s)} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-700 hover:text-gray-900 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-r-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-5 transition-transform duration-200 ${showConfirm?'scale-110 rotate-6':'scale-100 rotate-0'}` }>
                  {showConfirm ? (
                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                  ) : (
                    <path d="M2 12s3-7 10-7c2.5 0 4.5.8 6 1.9L20.6 4 22 5.4 4.4 23 3 21.6l3.1-3.1C3.5 16.9 2 12 2 12zm8.6 1.8l1.6-1.6a2 2 0 00-2.8-2.8l-1.6 1.6a4 4 0 002.8 2.8z" />
                  )}
                </svg>
              </button>
            </div>
            {mismatch && <p className="mt-1 text-xs text-red-600">The passwords do not match.</p>}
          </div>

          <button type="submit" disabled={loading || !email} className="w-full rounded-md bg-indigo-600 py-2.5 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
            {loading ? 'Saving…' : 'Reset password'}
          </button>

          <p className="text-center text-sm text-gray-700">
            <a href="#/login" className="font-medium text-indigo-700 hover:underline">Back to sign in</a>
          </p>
        </form>
      </div>
    </div>
  )
}
