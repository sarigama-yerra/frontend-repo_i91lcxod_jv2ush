import { useState } from 'react'
import Navbar from '../components/Navbar'
import { apiPost, setToken } from '../utils/api'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await apiPost('/auth/login', { email, password })
      setToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
        <form onSubmit={onSubmit} className="mt-6 bg-white rounded-xl border p-6 space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm text-slate-700">Email address</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" className="mt-1 w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-slate-700">Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" className="mt-1 w-full px-4 py-2 rounded-lg border" />
          </div>
          <button className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white">Log in</button>
        </form>
      </div>
    </div>
  )
}

export function SignupPage({ role = 'student' }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isStudent, setIsStudent] = useState(true)
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match')
    setError('')
    try {
      const data = await apiPost('/auth/signup', { fullName, email, mobileNumber: mobile, password, role, companyName })
      setToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError('Failed to create account')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">{role === 'student' ? 'Create your student account' : 'Create your landlord account'}</h1>
        <p className="mt-2 text-slate-600 text-sm">{role === 'student' ? 'Save your favourite homes, book viewings and keep track of your appointments.' : 'Reach verified students and manage your portfolio.'}</p>
        <form onSubmit={onSubmit} className="mt-6 bg-white rounded-xl border p-6 space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm text-slate-700">Full name</label>
            <input value={fullName} onChange={e=>setFullName(e.target.value)} required className="mt-1 w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-slate-700">Email address</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" className="mt-1 w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-slate-700">Mobile number</label>
            <input value={mobile} onChange={e=>setMobile(e.target.value)} required className="mt-1 w-full px-4 py-2 rounded-lg border" />
          </div>
          {role === 'landlord' && (
            <div>
              <label className="block text-sm text-slate-700">Company name (optional)</label>
              <input value={companyName} onChange={e=>setCompanyName(e.target.value)} className="mt-1 w-full px-4 py-2 rounded-lg border" />
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-700">Password</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" className="mt-1 w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-slate-700">Confirm password</label>
            <input value={confirm} onChange={e=>setConfirm(e.target.value)} required type="password" className="mt-1 w-full px-4 py-2 rounded-lg border" />
          </div>
          {role === 'student' && (
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={isStudent} onChange={e=>setIsStudent(e.target.checked)} /> I am a student or planning to start university/college.</label>
          )}
          <button className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white">Sign up</button>
          <p className="text-xs text-slate-500">By creating an account, you agree to our Terms and Privacy Policy.</p>
        </form>
      </div>
    </div>
  )
}
