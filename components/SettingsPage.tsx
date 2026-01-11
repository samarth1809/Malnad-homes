
import React, { useState } from 'react';
import { ArrowLeft, Globe, Moon, Sun, Trash2, Bell, Shield, ChevronRight, X, ShieldCheck, Lock, Eye, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { Language, AppTheme } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsPageProps {
  onBack: () => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
         <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-emerald-500" /> Security & Privacy
               </h2>
               <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X className="h-6 w-6" />
               </button>
            </div>
            
            <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
               <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl">
                  <h4 className="text-emerald-600 dark:text-emerald-400 font-bold mb-2 flex items-center gap-2"><Lock className="h-4 w-4" /> End-to-End Encryption</h4>
                  <p className="text-sm">Your personal data, contact information, and booking inquiries are encrypted. Only verified property owners can see your tenant profile once you initiate a query.</p>
               </div>

               <div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-3 flex items-center gap-2"><Eye className="h-5 w-5 text-blue-500" /> Why Privacy Matters at Malnad Homes</h4>
                  <p className="text-sm mb-4">We are dedicated to maintaining the trust of our users. Unlike typical aggregators, we physically verify listings to ensure that what you see is what you get, preventing fake listings and data harvesting.</p>
                  <ul className="space-y-4">
                     <li className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                        <p className="text-xs"><span className="font-bold text-slate-900 dark:text-white">Zero Brokerage:</span> We never sell your contact info to third-party brokers. Communication is direct.</p>
                     </li>
                     <li className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                        <p className="text-xs"><span className="font-bold text-slate-900 dark:text-white">Data Control:</span> You can clear your local footprint (favorites and history) at any time from the settings menu.</p>
                     </li>
                  </ul>
               </div>

               <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button onClick={onClose} size="sm">I Understand</Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const ConfirmModal: React.FC<{ isOpen: boolean; onConfirm: () => void; onCancel: () => void }> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onCancel}></div>
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
         <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8" />
         </div>
         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Are You Sure?</h3>
         <p className="text-slate-500 text-sm mb-8 leading-relaxed">This will permanently delete your favorites and booking history. This action cannot be undone.</p>
         <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" onClick={onCancel} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Cancel</Button>
            <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-500 border-transparent text-white">Yes, Clear</Button>
         </div>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, currentTheme, onThemeChange }) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = React.useState(true);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClearData = () => {
    setIsConfirmOpen(true);
  };

  const executeClearData = () => {
    localStorage.removeItem('malnad_users_db');
    localStorage.removeItem('malnad_dynamic_properties');
    if (user) {
      localStorage.removeItem(`malnad_favorites_${user.id}`);
    }
    setIsConfirmOpen(false);
    alert("Local data cleared successfully.");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-4 text-slate-800 dark:text-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>
        </div>

        <div className="space-y-6">
          
          {/* Appearance */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" /> {t('settings.appearance')}
            </h2>
            
            <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <p className="font-medium text-slate-900 dark:text-white">{t('settings.theme')}</p>
                    <p className="text-sm text-slate-500">{t('settings.themeDesc')}</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-950 rounded-lg p-1">
                    <button 
                        onClick={() => onThemeChange('light')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentTheme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Light
                    </button>
                    <button 
                         onClick={() => onThemeChange('dark')}
                         className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentTheme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Dark
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between py-4">
                <div>
                    <p className="font-medium text-slate-900 dark:text-white">{t('settings.language')}</p>
                    <p className="text-sm text-slate-500">{t('settings.languageDesc')}</p>
                </div>
                <div className="relative">
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg py-2 pl-3 pr-8 text-sm text-slate-900 dark:text-white outline-none appearance-none cursor-pointer"
                    >
                        <option value="en">English</option>
                        <option value="kn">Kannada (ಕನ್ನಡ)</option>
                        <option value="hi">Hindi (हिंदी)</option>
                    </select>
                    <Globe className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
             <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" /> {t('settings.preferences')}
            </h2>

            <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <p className="font-medium text-slate-900 dark:text-white">{t('settings.notifications')}</p>
                    <p className="text-sm text-slate-500">{t('settings.notificationsDesc')}</p>
                </div>
                <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications ? 'translate-x-6' : ''}`}></span>
                </button>
            </div>

             <div 
               onClick={() => setIsPrivacyOpen(true)}
               className="flex items-center justify-between py-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors group"
              >
                <div>
                    <p className="font-medium text-slate-900 dark:text-white">{t('settings.privacy')}</p>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Data Zone */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
             <h2 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> {t('settings.danger')}
            </h2>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-slate-900 dark:text-white">{t('settings.clearData')}</p>
                    <p className="text-sm text-slate-500">{t('settings.clearDataDesc')}</p>
                </div>
                <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={handleClearData}>
                    {t('settings.btnReset')}
                </Button>
            </div>
           </div>
        </div>
      </div>

      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onConfirm={executeClearData} 
        onCancel={() => setIsConfirmOpen(false)} 
      />
    </div>
  );
};
