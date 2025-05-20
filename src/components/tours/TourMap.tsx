
import React, { useEffect, useRef } from 'react';
import { TourStop } from '@/types/content';

interface TourMapProps {
  stops: TourStop[];
}

// This is just a placeholder map component that would ideally use a real mapping API
// You would replace this with a proper integration like Google Maps, Mapbox, etc.
const TourMap: React.FC<TourMapProps> = ({ stops }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This would be where you initialize the map with actual stops
    if (mapRef.current) {
      // For now, we just display a placeholder
      const canvas = document.createElement('canvas');
      canvas.width = mapRef.current.clientWidth;
      canvas.height = mapRef.current.clientHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw a simple representation of the map
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw route line if we have stops
        if (stops.length > 1) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          
          // Simulate a route between stops
          const margin = 50;
          const width = canvas.width - margin * 2;
          const height = canvas.height - margin * 2;
          
          stops.forEach((stop, index) => {
            const x = margin + (width / (stops.length - 1)) * index;
            const y = margin + Math.sin((index / stops.length) * Math.PI) * height / 2 + height / 4;
            
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          
          ctx.stroke();
          
          // Draw stop points
          stops.forEach((stop, index) => {
            const x = margin + (width / (stops.length - 1)) * index;
            const y = margin + Math.sin((index / stops.length) * Math.PI) * height / 2 + height / 4;
            
            ctx.fillStyle = stop.is_stop_point ? '#9ca3af' : '#3b82f6';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(stop.order.toString(), x, y + 3);
            
            // Place name labels
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            
            // Alternate labels above/below to avoid overlap
            const labelY = index % 2 === 0 ? y - 15 : y + 25;
            ctx.fillText(stop.name, x, labelY);
          });
        } else if (stops.length === 1) {
          // Single stop
          const x = canvas.width / 2;
          const y = canvas.height / 2;
          
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(stops[0].name, x, y - 15);
        } else {
          // No stops
          ctx.fillStyle = '#000';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Add stops to see the route on the map', canvas.width / 2, canvas.height / 2);
        }
      }
      
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(canvas);
    }
  }, [stops]);
  
  return (
    <div ref={mapRef} className="w-full h-full bg-muted flex items-center justify-center">
      {stops.length === 0 && <p className="text-muted-foreground">Add stops to see the route on the map</p>}
    </div>
  );
};

export default TourMap;
