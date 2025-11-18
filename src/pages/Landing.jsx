import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'
import { apiGet } from '../utils/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Landing() {
  const [universities, setUniversities] = useState([])
  const [featured, setFeatured] = useState([])
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })
  const [q, setQ] = useState('')
  const [uniId, setUniId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    apiGet('/universities').then(setUniversities).catch(() => {})
    // Load a few properties
    fetchFeatured()
  }, [])

  async function fetchFeatured() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/properties/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const data = await res.json()
      setFeatured(data.slice(0, 6))
    } catch (e) {}
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
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-sky-50"/>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Find your next student home in minutes</h1>
            <p className="mt-4 text-lg text-slate-600">Search verified student houses and rooms by area, bedrooms and distance from your university – then book a viewing online.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/homes" className="px-5 py-3 rounded-lg bg-slate-900 text-white">Search homes</Link>
              <Link to="/rooms" className="px-5 py-3 rounded-lg border border-slate-300">Browse rooms only →</Link>
            </div>

            <form onSubmit={onSearch} className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex flex-col md:flex-row gap-3">
              <input value={q} onChange={e=>setQ(e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-slate-300" placeholder="e.g. Headingley, Fallowfield, Jesmond…" />
              <select value={uniId} onChange={e=>setUniId(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-300">
                <option value="">Near university (any)</option>
                {universities.map(u=> (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <button className="px-5 py-3 rounded-lg bg-indigo-600 text-white">Search</button>
            </form>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {title: 'Search your area', text: 'Type your university or favourite neighbourhood and filter by price, bedrooms and distance.'},
            {title: 'Compare homes & rooms', text: 'View photos, key features and travel time to campus so you can shortlist quickly.'},
            {title: 'Book your viewing online', text: 'Pick a time that works for you. Your slot is reserved instantly, and the landlord gets notified.'},
          ].map((b, i)=> (
            <div key={i} className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-slate-900">{b.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold">One dashboard for all your student lets</h2>
              <p className="mt-3 text-slate-300">List your student properties, set viewing availability, and receive qualified enquiries from verified students.</p>
              <ul className="list-disc list-inside mt-3 text-slate-300 space-y-1">
                <li>Add whole houses or individual rooms</li>
                <li>Control your viewing slots</li>
                <li>Keep track of bookings in one place</li>
              </ul>
              <Link to="/landlords" className="inline-block mt-4 px-5 py-3 rounded-lg bg-white text-slate-900">List my property</Link>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <p className="text-slate-200">A clear, simple dashboard for landlords to manage properties, slots and bookings.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured properties</h2>
          <Link to="/homes" className="text-indigo-600">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {featured.map(f => <PropertyCard key={f.id} p={f} />)}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          {[
            {q: 'Do I have to pay to use this site as a student?', a: 'No. Searching and booking viewings is free for students.'},
            {q: 'Can I just rent a room instead of a whole house?', a: "Yes. Filter by 'Rooms only' to see rooms available in shared student houses."},
            {q: 'How do viewing bookings work?', a: 'Pick a time that suits you from the available slots on the property page. Once you confirm, that slot is reserved and the landlord is notified.'},
            {q: 'Do you handle contracts and rent payments?', a: "No. We connect you with landlords and help organise viewings. Contracts and rent are handled directly between you and the landlord or letting agent."},
          ].map((item, i)=> (
            <div key={i} className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-2 text-slate-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-slate-900">Contact</h3>
          <p className="mt-2 text-slate-600 text-sm">Email: hello@uninesthub.example</p>
        </div>
      </section>
    </div>
  )
}
