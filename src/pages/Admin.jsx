import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { apiGet } from '../utils/api'

export default function AdminPage(){
  const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('user')||'null'))
  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(()=>{ fetchAll() }, [])

  function onLogout(){ localStorage.clear(); setUser(null) }

  async function fetchAll(){
    try{
      const s = await apiGet('/admin/summary'); setSummary(s)
      const u = await apiGet('/admin/users'); setUsers(u)
      const b = await apiGet('/admin/bookings'); setBookings(b)
    }catch(e){}
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        {!summary ? (
          <div className="mt-6">Loading…</div>
        ) : (
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl border p-4"><div className="text-sm text-slate-600">Total students</div><div className="text-2xl font-semibold">{summary.students}</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-sm text-slate-600">Total landlords</div><div className="text-2xl font-semibold">{summary.landlords}</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-sm text-slate-600">Total properties</div><div className="text-2xl font-semibold">{summary.properties}</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-sm text-slate-600">Total bookings</div><div className="text-2xl font-semibold">{summary.bookings}</div></div>
          </div>
        )}

        <section className="mt-10">
          <h3 className="font-semibold text-slate-900">Users</h3>
          <div className="mt-3 overflow-auto bg-white rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr><th className="text-left p-2">Name</th><th className="text-left p-2">Email</th><th className="text-left p-2">Role</th><th className="text-left p-2">Joined</th></tr>
              </thead>
              <tbody>
                {users.map(u=> (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.fullName}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">{u.createdAt ? new Date(u.createdAt).toLocaleDateString(): '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="font-semibold text-slate-900">Bookings</h3>
          <div className="mt-3 overflow-auto bg-white rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr><th className="text-left p-2">Property</th><th className="text-left p-2">Student</th><th className="text-left p-2">Date/time</th><th className="text-left p-2">Status</th></tr>
              </thead>
              <tbody>
                {bookings.map(b=> (
                  <tr key={b.id} className="border-t">
                    <td className="p-2">{b.propertyId}</td>
                    <td className="p-2">{b.studentId}</td>
                    <td className="p-2">{new Date(b.startDateTime).toLocaleString()}</td>
                    <td className="p-2">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
