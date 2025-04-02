import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  link: string;
  createLink?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  count,
  icon,
  link,
  createLink,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <Button variant="ghost" asChild>
            <Link to={link} className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {createLink && (
            <Button variant="outline" size="sm" asChild>
              <Link to={createLink} className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> New
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard; 