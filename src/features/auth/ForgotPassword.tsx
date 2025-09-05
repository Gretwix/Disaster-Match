import { useState } from 'react'
import { startPasswordReset } from '../../utils/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [type, setType] = useState<'info' | 'success' | 'error'>('info')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setType('info')
    setLoading(true)
    const res = startPasswordReset(email.trim())
    setLoading(false)
    // No revelar existencia de cuenta explícitamente
    if (res.ok) {
      setType('success')
      setMessage('If the email address exists, well send you a reset link. Check your email.')
      if (res.token) {
        // Demo: navegar directo al reset con el token simulado
        location.hash = `#/reset?token=${encodeURIComponent(res.token)}`
      }
    } else {
      setType('success')
      setMessage('If the email address exists, well send you a link to reset it. Check your email.')
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-4">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img src="/logo-preview-placeholder.svg" alt="Logo" className="h-12 w-12" />
          <h1 className="text-center text-2xl font-semibold tracking-tight">Forgot password</h1>
          <p className="text-sm text-gray-600 text-center">Enter your email and we'll send you instructions to reset your password.</p>
        </div>

        <div role="status" aria-live="polite" aria-atomic="true" className={`mb-3 text-sm ${type==='error'?'text-red-600':type==='success'?'text-emerald-600':'text-gray-700'}`}>
          {message}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input id="email" type="email" inputMode="email" autoComplete="username" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="placeholder:text-gray-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-md bg-indigo-600 py-2.5 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>

          <p className="text-center text-sm text-gray-700">
            Remembered it? <a href="#/login" className="font-medium text-indigo-700 hover:underline">Back to sign in</a>
          </p>
        </form>
      </div>
    </div>
  )
}
