
import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Navigation, Star, ArrowRight, Crosshair, Plus, Minus, Info, Layers } from 'lucide-react';
import { properties } from '../data/properties';
import { Property } from '../types';
import L from 'leaflet';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProperty: (property: Property) => void;
}

/**
 * Accurate Area Names and Coordinates for Puttur, Karnataka
 * Re-aligned for maximum visual impact in the portfolio.
 */
const PUTTUR_AREAS = [
  { name: 'PUTTUR CITY', coords: [12.7628, 75.2105], type: 'city' },
  { name: 'Bolwar', coords: [12.7712, 75.2045], type: 'area' },
  { name: 'Kallare', coords: [12.7635, 75.2215], type: 'area' },
  { name: 'Darbe', coords: [12.7485, 75.2185], type: 'area' },
  { name: 'Parladka', coords: [12.7410, 75.2105], type: 'area' },
  { name: 'Salmara', coords: [12.7785, 75.2285], type: 'area' },
  { name: 'Bappalige', coords: [12.7455, 75.1955], type: 'area' },
  { name: 'Nehrunagar', coords: [12.8055, 75.1785], type: 'area' },
  { name: 'Samethadka', coords: [12.7645, 75.2365], type: 'area' },
  { name: 'Koornadka', coords: [12.7455, 75.2425], type: 'area' },
  { name: 'Balnad', coords: [12.7155, 75.1655], type: 'area' },
  { name: 'Kabaka', coords: [12.7855, 75.1955], type: 'area' },
  // Local Highlights
  { name: 'Mahalingeshwara Temple', coords: [12.7615, 75.2075], type: 'landmark' },
  { name: 'St Philomena College', coords: [12.7445, 75.2195], type: 'landmark' },
];

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, onViewProperty }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const putturCenter: [number, number] = [12.7628, 75.2105];

  const handleLocateMe = () => {
    if (!mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstanceRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 17, { animate: true });
      },
      () => alert("Location access denied or unavailable.")
    );
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: putturCenter,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        maxZoom: 20
      });

      // Layer 1: Professional Satellite Imagery
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
      
      // Layer 2: Ultra-Clean Labels for Premium Feel
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{y}/{x}{r}.png', {
        pane: 'markerPane',
        opacity: 0.9
      }).addTo(map);

      // Area Labels Implementation
      PUTTUR_AREAS.forEach(area => {
        const isCity = area.type === 'city';
        const isLandmark = area.type === 'landmark';
        
        const areaLabel = L.divIcon({
          className: 'area-label-professional',
          html: `
            <div class="flex flex-col items-center">
              <span class="${isCity ? 'text-[11px] sm:text-[14px] font-black tracking-[0.3em] text-white bg-emerald-600/90' : isLandmark ? 'text-[9px] font-bold text-amber-300 bg-black/50' : 'text-[10px] font-bold text-emerald-50 bg-slate-900/60'} 
                backdrop-blur-md px-3 py-1 rounded-full border ${isCity ? 'border-white/40' : 'border-white/5'} whitespace-nowrap shadow-2xl">
                ${area.name}
              </span>
            </div>
          `,
          iconSize: [120, 30],
          iconAnchor: [60, 15]
        });
        L.marker(area.coords as [number, number], { icon: areaLabel, interactive: false, zIndexOffset: isCity ? 2000 : 1000 }).addTo(map);
      });

      // Property Marker Component
      const propIcon = L.divIcon({
        className: 'prop-marker-pro',
        html: `
          <div class="relative flex items-center justify-center group">
            <div class="absolute w-14 h-14 bg-emerald-500/20 rounded-full animate-[ping_3s_infinite] pointer-events-none"></div>
            <div class="relative w-10 h-10 bg-emerald-600 rounded-[1.2rem] border-2 border-white shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-center text-white transform transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-1 group-hover:rotate-12 active:scale-95">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      // Load Map Pins
      properties.forEach(prop => {
        const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], { icon: propIcon })
          .addTo(map)
          .on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedProperty(prop);
            map.setView([prop.coordinates.lat, prop.coordinates.lng], 18, { animate: true });
          });
        markersRef.current.push(marker);
      });

      map.on('click', () => setSelectedProperty(null));
      mapInstanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 500);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden p-0 sm:p-5">
      {/* Immersive Backdrop */}
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}></div>
      
      {/* Map Content Vessel */}
      <div className="relative w-full h-full sm:w-[98%] sm:h-[95%] sm:rounded-[3rem] bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Floating Controller Cluster */}
        <div className="absolute top-6 left-6 right-6 z-[400] flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-3 pointer-events-auto">
             <div className="bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 transition-all hover:bg-slate-900">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/30">
                   <Navigation className="h-6 w-6" />
                </div>
                <div>
                   <h2 className="text-white font-black text-sm sm:text-xl tracking-tight">Malnad Explorer</h2>
                   <p className="text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-emerald-500/20"></span>
                      PUTTUR SECTOR
                   </p>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col gap-4 pointer-events-auto items-end">
            <button 
              onClick={onClose} 
              className="p-4 bg-slate-900/90 backdrop-blur-xl text-white rounded-full border border-white/10 hover:text-red-400 transition-all shadow-2xl active:scale-95 group"
            >
              <X className="h-6 w-6 group-hover:rotate-90 transition-transform" />
            </button>
            
            <div className="flex flex-col bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] overflow-hidden shadow-2xl">
               <button onClick={handleZoomIn} className="p-4 text-white hover:bg-emerald-600/20 transition-all border-b border-white/5 active:bg-emerald-600" title="Zoom In">
                  <Plus className="h-6 w-6" />
               </button>
               <button onClick={handleZoomOut} className="p-4 text-white hover:bg-emerald-600/20 transition-all active:bg-emerald-600" title="Zoom Out">
                  <Minus className="h-6 w-6" />
               </button>
            </div>

            <button 
              onClick={handleLocateMe} 
              className="p-5 bg-emerald-600 text-white rounded-[1.5rem] shadow-xl hover:bg-emerald-500 transition-all active:scale-90 group" 
              title="My Location"
            >
              <Crosshair className="h-6 w-6 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>

        {/* The Map */}
        <div ref={mapContainerRef} className="w-full h-full bg-slate-950 z-0 grayscale-[0.2] contrast-[1.1]"></div>

        {/* High-Fidelity Property Preview Unit */}
        {selectedProperty && (
          <div className="absolute bottom-6 sm:bottom-10 left-6 right-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] z-[400] animate-in slide-in-from-bottom-10 duration-700">
             <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-5 sm:p-7 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <div className="flex gap-6 sm:gap-8">
                   <div className="relative shrink-0">
                      <img 
                        src={selectedProperty.mainImage} 
                        className="w-28 h-28 sm:w-40 sm:h-40 rounded-[2.5rem] object-cover shadow-2xl ring-8 ring-emerald-500/5 transition-transform group-hover:scale-105" 
                        alt={selectedProperty.title}
                      />
                      <div className="absolute -top-2 -left-2 bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-xl border border-white/20">
                         {selectedProperty.category}
                      </div>
                   </div>
                   
                   <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-slate-900 dark:text-white font-black text-xl sm:text-3xl truncate tracking-tight mb-2">
                        {selectedProperty.title}
                      </h4>
                      <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold opacity-80">
                        <MapPin className="h-4 w-4 mr-2 text-emerald-500" /> {selectedProperty.location}
                      </div>
                      
                      <div className="mt-5 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] leading-none mb-2">Rent / Month</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-black text-2xl sm:text-3xl">{selectedProperty.price}</span>
                         </div>
                         <div className="flex items-center text-amber-500 font-black text-sm bg-amber-500/10 px-4 py-1.5 rounded-2xl border border-amber-500/20 shadow-inner">
                            <Star className="h-4 w-4 fill-amber-500 mr-2" /> {selectedProperty.rating}
                         </div>
                      </div>

                      <button 
                        onClick={() => { 
                          onViewProperty(selectedProperty);
                          onClose();
                        }} 
                        className="mt-6 w-full text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_15px_35px_rgba(16,185,129,0.3)] group"
                      >
                         Property List Details
                         <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                      </button>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedProperty(null)} 
                  className="absolute top-4 right-4 p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                >
                   <X className="h-6 w-6" />
                </button>
             </div>
          </div>
        )}
        
        {/* Pro Help Tip */}
        <div className="hidden sm:flex absolute bottom-8 left-8 z-[400] bg-slate-950/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/5 items-center gap-3 text-[11px] font-black text-emerald-100 uppercase tracking-widest shadow-2xl pointer-events-none">
           <Info className="h-4 w-4 text-emerald-500" />
           Verified Listings Marked in Emerald
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .prop-marker-pro {
          background: transparent !important;
          border: none !important;
        }
        .area-label-professional {
          background: transparent !important;
          border: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .leaflet-marker-pane {
          z-index: 600 !important;
        }
        .area-label-professional span {
          text-shadow: 0 4px 12px rgba(0,0,0,0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .area-label-professional:hover span {
          transform: scale(1.1);
          background-color: rgba(6, 78, 59, 0.9);
        }
        @media (max-width: 640px) {
          .area-label-professional span {
             font-size: 8px !important;
             padding: 2px 8px !important;
          }
        }
      `}} />
    </div>
  );
};
