import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Warehouse, Lock, Users, Globe, UserPlus, Wrench, Zap, Wind, Flame, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGarages } from '@/hooks/use-garages';
import { Garage, PrivacyLevel } from '@/types/garage';
import Layout from '@/components/layout/Layout';

const privacyIcons: Record<PrivacyLevel, typeof Lock> = {
  private: Lock,
  friends_only: Users,
  invite_only: UserPlus,
  public: Globe,
};

const privacyLabels: Record<PrivacyLevel, string> = {
  private: 'Private',
  friends_only: 'Friends Only',
  invite_only: 'Invite Only',
  public: 'Public',
};

function GarageCard({ garage }: { garage: Garage }) {
  const PrivacyIcon = privacyIcons[garage.privacy_level];
  
  return (
    <Link to={`/garages/${garage.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{garage.name}</CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <PrivacyIcon className="h-3 w-3" />
              {privacyLabels[garage.privacy_level]}
            </Badge>
          </div>
          {garage.location && (
            <CardDescription>{garage.location}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {garage.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {garage.description}
            </p>
          )}
          
          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {garage.has_lift && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Wrench className="h-3 w-3" />
                Lift {garage.lift_capacity_lbs && `(${garage.lift_capacity_lbs} lbs)`}
              </Badge>
            )}
            {garage.has_storage && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Box className="h-3 w-3" />
                Storage {garage.storage_sqft && `(${garage.storage_sqft} sqft)`}
              </Badge>
            )}
            {garage.has_electricity && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Electric
              </Badge>
            )}
            {garage.has_air_compressor && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Wind className="h-3 w-3" />
                Air
              </Badge>
            )}
            {garage.has_welding && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                Welding
              </Badge>
            )}
            {garage.bay_count > 1 && (
              <Badge variant="secondary">
                {garage.bay_count} Bays
              </Badge>
            )}
          </div>
          
          {/* Rental info */}
          {garage.is_available_for_rent && (
            <div className="mt-4 pt-3 border-t">
              <p className="text-sm font-medium text-primary">Available for Rent</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                {garage.hourly_rate && <span>${garage.hourly_rate}/hr</span>}
                {garage.daily_rate && <span>${garage.daily_rate}/day</span>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Garages() {
  const { useGetGarages, useGetMyGarages } = useGarages();
  const { data: garages, isLoading } = useGetGarages();
  const { data: myGarages } = useGetMyGarages();

  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Garages</h1>
            <p className="text-muted-foreground mt-1">
              Find workspaces with lifts, storage, and tools for vehicle projects
            </p>
          </div>
          <Link to="/garages/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Garage
            </Button>
          </Link>
        </div>

        {/* My Garages Section */}
        {myGarages && myGarages.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">My Garages</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myGarages.map((garage) => (
                <GarageCard key={garage.id} garage={garage} />
              ))}
            </div>
          </div>
        )}

        {/* All Garages Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Browse Garages</h2>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : garages && garages.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {garages.map((garage) => (
                <GarageCard key={garage.id} garage={garage} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Warehouse className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No garages yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to add a garage workspace
              </p>
              <Link to="/garages/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your Garage
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
