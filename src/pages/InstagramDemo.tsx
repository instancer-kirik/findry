import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Instagram, CheckCircle, User, Mail, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { User as SupabaseUser } from '@supabase/supabase-js';

const InstagramDemo = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setDemoStep(3);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setDemoStep(3);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleInstagramLogin = async () => {
    setLoading(true);
    setDemoStep(2);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          scopes: 'email,public_profile,instagram_basic',
          redirectTo: `${window.location.origin}/instagram-demo`
        }
      });

      if (error) {
        toast.error('Login failed: ' + error.message);
        setDemoStep(1);
      }
    } catch (err) {
      toast.error('An error occurred during login');
      setDemoStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDemoStep(1);
    toast.success('Logged out successfully');
  };

  const userMetadata = user?.user_metadata || {};
  const userName = userMetadata.full_name || userMetadata.name || 'User';
  const userEmail = user?.email || userMetadata.email;
  const userAvatar = userMetadata.avatar_url || userMetadata.picture;

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Instagram Login Demo</h1>
          <p className="text-muted-foreground text-lg">
            This demonstrates how our app uses Instagram login to personalize your experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-4 mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                demoStep >= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {demoStep > step ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  demoStep > step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center gap-8 mb-12 text-sm text-muted-foreground">
          <span className={demoStep >= 1 ? 'text-foreground font-medium' : ''}>
            1. Click Login
          </span>
          <span className={demoStep >= 2 ? 'text-foreground font-medium' : ''}>
            2. Authorize
          </span>
          <span className={demoStep >= 3 ? 'text-foreground font-medium' : ''}>
            3. View Profile
          </span>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-6 h-6" />
                Connect with Instagram
              </CardTitle>
              <CardDescription>
                Sign in to access personalized features and connect with artists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    We use your Instagram profile to:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Display your name and profile picture
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Personalize your experience
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Connect you with other creators
                    </li>
                  </ul>
                  <Button 
                    onClick={handleInstagramLogin}
                    disabled={loading}
                    className="w-full mt-4"
                    size="lg"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    {loading ? 'Connecting...' : 'Login with Instagram'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Successfully Connected!</p>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="mt-4"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout to Demo Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Preview Card */}
          <Card className={`border-2 transition-all ${user ? 'border-primary' : 'border-dashed opacity-60'}`}>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                {user ? 'Your personalized profile is ready!' : 'Login to see your profile'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback>
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{userName}</h3>
                      <Badge variant="secondary">Connected via Instagram</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{userName}</span>
                    </div>
                    {userEmail && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{userEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      With your profile, you can now:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Discover and follow artists</li>
                      <li>• Join creative communities</li>
                      <li>• Share your own work</li>
                      <li>• Collaborate on projects</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <User className="w-16 h-16 mb-4 opacity-30" />
                  <p>Your profile will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Use Case Explanation */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>How We Use Instagram Data</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Profile Display</h4>
                <p className="text-sm text-muted-foreground">
                  Your name and profile picture are displayed on your user profile 
                  so other community members can recognize and connect with you.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Personalization</h4>
                <p className="text-sm text-muted-foreground">
                  We use your basic profile info to personalize greetings and 
                  tailor content recommendations to your interests.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Community Features</h4>
                <p className="text-sm text-muted-foreground">
                  Your profile enables social features like following artists, 
                  joining communities, and collaborating on creative projects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default InstagramDemo;
