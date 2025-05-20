
import React from 'react';
import { LayoutGrid, Calendar, Users, Music, Package, Search, Menu } from 'lucide-react';

export type IconName = 
  | 'grid' 
  | 'calendar' 
  | 'users' 
  | 'music' 
  | 'package' 
  | 'search'
  | 'menu';

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 24 }) => {
  const icons = {
    grid: LayoutGrid,
    calendar: Calendar,
    users: Users,
    music: Music,
    package: Package,
    search: Search,
    menu: Menu,
  };

  const IconComponent = icons[name];
  
  return <IconComponent className={className} size={size} />;
};
