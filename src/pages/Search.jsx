import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'
import { apiGet, apiPost } from '../utils/api'

export function HomesPage() {
  return (
    <SearchBase
      listingType="HOUSE"
      title="Search student houses"
      intro="Find a whole student house to rent with your friends. Filter by area, bedrooms and distance from your university."
    />
  )
}

export function RoomsPage() {
  return (
    <SearchBase
      listingType="ROOM"
      title="Search rooms in shared houses"
      intro="Looking for a room rather than a full house? Find a bedroom in a shared student home, with future housemates already in place."
    />
  )
}

function useQueryParam(name, fallback = '') {
  const [val, setVal] = useState(() => {
    try {
      const usp = new URLSearchParams(window.location.search)
      return usp.get(name) ?? fallback
    } catch {
      return fallback
    }
  })

  // keep URL in sync (debounced a little via effect order)
  useEffect(() => {
    try {
      const usp = new URLSearchParams(window.location.search)
      if ((val ?? '') !== (usp.get(name) ?? '')) {
        if (val) usp.set(name, val)
        else usp.delete(name)
        const url = `${window.location.pathname}?${usp.toString()}`.replace(/\?$/, '')
        window.history.replaceState({}, '', url)
      }
    } catch {
      // ignore
    }
  }, [name, val])

  return [val, setVal]
}

function SearchBase({ listingType, title, intro }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })

  const [universities, setUniversities] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [booting, setBooting] = useState(true)
  const [error, setError] = useState('')

  const [q, setQ] = useQueryParam('q', '')
  const [uniId, setUniId] = useQueryParam('universityId', '')
  const [minBedrooms, setMinBedrooms] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const filtersSummary = useMemo(() => {
    const bits = []
    if (q) bits.push(`“${q}”`)
    if (uniId) {
      const u = universities.find(u => u.id === uniId)
      if (u) bits.push(`near ${u.name}`)
    }
    if (minBedrooms) bits.push(`${minBedrooms}+ beds`)
    if (minPrice || maxPrice) bits.push(`£${minPrice || 0}–£${maxPrice || 'Any'}`)
    return bits.join(' • ')
  }, [q, uniId, universities, minBedrooms, minPrice, maxPrice])

  useEffect(() => {
    let mounted = true
    async function boot() {
      setError('')
      try {
        // Try to load universities; seed if needed
        let uni = []
        try {
          uni = await apiGet('/universities')
        } catch {
          // try seeding once
          try {
            await apiPost('/seed', {})
            uni = await apiGet('/universities')
          } catch (e) {
            // if still failing, leave empty; error will show on search
            uni = []
          }
        }
        if (!mounted) return
        setUniversities(Array.isArray(uni) ? uni : [])
      } finally {
        if (!mounted) return
        setBooting(false)
        await search() // run initial search regardless
      }
    }
    boot()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingType])

  async function search(e) {
    e && e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const body = {
        q: q || undefined,
        universityId: uniId || undefined,
        listingType,
        minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      }
      const data = await apiPost('/properties/search', body)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      let msg = 'Search failed. Please try again.'
      try {
        const parsed = JSON.parse(err.message)
        msg = parsed.detail || msg
      } catch {
        // if backend unreachable, give a helpful hint
        if ((err.message || '').includes('Failed to fetch')) {
          msg = 'Cannot reach the server. Please ensure the backend is running and CORS is allowed.'
        }
      }
      setError(msg)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  function onLogout() {
    try { localStorage.clear() } catch {}
    setUser(null)
  }

  const isRooms = listingType === 'ROOM'

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-2 text-slate-600 max-w-2xl">{intro}</p>
          </div>
          <div className="hidden md:block text-right text-sm text-slate-500">
            <div>Backend: <code className="text-slate-700">{import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}</code></div>
          </div>
        </div>

        <form onSubmit={search} className="mt-6 bg-white rounded-xl border p-3 flex flex-col md:flex-row gap-3">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Search by area, city or property title"
            aria-label="Search query"
          />
          <select
            value={uniId}
            onChange={(e)=>setUniId(e.target.value)}
            className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 min-w-[220px]"
            aria-label="University filter"
          >
            <option value="">Near university (any)</option>
            {universities.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <button type="submit" className="px-5 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition">Search {isRooms ? 'rooms' : 'homes'}</button>
        </form>

        <div className="mt-2 text-sm text-red-600 min-h-[1.25rem]">{error}</div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <select value={minBedrooms} onChange={e=>setMinBedrooms(e.target.value)} className="px-3 py-2 rounded-lg border">
            <option value="">Bedrooms: Any</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
          <input type="number" min={0} value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="px-3 py-2 rounded-lg border" placeholder="Min price" />
          <input type="number" min={0} value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="px-3 py-2 rounded-lg border" placeholder="Max price" />
          <button onClick={search} className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-50">Apply</button>
          {filtersSummary && (
            <span className="text-slate-500">Filters: {filtersSummary}</span>
          )}
          {(minBedrooms || minPrice || maxPrice || q || uniId) && (
            <button
              type="button"
              onClick={() => { setQ(''); setUniId(''); setMinBedrooms(''); setMinPrice(''); setMaxPrice(''); search() }}
              className="ml-auto text-slate-600 hover:text-slate-900 underline"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <div className="text-sm text-slate-600">
            {loading ? 'Searching…' : `${items.length} ${isRooms ? 'rooms' : 'homes'} found${q ? ` for "${q}"` : ''}`}
          </div>
        </div>

        {booting && (
          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        )}

        {!booting && !loading && items.length === 0 && !error && (
          <div className="mt-6 bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-slate-900">No {isRooms ? 'rooms' : 'homes'} found</h3>
            <p className="text-sm text-slate-600 mt-1">Try widening your search area, adjusting your budget, or removing a filter.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {items.map(i=> <PropertyCard key={i.id} p={i} />)}
        </div>
      </div>
    </div>
  )
}
