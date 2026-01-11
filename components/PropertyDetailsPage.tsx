
import React, { useMemo } from 'react';
import { ArrowLeft, MapPin, Star, Users, Bed, Bath, Square, ArrowRight, MessageSquare, ThumbsUp, Lock, ChevronRight } from 'lucide-react';
import { Property, Review } from '../types';
import { Button } from './Button';
import { mockReviews } from '../data/properties';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface PropertyDetailsPageProps {
  property: Property | null;
  onBack: () => void;
  onReserve: (property: Property) => void;
}

export const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ property, onBack, onReserve }) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  if (!property) return null;

  const propertyReviews = useMemo(() => {
    return mockReviews.filter(r => r.propertyId === property.id);
  }, [property.id]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 md:pt-24 pb-12 animate-in fade-in slide-in-from-bottom-4 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white truncate flex-1">{property.title}</h1>
        </div>

        {/* Improved Responsive Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:gap-4 h-auto md:h-[600px] mb-8 md:mb-12">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 relative aspect-[16/10] md:aspect-auto rounded-2xl md:rounded-3xl overflow-hidden group h-full shadow-lg">
            <img src={property.mainImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute top-4 left-4 md:hidden bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 border border-slate-700">
               <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" /> {property.rating}
            </div>
          </div>
          {/* Gallery Side Images (Visible on Desktop, simplified on Mobile) */}
          <div className="hidden md:grid md:col-span-2 md:grid-cols-2 md:grid-rows-2 gap-4 h-full">
            {property.galleryImages.slice(0, 3).map((img, idx) => (
               <div key={idx} className={`relative rounded-3xl overflow-hidden group h-full shadow-md ${idx === 2 ? 'md:col-span-2' : ''}`}>
                 <img src={img} alt={`Interior ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               </div>
            ))}
          </div>
          {/* Mobile view showing small hint of more images */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {property.galleryImages.map((img, idx) => (
                <div key={idx} className="relative w-32 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                   <img src={img} className="w-full h-full object-cover" />
                </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                  {t('property.premiumBadge')}
                </span>
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 md:h-5 md:w-5 fill-current mr-1" />
                  <span className="font-bold text-slate-900 dark:text-white text-base md:text-lg">{property.rating}</span>
                  <span className="text-slate-500 text-xs md:text-sm ml-2">({propertyReviews.length || '12'} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-base md:text-lg mb-4">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-emerald-500 shrink-0" />
                <span className="truncate">{property.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-6 md:py-10 border-y border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0"><Users className="h-5 w-5 md:h-6 md:w-6" /></div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-tight">Guests</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm md:text-base">{property.specs.guests}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0"><Bed className="h-5 w-5 md:h-6 md:w-6" /></div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-tight">Bedrooms</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm md:text-base">{property.specs.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0"><Bath className="h-5 w-5 md:h-6 md:w-6" /></div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-tight">Baths</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm md:text-base">{property.specs.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0"><Square className="h-5 w-5 md:h-6 md:w-6" /></div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-tight">Area</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm md:text-base">{property.specs.size}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 md:mb-6">{t('property.aboutTitle')}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-lg leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4 md:mb-8">{t('property.amenitiesTitle')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <span className="text-[11px] md:text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 md:pt-12 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6 md:mb-10">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-emerald-500 shrink-0" /> {t('property.reviewsTitle')}
                </h3>
                <button className="text-xs md:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">{t('property.writeReview')}</button>
              </div>

              {propertyReviews.length > 0 ? (
                <div className="space-y-6 md:space-y-10">
                  {propertyReviews.map((review) => (
                    <div key={review.id} className="animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                        <img 
                          src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`} 
                          alt={review.userName} 
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate">{review.userName}</h4>
                          <p className="text-[10px] md:text-xs text-slate-500">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-2.5 w-2.5 md:h-3.5 md:w-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs md:text-base leading-relaxed md:pl-16">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 md:p-12 text-center border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">{t('property.noReviews')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8 sticky top-24 md:top-28 shadow-xl shadow-slate-950/5">
              <div className="flex items-end justify-between mb-6 md:mb-8">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest mb-1">{t('property.priceLabel')}</p>
                  <div className="flex items-baseline gap-1 md:gap-2">
                     <span className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">{property.price}</span>
                     <span className="text-slate-500 text-xs font-normal">/ month</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                 <div className="flex justify-between text-xs md:text-sm text-slate-500">
                   <span>{t('property.serviceFee')}</span>
                   <span>₹2,500</span>
                 </div>
                 <div className="flex justify-between text-xs md:text-sm text-slate-500">
                   <span>{t('property.cleaningFee')}</span>
                   <span>₹1,200</span>
                 </div>
                 <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 md:my-4"></div>
                 <div className="flex justify-between text-slate-900 dark:text-white font-bold text-base md:text-lg">
                   <span>{t('property.totalLabel')}</span>
                   <span className="text-emerald-600 dark:text-emerald-400">Quote</span>
                 </div>
              </div>

              <Button onClick={() => onReserve(property)} size="lg" className="w-full group shadow-emerald-900/20 py-4 md:py-5 text-sm md:text-base">
                {!isAuthenticated && <Lock className="mr-2 h-4 w-4" />}
                {t('property.reserveBtn')}
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-center text-[10px] md:text-xs text-slate-400 mt-4 md:mt-6 italic px-2">
                {isAuthenticated 
                  ? t('property.reserveNote') 
                  : "You must be signed in to reserve this property."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
