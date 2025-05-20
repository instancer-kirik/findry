
import React from 'react';
import { LayoutGrid, Calendar, Users, Music, Package, Search, Menu, Route } from 'lucide-react';

export type IconName = 
  | 'grid' 
  | 'calendar' 
  | 'users' 
  | 'music' 
  | 'package' 
  | 'search'
  | 'menu'
  | 'discover'
  | 'submit'
  | 'request'
  | 'dashboard'
  | 'logo';

export const Icon: React.FC<{
  name: IconName;
  className?: string;
  size?: number;
}> = ({ name, className, size = 24 }) => {
  const icons = {
    grid: LayoutGrid,
    calendar: Calendar,
    users: Users,
    music: Music,
    package: Package,
    search: Search,
    menu: Menu,
    discover: Search,
    submit: Package,
    request: Calendar,
    dashboard: LayoutGrid,
    logo: Package,
  };

  const IconComponent = icons[name];
  
  return <IconComponent className={className} size={size} />;
};

// Export Icons object with icon components to maintain backward compatibility
export const Icons = {
  logo: (props: any) => <Icon name="logo" {...props} />,
  discover: (props: any) => <Icon name="discover" {...props} />,
  submit: (props: any) => <Icon name="submit" {...props} />,
  request: (props: any) => <Icon name="request" {...props} />,
  dashboard: (props: any) => <Icon name="dashboard" {...props} />,
};
