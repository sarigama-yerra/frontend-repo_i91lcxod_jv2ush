import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BedDouble, MapPin, Search, ShieldCheck, CalendarClock, Sparkles, ArrowRight, Building2, Users } from 'lucide-react'

import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'
import { apiGet, apiPost, API_BASE } from '../utils/api'

export default function Landing() {
  const [universities, setUniversities] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })

  const [q, setQ] = useState('')
  const [uniId, setUniId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    init()
  }, [])

  async function init() {
    setLoading(true)
    setError('')
    try {
      const uni = await apiGet('/universities')
      if (!uni || uni.length === 0) {
        // auto-seed if empty
        await apiPost('/seed')
      }
      const finalUni = uni && uni.length ? uni : await apiGet('/universities')
      setUniversities(finalUni)

      const results = await apiPost('/properties/search', {})
      setFeatured((results || []).slice(0, 6))
    } catch (e) {
      setError('We had trouble loading content. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  function onLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null)
  }

  function onSearch(e) {
    e.preventDefault()
    const base = '/homes'
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (uniId) params.set('universityId', uniId)
    navigate(`${base}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar user={user} onLogout={onLogout} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-200 blur-3xl opacity-30"/>
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-sky-200 blur-3xl opacity-40"/>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/60 to-white"/>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-sm text-indigo-700">
                <Sparkles className="h-4 w-4"/>
                Student lettings made simple
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight">
                Find your next student home
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">in minutes</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-xl">
                Search verified houses and rooms near your university and book a viewing online. No hidden fees. No endless emails.
              </p>

              <form onSubmit={onSearch} className="mt-6 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-200 p-3 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/>
                  <input value={q} onChange={e=>setQ(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search areas, e.g. Headingley, Jesmond…" />
                </div>
                <select value={uniId} onChange={e=>setUniId(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Near university (any)</option>
                  {universities.map(u=> (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
                  <Search className="h-5 w-5"/>
                  Search
                </button>
              </form>

              <div className="mt-4 flex items-center gap-6 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500"/> Verified listings</div>
                <div className="inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-indigo-500"/> Instant viewing booking</div>
                <div className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-sky-500"/> Built for students</div>
              </div>
            </motion.div>

            <motion.div className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              <div className="relative rounded-3xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="grid grid-cols-2 gap-4">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-40 rounded-xl bg-slate-100 animate-pulse" />
                    ))
                  ) : (
                    featured.slice(0,4).map(f => (
                      <div key={f.id} className="rounded-xl overflow-hidden border">
                        <PropertyCard p={f} />
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-2xl bg-indigo-600 text-white px-4 py-2 shadow-lg inline-flex items-center gap-2">
                <Home className="h-4 w-4"/> Popular near you
              </div>
            </motion.div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-slate-600">
          <div className="flex items-center justify-center gap-2"><Building2 className="h-5 w-5 text-slate-400"/> Partnered landlords</div>
          <div className="flex items-center justify-center gap-2"><Home className="h-5 w-5 text-slate-400"/> Whole homes</div>
          <div className="flex items-center justify-center gap-2"><BedDouble className="h-5 w-5 text-slate-400"/> Rooms in shared houses</div>
          <div className="flex items-center justify-center gap-2"><MapPin className="h-5 w-5 text-slate-400"/> Near top universities</div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">Featured properties</h2>
          <Link to="/homes" className="inline-flex items-center gap-1 text-indigo-600 hover:underline">View all <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-slate-100 animate-pulse" />
            ))
          ) : (
            featured.map(f => <PropertyCard key={f.id} p={f} />)
          )}
        </div>
      </section>

      {/* Landlord pitch */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-sky-500"/>
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 0%, white 0, transparent 35%)` }} />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 text-white">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-semibold">One dashboard for all your student lets</h2>
              <p className="mt-3 text-white/80 max-w-lg">List properties, set viewing availability, and receive qualified enquiries from verified students.</p>
              <ul className="mt-4 space-y-2 text-white/90">
                <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/> Verified students only</li>
                <li className="flex items-center gap-2"><CalendarClock className="h-5 w-5"/> Control your viewing slots</li>
                <li className="flex items-center gap-2"><Home className="h-5 w-5"/> List homes or individual rooms</li>
              </ul>
              <Link to="/landlord" className="mt-6 inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-xl shadow hover:shadow-md transition">
                List my property <ArrowRight className="h-4 w-4"/>
              </Link>
            </div>
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur">
              <p className="text-white/90">A clear, modern dashboard to manage properties, slots and bookings — all in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">Frequently asked questions</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {[
            {q: 'Is this free for students?', a: 'Yes. Searching and booking viewings is free for students.'},
            {q: 'Can I just rent a room?', a: 'Yes. Filter by Rooms to see rooms available in shared houses.'},
            {q: 'How do bookings work?', a: 'Pick a time that suits you from the available slots. Once confirmed, the slot is reserved and the landlord is notified.'},
            {q: 'Do you handle contracts?', a: 'No. We connect students and landlords and help organise viewings. Contracts and rent are handled directly.'},
          ].map((item, i)=> (
            <div key={i} className="bg-white rounded-2xl border p-6">
              <h3 className="font-semibold">{item.q}</h3>
              <p className="mt-2 text-slate-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Still have questions?</h3>
            <p className="text-slate-600 text-sm">Email us: hello@uninesthub.example</p>
          </div>
          <Link to="/homes" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white">Start searching <ArrowRight className="h-4 w-4"/></Link>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold">Ready to find your next place?</h3>
              <p className="mt-2 text-white/80">Join thousands of students who’ve used our platform to book viewings in minutes.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/homes" className="px-5 py-3 rounded-xl bg-white text-slate-900">Search homes</Link>
              <Link to="/rooms" className="px-5 py-3 rounded-xl border border-white/30 text-white">Browse rooms</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
