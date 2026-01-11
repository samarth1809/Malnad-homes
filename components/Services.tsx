
import React from 'react';
import { MapPin, Star, LineChart, Zap, Search, ShieldCheck } from 'lucide-react';
import { ServiceType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, delay }) => (
  <div 
    className={`p-8 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.05)] group hover:-translate-y-2 hover:scale-[1.02] cursor-default relative overflow-hidden ${delay}`}
  >
    {/* Subtle Inner Glow on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    
    <div className="relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-300 shadow-inner group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:rotate-3">
        <div className="text-emerald-400 group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
          {icon}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4 font-serif tracking-tight group-hover:text-emerald-400 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-slate-400 leading-relaxed text-sm md:text-base group-hover:text-slate-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);

export const Services: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      type: ServiceType.PLACES,
      icon: <MapPin className="h-8 w-8" />,
      title: t('services.verified'),
      description: t('services.verifiedDesc'),
      delay: "delay-0"
    },
    {
      type: ServiceType.RATINGS,
      icon: <Star className="h-8 w-8" />,
      title: t('services.reviews'),
      description: t('services.reviewsDesc'),
      delay: "delay-75"
    },
    {
      type: ServiceType.SEO,
      icon: <Search className="h-8 w-8" />,
      title: t('services.visibility'),
      description: t('services.visibilityDesc'),
      delay: "delay-150"
    },
    {
      type: ServiceType.OPTIMIZATION,
      icon: <LineChart className="h-8 w-8" />,
      title: t('services.occupancy'),
      description: t('services.occupancyDesc'),
      delay: "delay-0"
    },
    {
      type: ServiceType.AUTOMATION,
      icon: <Zap className="h-8 w-8" />,
      title: t('services.automation'),
      description: t('services.automationDesc'),
      delay: "delay-75"
    },
    {
      type: ServiceType.AUTOMATION,
      icon: <ShieldCheck className="h-8 w-8" />,
      title: t('services.agreements'),
      description: t('services.agreementsDesc'),
      delay: "delay-150"
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Professional Agency Services
          </div>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            {t('services.title')}
          </h3>
          <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              {...service} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
