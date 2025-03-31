
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/hooks/use-theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
import Communities from './pages/Communities'
import Chats from './pages/Chats'
import ProfilePage from './pages/ProfilePage'

import './App.css'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="tandemx-theme">
        <Router>
          <div className="min-h-screen w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/artists" element={<Discover />} />
              <Route path="/resources" element={<Discover />} />
              <Route path="/projects" element={<Discover />} />
              <Route path="/events" element={<Discover />} />
              <Route path="/venues" element={<Discover />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/communities/:communityId" element={<Communities />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chats/new" element={<Chats />} />
              <Route path="/brands" element={<Discover />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/events/interested" element={<Discover />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/meetings" element={<MeetingScheduler />} />
              <Route path="/meetings/schedule" element={<MeetingScheduler />} />
              <Route path="/meetings/:meetingId" element={<MeetingScheduler />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
