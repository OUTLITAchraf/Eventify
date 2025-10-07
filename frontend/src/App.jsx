import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DetailProfile from './pages/Organizer/Profile/DetailProfile'
import AuthLayout from './layouts/AuthLayout'
import GuestLayout from './layouts/GuestLayout'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route path='/' element={<HomePage />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route element={<AuthLayout />}>
            <Route path='/profile' element={<DetailProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
