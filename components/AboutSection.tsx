
import React from 'react';
import { Rocket, Target, Heart, Globe, Building2, TrendingUp, Users, BookOpen, Briefcase, Coffee, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 md:py-32 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-emerald-400 font-black tracking-[0.3em] uppercase text-xs mb-4">{t('about.header')}</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            {t('about.title')}
          </h3>
          <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
          <div className="space-y-10 md:space-y-12">
            {[
              { icon: <BookOpen className="h-6 w-6 text-emerald-500" />, title: t('about.forStudents'), desc: t('about.forStudentsDesc'), color: 'emerald' },
              { icon: <Briefcase className="h-6 w-6 text-blue-500" />, title: t('about.forPros'), desc: t('about.forProsDesc'), color: 'blue' },
              { icon: <Users className="h-6 w-6 text-amber-500" />, title: t('about.community'), desc: t('about.communityDesc'), color: 'amber' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex gap-6 group cursor-default transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:translate-x-2"
              >
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-slate-700 shadow-lg group-hover:shadow-${item.color}-500/20`}>
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-emerald-400">{item.title}</h4>
                  <p className="text-slate-400 leading-relaxed transition-colors duration-300 group-hover:text-slate-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60"></div>
            <div className="relative rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden transform-gpu transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.02] group-hover:-rotate-1 group-hover:shadow-emerald-500/10">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                alt="Student Community" 
                className="w-full object-cover h-[500px] md:h-[600px] transition-transform duration-[2s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="text-white font-bold text-sm">Verified Environments</p>
                       <p className="text-white/70 text-xs uppercase tracking-widest">Safe & Secured Stays</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-slate-800/40 rounded-[3rem] p-8 md:p-16 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 opacity-30"></div>
          
          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-2xl mb-6 shadow-inner transition-transform duration-300 hover:rotate-12">
              <Rocket className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">{t('about.commitment')}</h3>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
              {t('about.commitmentDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { icon: <Coffee className="h-10 w-10 text-emerald-400" />, title: t('about.comfort'), desc: t('about.comfortDesc') },
              { icon: <TrendingUp className="h-10 w-10 text-blue-400" />, title: t('about.budget'), desc: t('about.budgetDesc') },
              { icon: <Heart className="h-10 w-10 text-pink-400" />, title: t('about.safety'), desc: t('about.safetyDesc') }
            ].map((card, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-800 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-emerald-500/30 hover:-translate-y-2 hover:scale-[1.03] group hover:shadow-2xl"
              >
                <div className="mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  {card.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3 transition-colors duration-300 group-hover:text-emerald-400">{card.title}</h4>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </section>
  );
};
