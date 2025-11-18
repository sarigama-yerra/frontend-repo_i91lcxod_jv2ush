import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { apiGet, apiPost } from '../utils/api'

export default function LandlordDashboard(){
  const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('user')||'null'))
  const [props, setProps] = useState([])
  const [selected, setSelected] = useState('')
  const [date, setDate] = useState('')
  const [start, setStart] = useState('14:00')
  const [end, setEnd] = useState('15:00')

  useEffect(()=>{ fetchProps() },[])

  function onLogout(){ localStorage.clear(); setUser(null) }

  async function fetchProps(){ const data = await apiGet('/landlord/properties'); setProps(data); if(data[0]) setSelected(data[0].id) }

  async function createSlot(e){ e.preventDefault(); await apiPost('/landlord/slots', { propertyId: selected, date, startTime: start, endTime: end }); alert('Slot created'); }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back{user? `, ${user.fullName}`:''}</h1>
        <p className="mt-2 text-slate-600">Here’s a quick view of your student properties and bookings.</p>

        <section className="mt-6">
          <h3 className="font-semibold text-slate-900">Your properties</h3>
          <div className="mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {props.map(p=> (
              <div key={p.id} className="bg-white rounded-xl border p-4">
                <div className="font-medium text-slate-900">{p.title}</div>
                <div className="text-sm text-slate-600">{p.city} • {p.listingType}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="font-semibold text-slate-900">Viewing availability</h3>
          <form onSubmit={createSlot} className="mt-3 bg-white rounded-xl border p-4 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-sm">Property</label>
              <select value={selected} onChange={e=>setSelected(e.target.value)} className="mt-1 px-3 py-2 rounded-lg border">
                {props.map(p=> <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">Date</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 px-3 py-2 rounded-lg border" />
            </div>
            <div>
              <label className="block text-sm">Start</label>
              <input type="time" value={start} onChange={e=>setStart(e.target.value)} className="mt-1 px-3 py-2 rounded-lg border" />
            </div>
            <div>
              <label className="block text-sm">End</label>
              <input type="time" value={end} onChange={e=>setEnd(e.target.value)} className="mt-1 px-3 py-2 rounded-lg border" />
            </div>
            <button className="px-4 py-2 rounded-lg bg-slate-900 text-white">Add slot</button>
          </form>
        </section>
      </div>
    </div>
  )
}
