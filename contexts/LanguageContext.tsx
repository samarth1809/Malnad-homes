
import React, { createContext, useContext, useState } from 'react';
import { translations } from '../data/translations';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
     const keys = key.split('.');
     let current: any = translations[language];
     
     if (!current) {
        console.warn(`Language ${language} not found in translations`);
        return key;
     }

     for (const k of keys) {
       if (current[k] === undefined) {
         // Fallback to English if key missing in kn or hi
         if (language !== 'en') {
            let enCurrent: any = translations['en'];
            for (const enK of keys) {
                if (enCurrent && enCurrent[enK] !== undefined) enCurrent = enCurrent[enK];
                else enCurrent = null;
            }
            if (enCurrent && typeof enCurrent === 'string') return enCurrent;
         }
         return key; // Final fallback
       }
       current = current[k];
     }
     
     return typeof current === 'string' ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
