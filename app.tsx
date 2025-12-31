import React from 'react';
import { Toaster } from 'sonner@2.0.3';
import { LandingPage } from './components/LandingPage';
import { DashboardScreen } from './components/DashboardScreen';
import { CategoryScreenThematic } from './components/CategoryScreenThematic';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { SubscriptionScreen } from './components/SubscriptionScreen';
import { ShopScreen } from './components/ShopScreen';
import { DailyChallengeScreen } from './components/DailyChallengeScreen';
import { TrophyCabinetScreen } from './components/TrophyCabinetScreen';
import { AdminPanelSimple } from './components/AdminPanelSimple';
import { PaymentScreen } from './components/PaymentScreen';
import { StatsScreen } from './components/StatsScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from './components/TermsOfServiceScreen';
import { ContactPage } from './components/ContactPage';
import { FriendSystemScreen } from './components/FriendSystemScreen';
import { CollectionBookScreen } from './components/CollectionBookScreen';
import { ProfileCustomizationScreen } from './components/ProfileCustomizationScreen';
import { StateBattleArena } from './components/StateBattleArena';
import { BundeslandBattleArena } from './components/BundeslandBattleArena';
import { EUNationsBattleArena } from './components/EUNationsBattleArena';
import { UniversityBattlesScreen } from './components/UniversityBattlesScreen';
import { ProFootballArena } from './components/ProFootballArena';
import { RegionPickerModal } from './components/RegionSelector';
import { RegionProvider, useRegion } from './lib/regionContext';
import { SubscriptionProvider } from './lib/subscriptionContext';
import { AuthProvider } from './contexts/AuthContext';
import { useState, useEffect } from 'react';
import type { Region } from './lib/region';
import type { Language } from './lib/translations';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { initPWA } from './lib/pwa'; // 🚀 PWA Service Worker Registration

// 🔥 EMERGENCY DEBUG MODE
console.log('🎮 APP.TSX LOADED!');
console.log('🌍 Window:', typeof window);
console.log('📦 React:', typeof React);
console.log('🏠 Location:', window?.location?.href);

