import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import { LoginPage, SignupPage } from './pages/Auth'
import { HomesPage, RoomsPage } from './pages/Search'
import PropertyDetails from './pages/PropertyDetails'
import StudentBookings from './pages/StudentBookings'
import LandlordDashboard from './pages/Landlord'
import AdminPage from './pages/Admin'

function App(){
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage role="student" />} />
      <Route path="/landlord/signup" element={<SignupPage role="landlord" />} />
      <Route path="/homes" element={<HomesPage />} />
      <Route path="/rooms" element={<RoomsPage />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/student/bookings" element={<StudentBookings />} />
      <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
