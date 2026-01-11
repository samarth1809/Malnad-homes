
import React, { useMemo } from 'react';
import { X, MapPin, Star, Users, Bed, Bath, Square, ArrowRight, MessageSquare, ThumbsUp } from 'lucide-react';
import { Property, Review } from '../types';
import { Button } from './Button';
import { mockReviews } from '../data/properties';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onReserve?: (property: Property) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, isOpen, onClose, onReserve }) => {
  const { t } = useLanguage();
  if (!isOpen || !property) return null;

  const handleBookClick = () => {
    onClose();
    if (onReserve) {
      onReserve(property);
    }
  };

  const propertyReviews = useMemo(() => {
    return mockReviews.filter(r => r.propertyId === property.id);
  }, [property.id]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-serif font-bold truncate pr-4">{property.title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
           {/* Modal content similar to Page version */}
           <div className="p-6">
             <img src={property.mainImage} className="w-full h-64 object-cover rounded-xl mb-6" />
             <h3 className="text-2xl font-bold mb-4">{property.title}</h3>
             <p className="text-slate-500 mb-8">{property.description}</p>
             <Button onClick={handleBookClick} className="w-full">{t('property.reserveBtn')}</Button>
           </div>
        </div>
      </div>
    </div>
  );
};
