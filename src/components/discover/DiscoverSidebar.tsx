
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar } from 'lucide-react';
import AnimatedSection from '../ui-custom/AnimatedSection';
import SavedItemsTracker from '../marketplace/SavedItemsTracker';
import MarketplaceChat from '../marketplace/MarketplaceChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DiscoverSidebar: React.FC = () => {
  return (
    <div className="w-full md:w-4/12 space-y-6">
      <AnimatedSection animation="slide-in-left" delay={100}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Create New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start" asChild>
                <Link to="/events/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground pt-2">
                Organize your own event and connect with the community.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="slide-in-left" delay={200}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <Link key={item} to={`/events/${item}`} className="flex items-start gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium line-clamp-1">Music Festival {item}</h3>
                    <p className="text-xs text-muted-foreground">July {10 + item}, 2023</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="slide-in-left" delay={300}>
        <SavedItemsTracker />
      </AnimatedSection>

      <AnimatedSection animation="slide-in-left" delay={400}>
        <MarketplaceChat />
      </AnimatedSection>
    </div>
  );
};

export default DiscoverSidebar;
