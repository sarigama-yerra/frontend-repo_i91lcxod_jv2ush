import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'

export function HomesPage() {
  return <SearchBase listingType="HOUSE" title="Search student houses" intro="Find a whole student house to rent with your friends. Filter by area, bedrooms and distance from your university." />
}

export function RoomsPage() {
  return <SearchBase listingType="ROOM" title="Search rooms in shared houses" intro="Looking for a room rather than a full house? Find a bedroom in a shared student home, with future housemates already in place." />
}

function SearchBase({ listingType, title, intro }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })
  const [universities, setUniversities] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const [q, setQ] = useState(new URLSearchParams(location.search).get('q') || '')
  const [uniId, setUniId] = useState(new URLSearchParams(location.search).get('universityId') || '')
  const [minBedrooms, setMinBedrooms] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/universities`).then(r=>r.json()).then(setUniversities)
    search()
  },[])

  async function search(e){
    e && e.preventDefault()
    setLoading(true)
    const body = { q, universityId: uniId || undefined, listingType, minBedrooms: minBedrooms? Number(minBedrooms): undefined, minPrice: minPrice? Number(minPrice): undefined, maxPrice: maxPrice? Number(maxPrice): undefined }
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/properties/search`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  function onLogout(){ localStorage.clear(); setUser(null) }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{intro}</p>

        <form onSubmit={search} className="mt-6 bg-white rounded-xl border p-3 flex flex-col md:flex-row gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-slate-300" placeholder="Search by area or city" />
          <select value={uniId} onChange={e=>setUniId(e.target.value)} className="px-4 py-3 rounded-lg border border-slate-300">
            <option value="">Near university (any)</option>
            {universities.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <button className="px-5 py-3 rounded-lg bg-slate-900 text-white">Search {listingType === 'HOUSE' ? 'homes' : 'rooms'}</button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <select value={minBedrooms} onChange={e=>setMinBedrooms(e.target.value)} className="px-3 py-2 rounded-lg border">
            <option value="">Bedrooms: Any</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
          <input value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="px-3 py-2 rounded-lg border" placeholder="Min price" />
          <input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="px-3 py-2 rounded-lg border" placeholder="Max price" />
          <button onClick={search} className="px-4 py-2 rounded-lg border">Apply</button>
        </div>

        <div className="mt-6 text-sm text-slate-600">{items.length} {listingType === 'HOUSE' ? 'homes' : 'rooms'} found{q? ` for "${q}"`: ''}</div>
        {loading && <div className="mt-6">Loading…</div>}

        {!loading && items.length === 0 && (
          <div className="mt-6 bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-slate-900">No {listingType === 'HOUSE' ? 'homes' : 'rooms'} found for those filters</h3>
            <p className="text-sm text-slate-600">Try widening your search area, increasing your budget or removing one of the filters.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {items.map(i=> <PropertyCard key={i.id} p={i} />)}
        </div>
      </div>
    </div>
  )
}
