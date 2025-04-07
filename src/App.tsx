import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Pages
import Landing from './pages/Index'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import ProfileSetup from './pages/ProfileSetup'
import CreateEvent from './pages/CreateEvent'
import EventDetail from './pages/EventDetail'
import EventsInterested from './pages/EventsInterested'
import EventsUpcoming from './pages/EventsUpcoming'
import Collaboration from './pages/Collaboration'
import ProjectDetail from './pages/ProjectDetail'
import Projects from './pages/Projects'
import CreateProject from './pages/CreateProject'
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
import EventbriteCallback from './pages/EventbriteCallback'
import EventbriteOrders from './pages/EventbriteOrders'

import './App.css'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            
            {/* Specific routes first */}
            <Route path="/projects/create" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects" element={<Projects />} />
            
            <Route path="/artist-profile/:artistId" element={<ArtistProfile />} />
            <Route path="/artist/:artistSlug" element={<ArtistProfile />} />
            <Route path="/artists/:artistId" element={<ArtistProfile />} />
            <Route path="/artists" element={<Discover />} />
            
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/interested" element={<EventsInterested />} />
            <Route path="/events/calendar" element={<Discover />} />
            <Route path="/events/upcoming" element={<EventsUpcoming />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/events" element={<Discover />} />
            
            {/* Eventbrite integration routes */}
            <Route path="/eventbrite/callback" element={<EventbriteCallback />} />
            <Route path="/eventbrite/orders" element={<EventbriteOrders />} />
            
            <Route path="/resources/index" element={<ResourceIndexPage />} />
            <Route path="/resources/:resourceId" element={<ResourceDetail />} />
            <Route path="/resources" element={<Discover />} />
            
            <Route path="/venues/:venueId" element={<VenueDetail />} />
            <Route path="/venues" element={<Discover />} />
            
            <Route path="/community/:id" element={<CommunityDashboard />} />
            <Route path="/community/events" element={<CommunityEvents />} />
            <Route path="/communities" element={<Communities />} />
            
            <Route path="/chats/new" element={<Chats />} />
            <Route path="/chats" element={<Chats />} />
            
            <Route path="/brands/:brandId" element={<BrandDetail />} />
            <Route path="/brands" element={<Discover />} />
            
            <Route path="/shops/create" element={<CreateShop />} />
            <Route path="/shops/:id" element={<ShopDetail />} />
            <Route path="/shops/:shopId/products/:productId" element={<ProductDetail />} />
            <Route path="/shops" element={<Shops />} />
            
            <Route path="/integrations/tandemx" element={<TandemXShop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="/meetings/schedule" element={<MeetingScheduler />} />
            <Route path="/meetings/:meetingId" element={<MeetingScheduler />} />
            <Route path="/meetings" element={<MeetingScheduler />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
