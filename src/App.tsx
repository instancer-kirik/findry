
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

// Pages
import Index from './pages/Index'
import Discover from './pages/Discover'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import ProfileSetup from './pages/ProfileSetup'
import CreateEvent from './pages/CreateEvent'
import EventDetail from './pages/EventDetail'
import Collaboration from './pages/Collaboration'
import ProjectDetail from './pages/ProjectDetail'
import MeetingScheduler from './pages/MeetingScheduler'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/artists" element={<Discover />} />
        <Route path="/resources" element={<Discover />} />
        <Route path="/projects" element={<Discover />} />
        <Route path="/events" element={<Discover />} />
        <Route path="/venues" element={<Discover />} />
        <Route path="/communities" element={<Discover />} />
        <Route path="/brands" element={<Discover />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/collaboration" element={<Collaboration />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/meetings" element={<MeetingScheduler />} />
        <Route path="/meetings/schedule" element={<MeetingScheduler />} />
        <Route path="/meetings/:meetingId" element={<MeetingScheduler />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
