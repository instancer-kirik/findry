import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TravelLocation, LOCATION_TYPES } from '@/types/travel-location';
import { Card, CardContent } from '@/components/ui/card';

interface TravelMapProps {
  locations: TravelLocation[];
  userLocation?: { lat: number; lng: number } | null;
  selectedLocation?: string;
  onLocationSelect?: (id: string) => void;
  mapboxToken: string;
  className?: string;
}

const TravelMap: React.FC<TravelMapProps> = ({
  locations,
  userLocation,
  selectedLocation,
  onLocationSelect,
  mapboxToken,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: userLocation ? [userLocation.lng, userLocation.lat] : [-98.5795, 39.8283],
      zoom: userLocation ? 10 : 4,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }));

    map.current.on('load', () => setMapLoaded(true));

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach(location => {
      const typeInfo = LOCATION_TYPES[location.type] || LOCATION_TYPES.other;
      
      const el = document.createElement('div');
      el.className = 'travel-marker';
      el.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          background: ${typeInfo.color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: transform 0.2s;
        ">${typeInfo.icon}</div>
      `;
      el.style.cursor = 'pointer';
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onLocationSelect?.(location.id);
        
        // Show popup
        if (popupRef.current) popupRef.current.remove();
        
        popupRef.current = new mapboxgl.Popup({ offset: 25, closeButton: true })
          .setLngLat([location.longitude, location.latitude])
          .setHTML(`
            <div style="min-width: 200px; padding: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 24px;">${typeInfo.icon}</span>
                <div>
                  <strong style="font-size: 14px;">${location.name}</strong>
                  <div style="font-size: 12px; color: #666;">${typeInfo.label}</div>
                </div>
              </div>
              ${location.address ? `<div style="font-size: 12px; color: #666; margin-bottom: 8px;">${location.address}</div>` : ''}
              ${location.rating ? `
                <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                  <span style="color: #f59e0b;">★</span>
                  <span style="font-size: 12px;">${location.rating.toFixed(1)} (${location.review_count || 0} reviews)</span>
                </div>
              ` : ''}
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                ${location.free ? '<span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Free</span>' : ''}
                ${location.amenities?.includes('water') ? '<span style="background: #dbeafe; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Water</span>' : ''}
                ${location.amenities?.includes('dump_station') ? '<span style="background: #f3e8ff; color: #7c3aed; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Dump</span>' : ''}
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have locations
    if (locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach(loc => bounds.extend([loc.longitude, loc.latitude]));
      if (userLocation) bounds.extend([userLocation.lng, userLocation.lat]);
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }
  }, [locations, mapLoaded, onLocationSelect]);

  // Center on user location when it changes
  useEffect(() => {
    if (map.current && userLocation && mapLoaded) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 10,
      });
    }
  }, [userLocation, mapLoaded]);

  if (!mapboxToken) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`} style={{ minHeight: 400 }}>
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Mapbox token required for map display. Add your token in settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className={`rounded-lg ${className}`} style={{ minHeight: 400 }} />
  );
};

export default TravelMap;
