import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, Link, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetup from "./pages/ProfileSetup";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Discover from "./pages/Discover";
import ArtistProfile from "./pages/ArtistProfile";
import VenueDetail from "./pages/VenueDetail";
import BrandDetail from "./pages/BrandDetail";
import ResourceDetail from "./pages/ResourceDetail";
import ResourceIndexPage from "./pages/ResourceIndexPage";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/events/EventDetail";
import EditEvent from "./pages/events/EditEvent";
import EventsUpcoming from "./pages/EventsUpcoming";
import EventsInterested from "./pages/EventsInterested";
import EventbriteCallback from "./pages/EventbriteCallback";
import EventbriteOrders from "./pages/EventbriteOrders";
import Communities from "./pages/Communities";
import CommunityDashboard from "./pages/CommunityDashboard";
import CommunityEvents from "./pages/CommunityEvents";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectsShowcase from "./pages/ProjectsShowcase";
import Shops from "./pages/Shops";
import CreateShop from "./pages/CreateShop";
import Collaboration from "./pages/Collaboration";
import Chats from "./pages/Chats";
import MeetingScheduler from "./pages/MeetingScheduler";
import Offers from "./pages/Offers";
import Items from "./pages/Items";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { Profile } from "@/types/profile";

import ShopDetail from "./pages/ShopDetail";
import ProductDetail from "./pages/ProductDetail";
import TandemXShop from "./pages/TandemXShop";
import ResourcerProfile from "./pages/ResourcerProfile";
import Grouper from "./pages/Grouper";
import GlossaryPage from "./pages/GlossaryPage";
import CreateGlossaryEntry from "./pages/CreateGlossaryEntry";
import GlossaryEntryDetail from "./pages/GlossaryEntryDetail";
import GlossaryExample from "./pages/GlossaryExample";
import TourPlanner from "./pages/TourPlanner";
import GearPacking from "./pages/GearPacking";
import VehicleBuildShowcase from "./pages/VehicleBuildShowcase";
import Roadmap from "./pages/Roadmap";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { session, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        console.log("Fetching profile for user:", user);
        setProfile({
          id: user.id,
          username:
            user.user_metadata.user_name ||
            user.email?.split("@")[0] ||
            "Unknown",
          full_name: user.user_metadata.full_name || "Full Name",
          avatar_url: user.user_metadata.avatar_url || "",
          bio: user.user_metadata.bio || "",
          created_at: "",
          updated_at: "",
          role_attributes: {},
          profile_types: [],
        });
      } else {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user, session]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/items" element={<Items />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/discover/projects" element={<ProjectsShowcase />} />
          <Route path="/grouper" element={<Grouper />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/edit/:eventId" element={<EditEvent />} />
          <Route path="/events/interested" element={<EventsInterested />} />
          <Route path="/events/upcoming" element={<EventsUpcoming />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityDashboard />} />
          <Route path="/community-events" element={<CommunityEvents />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/tandemx-shop" element={<TandemXShop />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/shops/:shopId" element={<ShopDetail />} />
          <Route
            path="/shops/:shopId/products/:productId"
            element={<ProductDetail />}
          />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/shops/create" element={<CreateShop />} />
          <Route path="/eventbrite/callback" element={<EventbriteCallback />} />
          <Route path="/eventbrite/orders" element={<EventbriteOrders />} />
          <Route path="/brands/:brandId" element={<BrandDetail />} />
          <Route path="/venues/:venueId" element={<VenueDetail />} />
          <Route path="/resources" element={<ResourceIndexPage />} />
          <Route path="/resources/:resourceId" element={<ResourceDetail />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/artist/:artistId" element={<ArtistProfile />} />
          <Route
            path="/resourcer/:resourcerId"
            element={<ResourcerProfile />}
          />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/glossary/create" element={<CreateGlossaryEntry />} />
          <Route path="/glossary/:entryId" element={<GlossaryEntryDetail />} />
          <Route path="/glossary-examples" element={<GlossaryExample />} />
          <Route path="/tour-planner" element={<TourPlanner />} />
          <Route path="/gear-packing" element={<GearPacking />} />
          <Route path="/submit" element={<ResourceIndexPage />} />
          <Route path="/requests" element={<Offers />} />
          <Route path="/vehicle-build" element={<VehicleBuildShowcase />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
