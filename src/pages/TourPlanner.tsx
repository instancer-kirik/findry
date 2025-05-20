
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Map, Route, Car } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import TourMap from '@/components/tours/TourMap';
import TourStopsList from '@/components/tours/TourStopsList';
import CreateTourForm from '@/components/tours/CreateTourForm';
import CreateStopForm from '@/components/tours/CreateStopForm';
import { TourPlan, TourStop } from '@/types/content';
import { toast } from 'sonner';

const TourPlanner: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'band_tour' | 'roadtrip'>('band_tour');
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [tourPlans, setTourPlans] = useState<TourPlan[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourPlan | null>(null);
  
  const handleCreateTour = (tour: Omit<TourPlan, 'id' | 'created_at' | 'updated_at'>) => {
    // In a real app, this would call an API to save the tour
    const newTour: TourPlan = {
      ...tour,
      id: `tour-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stops: []
    };
    
    setTourPlans([...tourPlans, newTour]);
    setSelectedTour(newTour);
    setIsCreatingTour(false);
    toast.success('Tour created successfully');
  };
  
  const handleAddStop = (stop: Omit<TourStop, 'id' | 'tour_id'>) => {
    if (!selectedTour) return;
    
    // In a real app, this would call an API to save the stop
    const newStop: TourStop = {
      ...stop,
      id: `stop-${Date.now()}`,
      tour_id: selectedTour.id,
    };
    
    const updatedTour = {
      ...selectedTour,
      stops: [...selectedTour.stops, newStop].sort((a, b) => a.order - b.order),
      updated_at: new Date().toISOString()
    };
    
    setSelectedTour(updatedTour);
    setTourPlans(tourPlans.map(tour => 
      tour.id === updatedTour.id ? updatedTour : tour
    ));
    
    setIsAddingStop(false);
    toast.success('Stop added successfully');
  };
  
  const handleDeleteStop = (stopId: string) => {
    if (!selectedTour) return;
    
    const updatedStops = selectedTour.stops.filter(stop => stop.id !== stopId);
    const reorderedStops = updatedStops.map((stop, index) => ({
      ...stop,
      order: index + 1
    }));
    
    const updatedTour = {
      ...selectedTour,
      stops: reorderedStops,
      updated_at: new Date().toISOString()
    };
    
    setSelectedTour(updatedTour);
    setTourPlans(tourPlans.map(tour => 
      tour.id === updatedTour.id ? updatedTour : tour
    ));
    
    toast.success('Stop removed successfully');
  };
  
  const handleReorderStop = (stopId: string, newOrder: number) => {
    if (!selectedTour || newOrder < 1 || newOrder > selectedTour.stops.length) return;
    
    const stopToMove = selectedTour.stops.find(stop => stop.id === stopId);
    if (!stopToMove) return;
    
    const currentOrder = stopToMove.order;
    
    const updatedStops = selectedTour.stops.map(stop => {
      if (stop.id === stopId) {
        return { ...stop, order: newOrder };
      } else if (currentOrder < newOrder && stop.order > currentOrder && stop.order <= newOrder) {
        return { ...stop, order: stop.order - 1 };
      } else if (currentOrder > newOrder && stop.order < currentOrder && stop.order >= newOrder) {
        return { ...stop, order: stop.order + 1 };
      }
      return stop;
    }).sort((a, b) => a.order - b.order);
    
    const updatedTour = {
      ...selectedTour,
      stops: updatedStops,
      updated_at: new Date().toISOString()
    };
    
    setSelectedTour(updatedTour);
    setTourPlans(tourPlans.map(tour => 
      tour.id === updatedTour.id ? updatedTour : tour
    ));
  };
  
  const handleSelectTour = (tourId: string) => {
    const tour = tourPlans.find(t => t.id === tourId);
    if (tour) {
      setSelectedTour(tour);
    }
  };
  
  const handleDeleteTour = (tourId: string) => {
    setTourPlans(tourPlans.filter(tour => tour.id !== tourId));
    if (selectedTour && selectedTour.id === tourId) {
      setSelectedTour(null);
    }
    toast.success('Tour deleted successfully');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Tour Planner</h1>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate('/gear-packing')}
              >
                Gear Packing Lists
              </Button>
              
              {!isCreatingTour && (
                <Button onClick={() => setIsCreatingTour(true)}>
                  Create New {activeTab === 'band_tour' ? 'Band Tour' : 'Road Trip'}
                </Button>
              )}
            </div>
          </div>
          
          <Tabs
            defaultValue="band_tour"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'band_tour' | 'roadtrip')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-[400px] mb-8">
              <TabsTrigger value="band_tour" className="flex items-center gap-2">
                <Route className="h-4 w-4" />
                Band Tours
              </TabsTrigger>
              <TabsTrigger value="roadtrip" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Road Trips
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="band_tour" className="space-y-4">
              {isCreatingTour ? (
                <div className="bg-card border rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-bold mb-4">Create Band Tour</h2>
                  <CreateTourForm 
                    type="band_tour"
                    onSubmit={handleCreateTour}
                    onCancel={() => setIsCreatingTour(false)}
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 bg-card border rounded-lg shadow-sm p-4 space-y-4">
                      <h2 className="text-xl font-semibold">Your Band Tours</h2>
                      {tourPlans.filter(tour => tour.type === 'band_tour').length > 0 ? (
                        <div className="space-y-2">
                          {tourPlans
                            .filter(tour => tour.type === 'band_tour')
                            .map(tour => (
                              <div 
                                key={tour.id} 
                                className={`p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors ${selectedTour?.id === tour.id ? 'bg-accent' : ''}`}
                                onClick={() => handleSelectTour(tour.id)}
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">{tour.name}</h3>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTour(tour.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(tour.start_date), 'MMM d, yyyy')} - {format(new Date(tour.end_date), 'MMM d, yyyy')}
                                </p>
                                <p className="text-sm text-muted-foreground">{tour.stops.length} stops</p>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground mb-4">No band tours yet</p>
                          <Button onClick={() => setIsCreatingTour(true)}>Create Your First Tour</Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      {selectedTour ? (
                        <div className="bg-card border rounded-lg shadow-sm p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{selectedTour.name}</h2>
                            {!isAddingStop && (
                              <Button onClick={() => setIsAddingStop(true)}>Add Stop</Button>
                            )}
                          </div>
                          
                          {isAddingStop ? (
                            <div className="border rounded-lg p-4 bg-background">
                              <h3 className="text-lg font-medium mb-4">Add Tour Stop</h3>
                              <CreateStopForm
                                tourType={selectedTour.type}
                                onSubmit={handleAddStop}
                                onCancel={() => setIsAddingStop(false)}
                                defaultOrder={selectedTour.stops.length + 1}
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="order-2 lg:order-1">
                                <TourStopsList 
                                  stops={selectedTour.stops} 
                                  onDelete={handleDeleteStop}
                                  onReorder={handleReorderStop}
                                />
                              </div>
                              <div className="order-1 lg:order-2 h-[400px] border rounded-lg overflow-hidden">
                                <TourMap stops={selectedTour.stops} />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-card border rounded-lg shadow-sm p-4 h-full flex flex-col items-center justify-center">
                          <Map className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">Select or Create a Tour</h3>
                          <p className="text-center text-muted-foreground mb-6">
                            Select a tour from the list or create a new one to start planning your band's journey.
                          </p>
                          <Button onClick={() => setIsCreatingTour(true)}>Create New Band Tour</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="roadtrip" className="space-y-4">
              {isCreatingTour ? (
                <div className="bg-card border rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-bold mb-4">Create Road Trip</h2>
                  <CreateTourForm 
                    type="roadtrip"
                    onSubmit={handleCreateTour}
                    onCancel={() => setIsCreatingTour(false)}
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 bg-card border rounded-lg shadow-sm p-4 space-y-4">
                      <h2 className="text-xl font-semibold">Your Road Trips</h2>
                      {tourPlans.filter(tour => tour.type === 'roadtrip').length > 0 ? (
                        <div className="space-y-2">
                          {tourPlans
                            .filter(tour => tour.type === 'roadtrip')
                            .map(tour => (
                              <div 
                                key={tour.id} 
                                className={`p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors ${selectedTour?.id === tour.id ? 'bg-accent' : ''}`}
                                onClick={() => handleSelectTour(tour.id)}
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">{tour.name}</h3>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTour(tour.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(tour.start_date), 'MMM d, yyyy')} - {format(new Date(tour.end_date), 'MMM d, yyyy')}
                                </p>
                                <p className="text-sm text-muted-foreground">{tour.stops.length} stops</p>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground mb-4">No road trips yet</p>
                          <Button onClick={() => setIsCreatingTour(true)}>Create Your First Road Trip</Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      {selectedTour ? (
                        <div className="bg-card border rounded-lg shadow-sm p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{selectedTour.name}</h2>
                            {!isAddingStop && (
                              <Button onClick={() => setIsAddingStop(true)}>Add Stop</Button>
                            )}
                          </div>
                          
                          {isAddingStop ? (
                            <div className="border rounded-lg p-4 bg-background">
                              <h3 className="text-lg font-medium mb-4">Add Road Trip Stop</h3>
                              <CreateStopForm
                                tourType={selectedTour.type}
                                onSubmit={handleAddStop}
                                onCancel={() => setIsAddingStop(false)}
                                defaultOrder={selectedTour.stops.length + 1}
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="order-2 lg:order-1">
                                <TourStopsList 
                                  stops={selectedTour.stops} 
                                  onDelete={handleDeleteStop}
                                  onReorder={handleReorderStop}
                                />
                              </div>
                              <div className="order-1 lg:order-2 h-[400px] border rounded-lg overflow-hidden">
                                <TourMap stops={selectedTour.stops} />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-card border rounded-lg shadow-sm p-4 h-full flex flex-col items-center justify-center">
                          <Car className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">Select or Create a Road Trip</h3>
                          <p className="text-center text-muted-foreground mb-6">
                            Select a road trip from the list or create a new one to start planning your adventure.
                          </p>
                          <Button onClick={() => setIsCreatingTour(true)}>Create New Road Trip</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default TourPlanner;
