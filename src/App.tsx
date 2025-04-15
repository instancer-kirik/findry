
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import ProfilePage from './pages/ProfilePage';
import ProfileSetup from './pages/ProfileSetup';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Discover from './pages/Discover';
import ArtistProfile from './pages/ArtistProfile';
import VenueDetail from './pages/VenueDetail';
import BrandDetail from './pages/BrandDetail';
import ResourceDetail from './pages/ResourceDetail';
import ResourceIndexPage from './pages/ResourceIndexPage';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import EditEvent from './pages/events/EditEvent'; // Fixed path
import EventsUpcoming from './pages/EventsUpcoming';
import EventsInterested from './pages/EventsInterested';
import EventbriteCallback from './pages/EventbriteCallback';
import EventbriteOrders from './pages/EventbriteOrders';
import Communities from './pages/Communities';
import CommunityDashboard from './pages/CommunityDashboard';
import CommunityEvents from './pages/CommunityEvents';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Shops from './pages/Shops';
import CreateShop from './pages/CreateShop';
import Collaboration from './pages/Collaboration';
import Chats from './pages/Chats';
import MeetingScheduler from './pages/MeetingScheduler';
import Offers from './pages/Offers';
import Items from './pages/Items';
import NotFound from './pages/NotFound';
import { ThemeProvider } from "@/components/ui/theme-provider"; // Fixed import path
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from '@/hooks/use-auth';
import { Profile } from '@/types/profile';
import { updateEmailTemplates } from '@/lib/email-templates';
import ShopDetail from './pages/ShopDetail'; // Fixed import
import ProductDetail from './pages/ProductDetail'; // Fixed import
import TandemXShop from './pages/TandemXShop'; // Fixed import
import ResourcerProfile from './pages/ResourcerProfile'; // Fixed import
import Grouper from './pages/Grouper';

function App() {
  const { session, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        // Fetch the profile data here
        console.log('Fetching profile for user:', user);
        setProfile({
          id: user.id,
          username: user.user_metadata.user_name || user.email?.split('@')[0] || 'Unknown',
          full_name: user.user_metadata.full_name || 'Full Name',
          avatar_url: user.user_metadata.avatar_url || '',
          bio: user.user_metadata.bio || '',
          created_at: '',
          updated_at: '',
          role_attributes: {},
          profile_types: []
        });
      } else {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user, session]);

  useEffect(() => {
    const initializeEmailTemplates = async () => {
      try {
        await updateEmailTemplates();
        console.log('Email templates initialized/updated successfully.');
      } catch (error) {
        console.error('Failed to initialize email templates:', error);
      }
    };

    initializeEmailTemplates();
  }, []);

  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="theme-preference">
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          
          {/* Discover Routes */}
          <Route path="/discover" element={<Discover />} />
          <Route path="/artist-profile/:artistId" element={<ArtistProfile />} />
          <Route path="/venue-detail/:venueId" element={<VenueDetail />} />
          <Route path="/brand-detail/:brandId" element={<BrandDetail />} />
          <Route path="/resource-detail/:resourceId" element={<ResourceDetail />} />
          <Route path="/shop-detail/:shopId" element={<ShopDetail />} />
          <Route path="/product-detail/:productId" element={<ProductDetail />} />
          
          {/* Resources */}
          <Route path="/resources" element={<ResourceIndexPage />} />
          <Route path="/resourcer-profile/:resourcerId" element={<ResourcerProfile />} />
          
          {/* Events */}
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/events/edit/:eventId" element={<EditEvent />} />
          <Route path="/events/upcoming" element={<EventsUpcoming />} />
          <Route path="/events/interested" element={<EventsInterested />} />
          <Route path="/eventbrite/callback" element={<EventbriteCallback />} />
          <Route path="/eventbrite/orders" element={<EventbriteOrders />} />
          
          {/* Communities */}
          <Route path="/communities" element={<Communities />} />
          <Route path="/community/:id" element={<CommunityDashboard />} />
          <Route path="/community/events" element={<CommunityEvents />} />
          
          {/* Projects */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          
          {/* Shops */}
          <Route path="/shops" element={<Shops />} />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/tandemx" element={<TandemXShop />} />
          
          {/* Collaboration */}
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/meetings" element={<MeetingScheduler />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/items" element={<Items />} />
          
          {/* New Grouper System */}
          <Route path="/grouper" element={<Grouper />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
