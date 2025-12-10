import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, MessageSquare, Star } from 'lucide-react';

const FeedbackQuestionnaire: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const questionnaireUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeWMSV6QsMwvJvQgpKLj5EkuYeClYB7DeBCHHsgazL8_rSgrg/viewform?usp=sharing&ouid=112807716448201375463";

  const handleOpenQuestionnaire = () => {
    window.open(questionnaireUrl, '_blank');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Help Shape Findry's Future
          </h3>
          <p className="text-muted-foreground text-lg">
            Your feedback is invaluable in making Findry the best platform for creators, artists, and communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">What we'd love to know:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>How you discover and connect with creative communities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>What features would make collaboration easier</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Your experience with event planning and resource sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ideas for making creative projects more accessible</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleOpenQuestionnaire}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Take Questionnaire
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={toggleExpanded}
                size="lg"
              >
                {isExpanded ? 'Hide Preview' : 'Preview Questions'}
              </Button>
            </div>
          </div>

          <div className="relative">
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Survey</CardTitle>
                <CardDescription>
                  Takes about 3-5 minutes to complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-0 transition-all duration-300"></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    Click "Take Questionnaire" to start
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expanded Preview Section */}
        {isExpanded && (
          <div className="mt-8 pt-6 border-t border-muted">
            <h4 className="font-semibold mb-4">Sample Questions:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-background/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-2">About You:</p>
                  <p className="text-sm text-muted-foreground">
                    What type of creative work or community involvement interests you most?
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-2">Platform Features:</p>
                  <p className="text-sm text-muted-foreground">
                    Which collaboration tools would be most valuable for your projects?
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-2">Community Building:</p>
                  <p className="text-sm text-muted-foreground">
                    How do you currently find and connect with like-minded creators?
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-2">Future Vision:</p>
                  <p className="text-sm text-muted-foreground">
                    What features would make creative collaboration more accessible?
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-4">
              <Button
                onClick={handleOpenQuestionnaire}
                variant="outline"
              >
                Start Full Questionnaire
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Thank You Note */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Thank you</strong> for helping us build something amazing together!
            Every response helps us create better tools for creative communities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackQuestionnaire;
