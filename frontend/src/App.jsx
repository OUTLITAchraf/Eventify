import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DetailProfile from './pages/Organizer/Profile/DetailProfile'
import AuthLayout from './layouts/AuthLayout'
import GuestLayout from './layouts/GuestLayout'
import ProtectedRoute from './layouts/ProtectedRoute'
import GuestRoute from './layouts/GuestRoute'
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<GuestLayout />}>
            <Route path='/' element={<HomePage />} />
          </Route>

          {/* Guest-only Routes */}
          <Route element={<GuestRoute />}>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthLayout />}>
              <Route path='/dashboard-organizer' element={<OrganizerDashboard />}/>
              <Route path='/profile' element={<DetailProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
