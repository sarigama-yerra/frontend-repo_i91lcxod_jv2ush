import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { apiGet, apiPost } from '../utils/api'
import { Link } from 'react-router-dom'

export default function StudentBookings(){
  const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('user')||'null'))
  const [items, setItems] = useState([])

  useEffect(()=>{ fetchData() },[])

  function onLogout(){ localStorage.clear(); setUser(null) }

  async function fetchData(){
    try{ const data = await apiGet('/student/bookings'); setItems(data) } catch(e){}
  }

  async function cancel(id){
    try{ await apiPost(`/student/bookings/${id}/cancel`); fetchData() } catch(e){}
  }

  const upcoming = items.filter(i=> new Date(i.startDateTime) >= new Date() && i.status !== 'CANCELLED')
  const past = items.filter(i=> new Date(i.startDateTime) < new Date() || i.status === 'CANCELLED')

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">My viewings</h1>
        <p className="mt-2 text-slate-600">Here are all your upcoming and past viewing appointments.</p>

        <section className="mt-6">
          <h3 className="font-semibold text-slate-900">Upcoming</h3>
          {upcoming.length === 0 ? (
            <div className="mt-3 text-sm text-slate-700">You don’t have any viewings yet. Start by searching for homes or rooms and book a time that suits you.</div>
          ) : (
            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              {upcoming.map(b=> (
                <div key={b.id} className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <Link to={`/property/${b.propertyId}`} className="font-medium text-slate-900">View property</Link>
                    <span className="text-xs px-2 py-1 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700">{b.status}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">{new Date(b.startDateTime).toLocaleString()}</div>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/property/${b.propertyId}`} className="px-3 py-2 rounded-md border">View details</Link>
                    <button onClick={()=>cancel(b.id)} className="px-3 py-2 rounded-md border">Cancel viewing</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h3 className="font-semibold text-slate-900">Past</h3>
          {past.length === 0 ? (
            <div className="mt-3 text-sm text-slate-700">No past viewings.</div>
          ) : (
            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              {past.map(b=> (
                <div key={b.id} className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <Link to={`/property/${b.propertyId}`} className="font-medium text-slate-900">View property</Link>
                    <span className="text-xs px-2 py-1 rounded-full border">{b.status}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">{new Date(b.startDateTime).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
