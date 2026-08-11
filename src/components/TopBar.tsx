import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Zap,
  Globe,
  Check,
  Briefcase,
  Star,
  Settings,
  LogOut,
  TrendingUp,
  Shield,
  Menu,
} from 'lucide-react';
import type { GlobalMarketStats, FearAndGreedData } from '../services/cryptoApi';

import { NeonLightSweep } from './ui/NeonLightSweep';

interface TopBarProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenMobileDrawer?: () => void;
  globalStats?: GlobalMarketStats;
  fearGreedData?: FearAndGreedData;
  user?: { email: string; name?: string } | null;
  onSignOut?: () => void;
}

const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'BTC (₿)'];

function formatCompact(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
  onOpenAuth,
  onOpenMobileDrawer,
  globalStats,
  fearGreedData,
  user,
  onSignOut,
}) => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState('USD ($)');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="sticky top-3 z-40 mx-4 md:mx-6 my-2">
      <NeonLightSweep>
        <div className="glass-navbar px-4 md:px-6 h-[64px] flex items-center justify-between gap-4 shadow-elevated">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenMobileDrawer}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
              <Zap className="text-white w-4 h-4" fill="white" />
            </div>
            <span className="font-display font-bold text-sm text-text-primary">CryptoCity</span>
          </div>
        </div>
        {/* Search Input Trigger (Desktop & Mobile Modes) */}
        <div className="flex items-center gap-2 flex-1 justify-end sm:justify-start max-w-sm">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-xl bg-bg-secondary border border-border text-accent hover:bg-bg-hover transition-colors"
            title="Search assets"
          >
            <Search size={18} />
          </button>

          {/* Desktop Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex w-full items-center justify-between px-3.5 py-2 rounded-xl bg-bg-secondary/80 border border-border text-text-muted hover:border-accent/40 hover:text-text-primary transition-all text-xs group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search size={14} className="text-accent group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">Search assets, tickers, categories...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-bg-hover text-text-muted rounded border border-border shrink-0">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Center Unified Market Stats Ticker */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono bg-bg-secondary/60 px-3.5 py-1.5 rounded-xl border border-border">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Cap:</span>
            <span className="font-bold text-text-primary font-num">
              {globalStats ? formatCompact(globalStats.total_market_cap_usd) : '$2.54T'}
            </span>
          </div>

          <span className="text-border">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">24h Vol:</span>
            <span className="font-bold text-text-primary font-num">
              {globalStats ? formatCompact(globalStats.total_volume_24h_usd) : '$94.8B'}
            </span>
          </div>

          <span className="text-border">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">BTC.D:</span>
            <span className="font-bold text-accent font-num">{globalStats?.btc_dominance || 54.8}%</span>
          </div>
        </div>

        {/* Portfolio Quick Chip */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/30 text-accent font-mono text-xs">
          <Briefcase size={13} />
          <span className="font-bold font-num">$48,250.80</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCurrencyDropdown(!showCurrencyDropdown);
                setShowNotificationMenu(false);
                setShowProfileMenu(false);
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-bg-secondary border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              <Globe size={13} className="text-accent" />
              <span>{selectedCurrency.split(' ')[0]}</span>
              <ChevronDown size={12} />
            </button>
            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-36 glass-modal rounded-xl border border-border py-1 shadow-elevated z-50">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setSelectedCurrency(curr);
                      setShowCurrencyDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover hover:text-text-primary flex items-center justify-between"
                  >
                    {curr}
                    {selectedCurrency === curr && <Check size={12} className="text-accent" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Drawer */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowCurrencyDropdown(false);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors relative"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
            </button>
            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-72 glass-modal rounded-xl border border-border p-3 shadow-elevated z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-bold text-text-primary">Notifications</span>
                  <span className="text-[10px] text-accent font-bold">2 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-bg-secondary">
                    <p className="font-semibold text-text-primary">🚀 BTC Price Alert</p>
                    <p className="text-[10px] text-text-muted">Bitcoin crossed $67,400 key resistance.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-bg-secondary">
                    <p className="font-semibold text-text-primary">📊 Weekly Portfolio Recap</p>
                    <p className="text-[10px] text-text-muted">Your portfolio gained +3.4% this week.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth();
                } else {
                  setShowProfileMenu(!showProfileMenu);
                  setShowCurrencyDropdown(false);
                  setShowNotificationMenu(false);
                }
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-bg-secondary border border-border hover:border-accent/40 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-xs font-bold shadow-glow-accent">
                {user ? user.email[0].toUpperCase() : <User size={14} />}
              </div>
              <span className="text-xs font-semibold text-text-primary hidden sm:inline">
                {user ? user.name || user.email.split('@')[0] : 'Sign In'}
              </span>
              <ChevronDown size={12} className="text-text-muted" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && user && (
              <div className="absolute right-0 mt-2 w-48 glass-modal rounded-xl border border-border p-1.5 shadow-elevated z-50 space-y-1">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-bold text-text-primary">{user.name || 'Trader'}</p>
                  <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-lg flex items-center gap-2"
                >
                  <User size={14} /> My Profile
                </button>

                <button
                  onClick={() => {
                    navigate('/portfolio');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-lg flex items-center gap-2"
                >
                  <Briefcase size={14} /> Portfolio
                </button>

                <button
                  onClick={() => {
                    navigate('/watchlist');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-lg flex items-center gap-2"
                >
                  <Star size={14} /> Watchlist
                </button>

                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-lg flex items-center gap-2"
                >
                  <Settings size={14} /> Settings
                </button>

                <div className="pt-1 border-t border-border">
                  <button
                    onClick={() => {
                      if (onSignOut) onSignOut();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-negative hover:bg-negative/10 rounded-lg flex items-center gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </NeonLightSweep>
  </header>
  );
};
