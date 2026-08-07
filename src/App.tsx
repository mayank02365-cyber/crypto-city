import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/TopBar';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { MarketsPage } from './pages/MarketsPage';
import { CoinDetailPage } from './pages/CoinDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { FearAndGreedPage } from './pages/FearAndGreedPage';
import { TrendingPage } from './pages/TrendingPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ExchangesPage } from './pages/ExchangesPage';
import { NewsPage } from './pages/NewsPage';
import { DeFiPage } from './pages/DeFiPage';
import { NFTsPage } from './pages/NFTsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';

import { useWatchlist } from './hooks/useWatchlist';
import { useAuth } from './hooks/useAuth';
import { useGlobalMarketStats, useFearAndGreed } from './hooks/useCryptoData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { watchlist, toggleWatchlist } = useWatchlist();
  const { user, signIn, signOut, isAuthenticated } = useAuth();
  const { data: globalStats } = useGlobalMarketStats();
  const { data: fearGreed } = useFearAndGreed();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex font-sans antialiased selection:bg-accent selection:text-bg-primary">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Workspace */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[260px]'
        }`}
      >
        <TopBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          globalStats={globalStats}
          fearGreedData={fearGreed}
          user={user}
          onSignOut={signOut}
        />

        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto space-y-6">
          <Routes>
            <Route
              path="/"
              element={<HomePage watchlistCoins={watchlist} onToggleWatchlist={toggleWatchlist} />}
            />
            <Route
              path="/markets"
              element={<MarketsPage watchlistCoins={watchlist} onToggleWatchlist={toggleWatchlist} />}
            />
            <Route
              path="/coin/:id"
              element={<CoinDetailPage watchlistCoins={watchlist} onToggleWatchlist={toggleWatchlist} />}
            />
            <Route
              path="/portfolio"
              element={
                isAuthenticated ? (
                  <PortfolioPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/watchlist"
              element={
                isAuthenticated ? (
                  <WatchlistPage watchlistCoins={watchlist} onToggleWatchlist={toggleWatchlist} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/exchanges" element={<ExchangesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/defi" element={<DeFiPage />} />
            <Route path="/nfts" element={<NFTsPage />} />
            <Route path="/fear-and-greed" element={<FearAndGreedPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage onOpenAuth={() => setIsAuthOpen(true)} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSignIn={signIn} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout />
      </Router>
    </QueryClientProvider>
  );
}