// Inner component that uses the region context
function AppContent() {
  const { region, setRegion } = useRegion();
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>('landing');
  const [language, setLanguage] = useState<Language>('en');
  
  // 🎯 Quiz Flow State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  
  // 🎮 Guest User Profile (for non-authenticated users)
  const [guestProfile, setGuestProfile] = useState({
    id: 'guest',
    name: 'Guest Player',
    avatar: '🎮',
    tier: (localStorage.getItem('user_tier') || 'free') as 'free' | 'premium',  // Load from localStorage
    xp: 0,
    level: 1,
    achievements: [],
    progress: {},
    coins: 0,
    streak: 0,
    totalScore: 0,
  });
  
  console.log('✅ APPCONTENT RENDERED - Region:', region, 'Screen:', currentScreen, 'Tier:', guestProfile.tier);
  
  // 🚀 Initialize PWA (Service Worker Registration)
  useEffect(() => {
    console.log('🚀 [PWA] Initializing Progressive Web App...');
    initPWA();
  }, []);
  
  // 💳 Check for Payment Success/Cancel in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    
    if (paymentStatus === 'success' && sessionId) {
      console.log('💳 [APP] Payment successful! Session:', sessionId);
      
      // 🚀 UPGRADE USER TO PREMIUM IMMEDIATELY
      setGuestProfile(prev => ({
        ...prev,
        tier: 'premium'
      }));
      
      // Store in localStorage
      localStorage.setItem('user_tier', 'premium');
      localStorage.setItem('payment_success', 'true');
      
      setCurrentScreen('payment-success');
      // Clean URL without reload
      window.history.replaceState({}, '', '/');
    } else if (paymentStatus === 'cancelled') {
      console.log('❌ [APP] Payment cancelled');
      setCurrentScreen('dashboard');
      // Clean URL without reload
      window.history.replaceState({}, '', '/');
    }
  }, []);
  
  // 🌍 Check if user needs to pick a region (first-time visit)
  useEffect(() => {
    const regionConfirmed = localStorage.getItem('region_confirmed');
    const hasStoredRegion = localStorage.getItem('user_region') || localStorage.getItem('market_preference');
    
    console.log('🌍 Region check:', { regionConfirmed, hasStoredRegion });
    
    // Show picker if user hasn't confirmed their region yet
    if (!regionConfirmed || !hasStoredRegion) {
      console.log('🌍 Showing region picker (first-time visit)');
      setShowRegionPicker(true);
    }
    
    // Set language based on region
    if (region === 'DE') {
      setLanguage('de');
    } else {
      setLanguage('en');
    }
  }, [region]);
  
  // Handle region selection
  const handleRegionSelect = (selectedRegion: Region) => {
    console.log('🌍 User selected region:', selectedRegion);
    setRegion(selectedRegion);
    localStorage.setItem('region_confirmed', 'true');
    setShowRegionPicker(false);
  };
  
  // Handle Get Started - Go to Dashboard (Guest Mode)
  const handleGetStarted = () => {
    console.log('🎮 Get Started clicked - Going to Dashboard');
    setCurrentScreen('dashboard');
  };
  
  // Handle Navigation between screens
  const handleNavigate = (screen: string) => {
    console.log('🧭 Navigate to:', screen);
    
    // Special handling for landing/auth
    if (screen === 'landing') {
      setCurrentScreen('landing');
      setIsAuthenticated(false);
    } else {
      setCurrentScreen(screen);
    }
  };
  
  // Handle Language Toggle
  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'de' : 'en');
  };
  
  // 🎯 Handle Category Selection - Start Quiz
  const handleCategorySelect = (category: string) => {
    console.log('🎯 Category selected:', category);
    setSelectedCategory(category);
    setCurrentScreen('quiz');
  };
  
  // 🏁 Handle Quiz Complete - Show Results
  const handleQuizComplete = (results: any) => {
    console.log('🏁 Quiz completed:', results);
    setQuizResults(results);
    setCurrentScreen('results');
  };
  
  // 🔄 Handle Play Again
  const handlePlayAgain = () => {
    console.log('🔄 Play again - back to categories');
    setSelectedCategory(null);
    setQuizResults(null);
    setCurrentScreen('categories');
  };
  
  // Handle Premium Upgrade (Stripe Checkout)
  const handleUpgrade = async (tier: 'premium', period: 'monthly' | 'annual') => {
    console.log('💳 [APP] Premium upgrade requested:', { tier, period });
    
    try {
      // Map period format (annual → yearly)
      const checkoutPeriod = period === 'annual' ? 'yearly' : 'monthly';
      
      // Call backend to create Stripe Checkout Session
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6378916a/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          userId: guestProfile.id,
          email: guestProfile.email || undefined,
          market: region || 'US',
          period: checkoutPeriod,
          isGuest: true,
          returnUrl: window.location.origin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      console.log('✅ [APP] Checkout session created:', data);

      // Redirect to Stripe Checkout
      if (data.url) {
        console.log('🔗 [APP] Redirecting to Stripe Checkout:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('❌ [APP] Stripe checkout error:', error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      {/* 🌍 Region Picker Modal - Shows on first visit */}
      {showRegionPicker && (
        <RegionPickerModal onSelectRegion={handleRegionSelect} />
      )}
      
      {/* 🎮 Main App Content - Screen Router */}
      {currentScreen === 'payment-success' ? (
        <PaymentSuccessPage 
          onContinue={() => setCurrentScreen('dashboard')} 
          language={language}
        />
      ) : currentScreen === 'landing' ? (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'categories' ? (
        <CategoryScreenThematic
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
          onCategorySelect={handleCategorySelect}
          onLanguageChange={setLanguage}
          market={region as any}
        />
      ) : currentScreen === 'profile' ? (
        <ProfileScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'settings' ? (
        <SettingsScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'leaderboard' ? (
        <LeaderboardScreen
          onNavigate={handleNavigate}
          language={language}
          userProfile={guestProfile}
        />
      ) : currentScreen === 'achievements' ? (
        <AchievementsScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'subscription' ? (
        <SubscriptionScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
          onSubscribe={handleUpgrade}
        />
      ) : currentScreen === 'shop' ? (
        <ShopScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'daily-challenge' ? (
        <DailyChallengeScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'trophy-cabinet' ? (
        <TrophyCabinetScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'admin' ? (
        <AdminPanelSimple
          onNavigate={handleNavigate}
        />
      ) : currentScreen === 'payment' ? (
        <PaymentScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
          onSubscribe={handleUpgrade}
        />
      ) : currentScreen === 'stats' ? (
        <StatsScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'privacy-policy' ? (
        <PrivacyPolicyScreen
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'terms-of-service' ? (
        <TermsOfServiceScreen
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'contact' ? (
        <ContactPage
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'friends' ? (
        <FriendSystemScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'collection-book' ? (
        <CollectionBookScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'profile-customization' ? (
        <ProfileCustomizationScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'state-battle-arena' ? (
        <StateBattleArena
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'bundesland-battle-arena' ? (
        <BundeslandBattleArena
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'eu-nations-battle-arena' ? (
        <EUNationsBattleArena
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'university-battles' ? (
        <UniversityBattlesScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'pro-football-arena' ? (
        <ProFootballArena
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
        />
      ) : currentScreen === 'quiz' ? (
        <QuizScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
          categoryId={selectedCategory || 'general'} 
          onQuizComplete={handleQuizComplete}
          onProfileUpdate={(updates) => {
            setGuestProfile(prev => ({ ...prev, ...updates }));
          }}
        />
      ) : currentScreen === 'results' ? (
        <ResultsScreen
          userProfile={guestProfile}
          onNavigate={handleNavigate}
          language={language}
          results={quizResults}
          onPlayAgain={handlePlayAgain}
        />
      ) : (
        <DashboardScreen
          userProfile={guestProfile}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onNavigate={handleNavigate}
          onUpgrade={handleUpgrade}
        />
      )}
      
      <Toaster position="top-center" />
    </>
  );
}

export default function App() {
  console.log('🎮 QUIZRIOT ARENA - APP COMPONENT RENDERING');
  
  return (
    <RegionProvider>
      <SubscriptionProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SubscriptionProvider>
    </RegionProvider>
  );
}
