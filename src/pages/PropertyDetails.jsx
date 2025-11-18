import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiGet, apiPost } from '../utils/api'

export default function PropertyDetails(){
  const { id } = useParams()
  const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('user')||'null'))
  const [prop, setProp] = useState(null)
  const [slots, setSlots] = useState([])
  const [date, setDate] = useState('')
  const [slotId, setSlotId] = useState('')
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [mobile, setMobile] = useState('')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/properties/${id}`).then(r=>r.json()).then(setProp)
    apiGet(`/properties/${id}/slots`).then(setSlots).catch(()=>{})
  },[id])

  function onLogout(){ localStorage.clear(); setUser(null) }

  const grouped = slots.reduce((acc, s)=>{ const d = s.date; acc[d] = acc[d] || []; acc[d].push(s); return acc }, {})

  async function onBook(e){
    e.preventDefault()
    setMessage('')
    try {
      const data = await apiPost(`/properties/${id}/book`, { slotId, fullName, email, mobileNumber: mobile, notesFromStudent: notes })
      setMessage('Viewing booked! A confirmation has been emailed to you.')
      apiGet(`/properties/${id}/slots`).then(setSlots).catch(()=>{})
    } catch (err) {
      setMessage('That slot has just been booked. Please select another available time.')
    }
  }

  if(!prop) return <div className="min-h-screen bg-slate-50"><Navbar user={user} onLogout={onLogout} /><div className="max-w-6xl mx-auto px-4 py-8">Loading…</div></div>

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {prop.photos?.length > 0 && (
              <div className="aspect-[16/9] bg-slate-200 rounded-xl overflow-hidden">
                <img src={prop.photos[0]} alt={prop.title} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">{prop.title}</h1>
            <p className="text-slate-600">{prop.areaName}, {prop.city} • {prop.distanceToUniversityText}</p>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-slate-100 border">{prop.listingType === 'HOUSE' ? 'Whole house' : 'Room in shared house'}</span>
              {prop.billsIncluded && <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Bills included</span>}
              {prop.furnished && <span className="px-2 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">Furnished</span>}
            </div>

            <section className="mt-6">
              <h3 className="font-semibold text-slate-900">About this property</h3>
              <p className="mt-2 text-slate-700 text-sm">{prop.description}</p>
            </section>

            <section className="mt-6">
              <h3 className="font-semibold text-slate-900">What’s included</h3>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li>Bills included: {prop.billsIncluded? 'Yes':'No'}</li>
                <li>Wi‑Fi: High-speed broadband included</li>
                <li>Furnished: {prop.furnished? 'Fully furnished':'Unfurnished'}</li>
                <li>Appliances: Modern kitchen appliances</li>
                <li>Safety: Smoke alarms, carbon monoxide alarm, valid gas safety certificate</li>
              </ul>
            </section>

            {prop.listingType === 'ROOM' && (
              <section className="mt-6">
                <h3 className="font-semibold text-slate-900">About your housemates</h3>
                <p className="text-sm text-slate-700">{prop.housematesInfo || 'Housemate information will be shared after your viewing if you’re interested in taking the room.'}</p>
              </section>
            )}

            <section className="mt-6">
              <h3 className="font-semibold text-slate-900">Landlord / agent</h3>
              <p className="text-sm text-slate-700">Managed by {prop.landlord?.fullName || 'Landlord'} • Verified landlord</p>
            </section>
          </div>
          <div>
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-slate-900">Book a viewing</h3>
              {!user || user.role !== 'student' ? (
                <div className="mt-2 text-sm text-slate-700">
                  Log in or create an account to book
                  <div className="mt-3 flex gap-2">
                    <Link to="/login" className="px-3 py-2 rounded-md border">Log in</Link>
                    <Link to="/signup" className="px-3 py-2 rounded-md bg-slate-900 text-white">Sign up</Link>
                  </div>
                </div>
              ) : (
                slots.length > 0 ? (
                  <form onSubmit={onBook} className="mt-3 space-y-3">
                    <div>
                      <label className="block text-sm">Date</label>
                      <select value={date} onChange={e=>{ setDate(e.target.value); setSlotId('') }} className="mt-1 w-full px-3 py-2 rounded-lg border">
                        <option value="">Select a date</option>
                        {Object.keys(grouped).map(d=> <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    {date && (
                      <div>
                        <label className="block text-sm">Time slot</label>
                        <select value={slotId} onChange={e=>setSlotId(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border">
                          <option value="">Select time</option>
                          {grouped[date].map(s=> <option key={s.id} value={s.id}>{s.startTime}–{s.endTime}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm">Full name</label>
                      <input value={fullName} onChange={e=>setFullName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border" />
                    </div>
                    <div>
                      <label className="block text-sm">Email address</label>
                      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border" />
                    </div>
                    <div>
                      <label className="block text-sm">Mobile number</label>
                      <input value={mobile} onChange={e=>setMobile(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border" />
                    </div>
                    <div>
                      <label className="block text-sm">Anything the landlord should know? (optional)</label>
                      <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border" />
                    </div>
                    <button disabled={!slotId} className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50">Confirm viewing</button>
                    {message && <div className="text-sm text-slate-700">{message}</div>}
                  </form>
                ) : (
                  <div className="text-sm text-slate-700">No viewing times available right now. You can still send a message to the landlord and they’ll suggest times.</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
