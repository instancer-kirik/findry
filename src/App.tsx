import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
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
import Projects from './pages/Projects'
import MeetingScheduler from './pages/MeetingScheduler'
import Communities from './pages/Communities'
import Chats from './pages/Chats'
import ProfilePage from './pages/ProfilePage'
import CommunityDashboard from '@/pages/CommunityDashboard'
import CommunityEvents from '@/pages/CommunityEvents'
import ArtistProfile from './pages/ArtistProfile'
import ResourceIndexPage from './pages/ResourceIndexPage'
import ShopDetail from './pages/ShopDetail'
import Shops from './pages/Shops'
import CreateShop from './pages/CreateShop'
import ProductDetail from './pages/ProductDetail'
import TandemXShop from './pages/TandemXShop'
import VenueDetail from './pages/VenueDetail'
import ResourceDetail from './pages/ResourceDetail'
import BrandDetail from './pages/BrandDetail'

import './App.css'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/artists" element={<Discover />} />
            <Route path="/artists/:artistId" element={<ArtistProfile />} />
            <Route path="/resources" element={<Discover />} />
            <Route path="/resources/index" element={<ResourceIndexPage />} />
            <Route path="/resources/:resourceId" element={<ResourceDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events" element={<Discover />} />
            <Route path="/venues" element={<Discover />} />
            <Route path="/venues/:venueId" element={<VenueDetail />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/community/:id" element={<CommunityDashboard />} />
            <Route path="/community/events" element={<CommunityEvents />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chats/new" element={<Chats />} />
            <Route path="/brands" element={<Discover />} />
            <Route path="/brands/:brandId" element={<BrandDetail />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/shops/create" element={<CreateShop />} />
            <Route path="/shops/:id" element={<ShopDetail />} />
            <Route path="/shops/:shopId/products/:productId" element={<ProductDetail />} />
            <Route path="/integrations/tandemx" element={<TandemXShop />} />
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
    </QueryClientProvider>
  )
}

export default App
