import { Link } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-slate-900 text-xl">PropertySource</Link>
        <nav className="hidden md:flex items-center gap-6 text-slate-700">
          <Link to="/">Home</Link>
          <Link to="/homes">Search homes</Link>
          <Link to="/rooms">Search rooms</Link>
          <Link to="/landlords">For landlords</Link>
        </nav>
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="px-4 py-2 rounded-md border border-slate-300">Log in</Link>
              <Link to="/signup" className="px-4 py-2 rounded-md bg-slate-900 text-white">Sign up</Link>
            </>
          )}
          {user && user.role === 'student' && (
            <>
              <Link to="/student/bookings" className="px-3 py-2 rounded-md bg-slate-900 text-white">My viewings</Link>
              <button onClick={onLogout} className="px-3 py-2 rounded-md border border-slate-300">Logout</button>
            </>
          )}
          {user && user.role === 'landlord' && (
            <>
              <Link to="/landlord/dashboard" className="px-3 py-2 rounded-md bg-slate-900 text-white">Dashboard</Link>
              <button onClick={onLogout} className="px-3 py-2 rounded-md border border-slate-300">Logout</button>
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className="px-3 py-2 rounded-md bg-slate-900 text-white">Admin</Link>
              <button onClick={onLogout} className="px-3 py-2 rounded-md border border-slate-300">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
