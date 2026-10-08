'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  ShieldAlert,
  MapPin,
  Phone,
  Crosshair,
  Building,
  Hospital,
  ExternalLink,
} from 'lucide-react';
import { useSafeHerStore } from '@/lib/store';

interface SafetyMapProps {
  selectedCategory?: string;
}

export const SafetyMap: React.FC<SafetyMapProps> = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const currentLocation = useSafeHerStore((state) => state.currentLocation);
  const safePlaces = useSafeHerStore((state) => state.safePlaces);
  const [selectedPin, setSelectedPin] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const leafletMod = await import('leaflet');
      const L = (leafletMod as any).default || leafletMod;

      if (mapInstanceRef.current) return;

      const initialLat = currentLocation ? currentLocation.lat : 28.6139;
      const initialLng = currentLocation ? currentLocation.lng : 77.2090;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
      });

      const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_45vf_1_f585522386ffa689a7e8c4a0';
      const tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`;

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);

      if (isMounted) {
        // Add Safe Place markers
        safePlaces.forEach((place) => {
          const isPolice = place.type === 'police';
          const isHospital = place.type === 'hospital';
          const symbol = isPolice ? '🚓' : isHospital ? '🏥' : '🛡️';

          const customIcon = L.divIcon({
            className: 'custom-monochrome-marker',
            html: `
              <div style="background-color: #000000; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer;">
                ${symbol}
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker([place.latitude, place.longitude], { icon: customIcon });
          marker.on('click', () => setSelectedPin(place));
          markersGroupRef.current.addLayer(marker);
        });

        // Add user marker
        const userIcon = L.divIcon({
          className: 'user-pin',
          html: `
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #000000; border: 3px solid #22C55E; box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.2);"></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker([initialLat, initialLng], { icon: userIcon })
          .bindPopup('<b>Your Live Position</b>')
          .addTo(map);

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 200);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {selectedPin && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs z-20 bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-lg space-y-2 text-xs">
          <div className="flex items-start justify-between">
            <span className="font-bold text-sm text-[#000000]">{selectedPin.name}</span>
            <button onClick={() => setSelectedPin(null)} className="font-bold text-[#6B7280]">✕</button>
          </div>
          <p className="text-[#6B7280]">{selectedPin.address}</p>
          <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between">
            <a href={`tel:${selectedPin.phone}`} className="font-semibold text-black hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{selectedPin.phone}</span>
            </a>
            <a
              href={`https://maps.google.com/?q=${selectedPin.latitude},${selectedPin.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] hover:text-black flex items-center gap-1"
            >
              <span>Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
