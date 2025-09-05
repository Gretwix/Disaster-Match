import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Verify from './features/auth/Verify'
import ForgotPassword from './features/auth/ForgotPassword'
import ResetPassword from './features/auth/ResetPassword'

function App() {
  const [route, setRoute] = useState<string>(() => location.hash || '#/login')

  useEffect(() => {
    const onHash = () => setRoute(location.hash || '#/login')
    window.addEventListener('hashchange', onHash)
    if (!location.hash) location.hash = '#/login'
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route.startsWith('#/signup')) return <Register />
  if (route.startsWith('#/verify')) return <Verify />
  if (route.startsWith('#/forgot')) return <ForgotPassword />
  if (route.startsWith('#/reset')) return <ResetPassword />
  return <Login />
}

export default App
