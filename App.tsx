
import React, { Suspense, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { FeaturedPlaces } from './components/FeaturedPlaces';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { OwnerDashboardPage } from './components/OwnerDashboardPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { MapModal } from './components/MapModal';
import { AuthModal } from './components/AuthModal';
import { AllPropertiesPage } from './components/AllPropertiesPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { OwnerContactPage } from './components/OwnerContactPage';
import { PropertyDetailsPage } from './components/PropertyDetailsPage';
import { useAuth } from './contexts/AuthContext';
import { useUI } from './contexts/UIContext';
import { AppTheme, Property } from './types';
import { CustomCursor } from './components/CustomCursor';

interface SearchState {
  query: string;
  location: { lat: number; lng: number } | null;
}

type ViewState = 'home' | 'all-listings' | 'profile' | 'settings' | 'owner-contact' | 'owner-dashboard' | 'admin-dashboard' | 'property-details';

function App() {
  const { isAuthenticated } = useAuth();
  const { isAuthModalOpen, openAuthModal, closeAuthModal } = useUI();
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activePropertyForContact, setActivePropertyForContact] = useState<Property | null>(null);
  
  const [view, setView] = useState<ViewState>('home');
  const [searchState, setSearchState] = useState<SearchState>({ query: '', location: null });
  
  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('malnad_theme') as AppTheme) || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('malnad_theme', theme);
    if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
    } else {
        root.classList.remove('dark');
        root.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Universal Auth Guard
  useEffect(() => {
    const protectedViews: ViewState[] = ['profile', 'owner-contact', 'owner-dashboard', 'admin-dashboard'];
    if (!isAuthenticated && protectedViews.includes(view)) {
      setView('home');
      openAuthModal();
    }

    if (view === 'property-details' && !selectedProperty) {
      setView('home');
    }
  }, [view, isAuthenticated, selectedProperty]);

  const resetToHome = () => {
    setView('home');
    setSelectedProperty(null);
    setActivePropertyForContact(null);
    setSearchState({ query: '', location: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string, location?: { lat: number; lng: number }) => {
    setSearchState({ query, location: location || null });
    setView('all-listings');
  };

  const handleOpenDashboard = () => {
    if (isAuthenticated) {
      setView('owner-dashboard');
    } else {
      openAuthModal();
    }
  };

  const handleReserve = (property: Property) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setActivePropertyForContact(property);
    setView('owner-contact');
    setIsMapOpen(false);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setView('property-details');
    setIsMapOpen(false);
  };

  const renderContent = () => {
    switch (view) {
      case 'all-listings':
        return (
          <AllPropertiesPage 
            onBack={() => setView('home')} 
            initialSearchState={searchState}
            onViewProperty={handleViewProperty}
          />
        );
      case 'profile':
        return isAuthenticated ? (
          <ProfilePage 
            onBack={() => setView('home')} 
            onViewProperty={handleViewProperty} 
          />
        ) : null;
      case 'settings':
        return (
          <SettingsPage 
            onBack={() => setView('home')} 
            currentTheme={theme} 
            onThemeChange={setTheme} 
          />
        );
      case 'owner-dashboard':
        return isAuthenticated ? <OwnerDashboardPage onBack={() => setView('home')} /> : null;
      case 'admin-dashboard':
        return isAuthenticated ? <AdminDashboardPage onBack={() => setView('home')} /> : null;
      case 'property-details':
        return selectedProperty ? (
          <PropertyDetailsPage 
            property={selectedProperty} 
            onBack={() => setView('home')} 
            onReserve={handleReserve} 
          />
        ) : null;
      case 'owner-contact':
        return isAuthenticated && activePropertyForContact ? (
          <OwnerContactPage 
            property={activePropertyForContact} 
            onBack={() => setView('property-details')} 
          />
        ) : null;
      default:
        return (
          <>
            <Hero onOpenDashboard={handleOpenDashboard} />
            <FeaturedPlaces onViewAllClick={() => setView('all-listings')} onViewProperty={handleViewProperty} />
            <Services />
            <AboutSection />
          </>
        );
    }
  };

  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors duration-300 cursor-none">
      <CustomCursor />
      <Navbar 
        onHome={resetToHome}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        onOpenAdminDashboard={() => {
           if (isAuthenticated) setView('admin-dashboard');
           else openAuthModal();
        }} 
        onSearch={handleSearch}
        onOpenProfile={() => {
           if (isAuthenticated) setView('profile');
           else openAuthModal();
        }}
        onOpenSettings={() => setView('settings')}
        onOpenAuthModal={openAuthModal}
      />
      
      <main className="min-h-screen">
        {renderContent()}
      </main>

      <Footer />

      <MapModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onViewProperty={handleViewProperty}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

export default App;
