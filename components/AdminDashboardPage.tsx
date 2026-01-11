
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, XCircle, MapPin, Building, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';
import { Property } from '../types';

interface AdminDashboardPageProps {
  onBack: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);

  useEffect(() => {
    loadPendingProperties();
  }, []);

  const loadPendingProperties = () => {
    const allProps = JSON.parse(localStorage.getItem('malnad_dynamic_properties') || '[]');
    const pending = allProps.filter((p: Property) => p.status === 'pending');
    setPendingProperties(pending);
  };

  const handleUpdateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    const allProps = JSON.parse(localStorage.getItem('malnad_dynamic_properties') || '[]');
    const updatedProps = allProps.map((p: Property) => {
        if (p.id === id) {
            return { ...p, status: newStatus };
        }
        return p;
    });
    localStorage.setItem('malnad_dynamic_properties', JSON.stringify(updatedProps));
    loadPendingProperties();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-4 text-slate-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-indigo-600/20 text-indigo-600 flex items-center justify-center border border-indigo-600/30">
                <ShieldCheck className="h-6 w-6" />
             </div>
             <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{t('admin.title')}</h1>
                <p className="text-sm text-slate-500">{t('admin.subtitle')}</p>
             </div>
          </div>
        </div>

        {pendingProperties.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-20 text-center shadow-sm">
             <ShieldCheck className="h-16 w-16 mx-auto mb-6 text-slate-200 dark:text-slate-800" />
             <h3 className="text-xl font-bold mb-2">{t('admin.noPending')}</h3>
             <p className="text-slate-500">{t('admin.noPendingDesc')}</p>
          </div>
        ) : (
          <div className="space-y-6">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-500" /> {t('admin.pending')} ({pendingProperties.length})
             </h3>
             <div className="grid grid-cols-1 gap-6">
                {pendingProperties.map((prop) => (
                  <div key={prop.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                     <div className="md:w-72 h-56 md:h-auto shrink-0 relative">
                        <img src={prop.mainImage} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Pending</div>
                     </div>
                     <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="text-2xl font-serif font-bold">{prop.title}</h4>
                              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{prop.price}</span>
                           </div>
                           <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {prop.location}</span>
                              <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {prop.category}</span>
                           </div>
                           <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 text-sm leading-relaxed">{prop.description}</p>
                        </div>
                        <div className="flex justify-end gap-4 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                           <Button variant="outline" size="sm" className="text-red-500 border-red-500/20 hover:bg-red-500/10" onClick={() => handleUpdateStatus(prop.id, 'rejected')}>
                              <XCircle className="h-4 w-4 mr-2" /> {t('admin.btnReject')}
                           </Button>
                           <Button size="sm" onClick={() => handleUpdateStatus(prop.id, 'approved')}>
                              <Check className="h-4 w-4 mr-2" /> {t('admin.btnApprove')}
                           </Button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
