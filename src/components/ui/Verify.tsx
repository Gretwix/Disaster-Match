import { useEffect, useState } from 'react'
import { verifyEmail } from '../../utils/auth'

function useQuery() {
  const [params, setParams] = useState(() => new URLSearchParams(location.hash.split('?')[1] || ''))
  useEffect(() => {
    const onHash = () => setParams(new URLSearchParams(location.hash.split('?')[1] || ''))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return params
}

export default function Verify() {
  const q = useQuery()
  const [status, setStatus] = useState<'idle'|'ok'|'error'>('idle')
  const [message, setMessage] = useState<string>('Checking…')

  useEffect(() => {
    const token = q.get('token') || ''
    if (!token) { setStatus('error'); setMessage('Missing token.'); return }
    const res = verifyEmail(token)
    if (res.ok) { setStatus('ok'); setMessage('Email verified! You can now log in.') }
    else { setStatus('error'); setMessage(res.message || 'Could not be verified.') }
  }, [q])

  return (
    <div className="min-h-svh flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-4 text-center">
        <h1 className="text-2xl font-semibold mb-3">Email verification</h1>
        <p className={status==='error' ? 'text-red-600' : 'text-emerald-600'}>{message}</p>
        <a href="#/login" className="inline-block mt-6 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium">Go to login</a>
      </div>
    </div>
  )
}
