import { useState } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard'
import DetailProfile from './pages/Organizer/Profile/DetailProfile'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/profile' element={<DetailProfile/>}/>
          <Route path='/dashboard-organizer' element={<OrganizerDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
