import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import DashboardCard from '../components/home/DashboardCard';
import RecentActivity from '../components/home/RecentActivity';
import StudioScheduler from '../components/home/StudioScheduler';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Gift, Rocket, Bell, Calendar } from 'lucide-react';
import AnimatedSection from '../components/ui-custom/AnimatedSection';

// Mock data for demonstration
const mockActivities = [
  {
    id: '1',
    title: 'New Project: Website Redesign',
    type: 'project' as const,
    description: 'Started a new website redesign project for a client',
    timestamp: new Date('2024-03-31T10:00:00'),
    status: 'active' as const,
  },
  {
    id: '2',
    title: 'New Offer Received',
    type: 'offer' as const,
    description: 'Received a new collaboration offer from a brand',
    timestamp: new Date('2024-03-31T09:30:00'),
    status: 'pending' as const,
  },
  {
    id: '3',
    title: 'Item Added: Camera Equipment',
    type: 'item' as const,
    description: 'Added new camera equipment to your inventory',
    timestamp: new Date('2024-03-31T09:00:00'),
    status: 'completed' as const,
  },
];

const mockBookings = [
  {
    id: '1',
    title: 'Recording Session',
    startTime: new Date('2024-03-31T10:00:00'),
    endTime: new Date('2024-03-31T12:00:00'),
    status: 'confirmed' as const,
    client: 'John Doe',
  },
  {
    id: '2',
    title: 'Mixing Session',
    startTime: new Date('2024-03-31T14:00:00'),
    endTime: new Date('2024-03-31T16:00:00'),
    status: 'pending' as const,
    client: 'Jane Smith',
  },
  {
    id: '3',
    title: 'Voice Over Recording',
    startTime: new Date('2024-03-31T17:00:00'),
    endTime: new Date('2024-03-31T18:00:00'),
    status: 'confirmed' as const,
    client: 'Mike Johnson',
  },
];

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatedSection animation="fade-in-up">
            <DashboardCard
              title="Items"
              description="Manage your inventory and resources"
              count={12}
              icon={<Package className="h-6 w-6 text-primary" />}
              link="/items"
              createLink="/items/new"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" delay={100}>
            <DashboardCard
              title="Offers"
              description="Track collaboration opportunities"
              count={5}
              icon={<Gift className="h-6 w-6 text-primary" />}
              link="/offers"
              createLink="/offers/new"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" delay={200}>
            <DashboardCard
              title="Projects"
              description="Monitor your active projects"
              count={3}
              icon={<Rocket className="h-6 w-6 text-primary" />}
              link="/projects"
              createLink="/projects/new"
            />
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnimatedSection animation="fade-in-up" delay={300}>
            <RecentActivity activities={mockActivities} />
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" delay={400}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Quick Actions</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/notifications" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                  <Link to="/items/new">
                    <Package className="h-6 w-6 mb-2" />
                    Add New Item
                  </Link>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                  <Link to="/projects/new">
                    <Rocket className="h-6 w-6 mb-2" />
                    Create Project
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fade-in-up" delay={500}>
          <StudioScheduler bookings={mockBookings} />
        </AnimatedSection>
      </div>
    </Layout>
  );
};

export default Index;
