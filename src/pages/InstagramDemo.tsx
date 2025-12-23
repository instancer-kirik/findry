import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { 
  User, 
  Image, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Link2, 
  Users, 
  Palette,
  Camera,
  Sparkles,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

// Mock data representing what we'd get from Instagram API
const mockProfile = {
  username: 'creative_artist',
  full_name: 'Alex Rivera',
  profile_picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  bio: 'Visual artist | Muralist | Community organizer\n📍 Austin, TX\n🎨 Available for commissions',
  followers_count: 2847,
  following_count: 892,
  media_count: 156,
  website: 'https://alexrivera.art'
};

const mockMedia = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=400&fit=crop',
    caption: 'New mural finished downtown! 🎨 #streetart #mural',
    likes: 234,
    comments: 18
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop',
    caption: 'Work in progress... stay tuned ✨',
    likes: 189,
    comments: 12
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    caption: 'Studio vibes today 🖌️',
    likes: 312,
    comments: 24
  }
];

const useCases = [
  {
    id: 'artist-profile',
    title: 'Artist Profile Integration',
    permission: 'instagram_basic',
    icon: User,
    description: 'Import Instagram profile to create artist portfolio on our platform',
    dataUsed: ['Profile picture', 'Bio', 'Username', 'Website link'],
    benefit: 'Artists can quickly set up their profile without manual data entry'
  },
  {
    id: 'portfolio-sync',
    title: 'Portfolio Media Import',
    permission: 'instagram_basic',
    icon: Image,
    description: 'Allow artists to showcase their Instagram work in their portfolio',
    dataUsed: ['Media images', 'Captions', 'Post dates'],
    benefit: 'Automatic portfolio creation from existing Instagram content'
  },
  {
    id: 'community-discovery',
    title: 'Community Discovery',
    permission: 'instagram_basic',
    icon: Users,
    description: 'Help users find and connect with artists based on their style',
    dataUsed: ['Public profile info', 'Content categories'],
    benefit: 'Better artist-to-collaborator matching'
  },
  {
    id: 'event-promotion',
    title: 'Event Artist Profiles',
    permission: 'instagram_basic',
    icon: Calendar,
    description: 'Display artist profiles for event lineups and galleries',
    dataUsed: ['Profile picture', 'Bio', 'Recent work samples'],
    benefit: 'Rich event pages with verified artist information'
  }
];

const InstagramDemo = () => {
  const [activeUseCase, setActiveUseCase] = useState('artist-profile');

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Instagram Integration Demo</h1>
                <p className="text-muted-foreground">How we use Instagram data in our platform</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
              For Meta App Review
            </Badge>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Use Cases Overview */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Data Usage Scenarios
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {useCases.map((useCase) => (
                <Card 
                  key={useCase.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    activeUseCase === useCase.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActiveUseCase(useCase.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <useCase.icon className="w-5 h-5 text-primary" />
                      <CardTitle className="text-sm">{useCase.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {useCase.permission}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active Use Case Detail */}
            {useCases.filter(uc => uc.id === activeUseCase).map(useCase => (
              <Card key={useCase.id} className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <useCase.icon className="w-5 h-5" />
                    {useCase.title}
                  </CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Data Accessed:</h4>
                    <ul className="space-y-1">
                      {useCase.dataUsed.map((data, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {data}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-sm">User Benefit:</h4>
                    <p className="text-sm text-muted-foreground">{useCase.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Live Demo Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Live Integration Preview
            </h2>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile Import</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio Sync</TabsTrigger>
                <TabsTrigger value="discovery">Discovery</TabsTrigger>
              </TabsList>

              {/* Profile Import Demo */}
              <TabsContent value="profile">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Instagram Source */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" />
                        Instagram Profile (Source)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={mockProfile.profile_picture} />
                          <AvatarFallback>AR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{mockProfile.full_name}</h3>
                          <p className="text-sm text-muted-foreground">@{mockProfile.username}</p>
                          <p className="text-sm mt-2 whitespace-pre-line">{mockProfile.bio}</p>
                          <div className="flex gap-4 mt-3 text-sm">
                            <span><strong>{mockProfile.media_count}</strong> posts</span>
                            <span><strong>{mockProfile.followers_count}</strong> followers</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Result */}
                  <Card className="border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" />
                        Platform Artist Profile (Result)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                          <AvatarImage src={mockProfile.profile_picture} />
                          <AvatarFallback>AR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{mockProfile.full_name}</h3>
                            <Badge variant="secondary" className="text-xs">Artist</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            Austin, TX
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="outline" className="text-xs">Visual Art</Badge>
                            <Badge variant="outline" className="text-xs">Muralist</Badge>
                            <Badge variant="outline" className="text-xs">Commissions</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Button size="sm" variant="outline" className="text-xs">
                              <Link2 className="w-3 h-3 mr-1" />
                              Website
                            </Button>
                            <Button size="sm" className="text-xs">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-4 bg-muted/30">
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Data Flow:</strong> User authorizes Instagram access → We fetch profile info → 
                      Profile is created/updated on our platform → User can edit or disconnect anytime
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Portfolio Sync Demo */}
              <TabsContent value="portfolio">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Instagram Media */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Instagram Media (Source)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {mockMedia.map((item) => (
                          <div key={item.id} className="aspect-square relative rounded-md overflow-hidden">
                            <img 
                              src={item.url} 
                              alt={item.caption}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 flex items-center gap-2 text-white text-xs">
                              <Heart className="w-3 h-3" /> {item.likes}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Portfolio */}
                  <Card className="border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-sm">Platform Portfolio (Result)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockMedia.map((item) => (
                          <div key={item.id} className="flex gap-3 p-2 rounded-lg bg-muted/50">
                            <img 
                              src={item.url} 
                              alt={item.caption}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm line-clamp-2">{item.caption}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" /> {item.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" /> {item.comments}
                                </span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-4 bg-muted/30">
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Data Flow:</strong> User selects posts to import → Media URLs and captions are fetched → 
                      Portfolio items are created → User can curate, reorder, or remove items
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Discovery Demo */}
              <TabsContent value="discovery">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Artist Discovery Results</CardTitle>
                    <CardDescription>How Instagram profiles appear in search/discovery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="aspect-video relative">
                            <img 
                              src={mockMedia[i - 1]?.url} 
                              alt="Artist work"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={mockProfile.profile_picture} />
                                <AvatarFallback>AR</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{mockProfile.full_name}</p>
                                <p className="text-xs text-muted-foreground">Visual Artist</p>
                              </div>
                            </div>
                            <div className="flex gap-1 mt-3">
                              <Badge variant="secondary" className="text-xs">Murals</Badge>
                              <Badge variant="secondary" className="text-xs">Austin</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4 bg-muted/30">
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Data Flow:</strong> Artists with connected Instagram appear in discovery → 
                      Profile info helps matching → Users can view full profile → Connect for collaborations
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* Privacy & Permissions Footer */}
          <section className="mt-12 border-t pt-8">
            <h2 className="text-lg font-semibold mb-4">Data Privacy & User Control</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Minimal Data Access</h3>
                  <p className="text-sm text-muted-foreground">
                    We only request basic profile info and media. No access to DMs, followers lists, or private data.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">User Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Users can disconnect Instagram anytime. All imported data can be deleted on request.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Sync Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    Users choose what to import. No automatic posting or modifications to their Instagram.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default InstagramDemo;
