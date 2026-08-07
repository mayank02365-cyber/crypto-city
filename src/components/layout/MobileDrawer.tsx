import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from '../ui/Motion';
import {
  X,
  Home,
  TrendingUp,
  Flame,
  Star,
  Briefcase,
  Building2,
  PieChart,
  Newspaper,
  Zap,
  Activity,
  Layers,
  Settings,
  User,
  LogOut,
  Shield,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { email: string; name?: string } | null;
  onSignOut?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onSignOut,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const sections = [
    {
      title: 'Main & Overview',
      links: [
        { label: 'Dashboard', path: '/', icon: Home },
        { label: 'Portfolio Tracker', path: '/portfolio', icon: Briefcase, badge: 'SYNC' },
        { label: 'Watchlist', path: '/watchlist', icon: Star },
      ],
    },
    {
      title: 'Explore Markets',
      links: [
        { label: 'Market Directory', path: '/markets', icon: TrendingUp },
        { label: 'Trending Assets', path: '/trending', icon: Flame, badge: 'HOT' },
        { label: 'Market Sectors', path: '/categories', icon: PieChart },
      ],
    },
    {
      title: 'Data & Hubs',
      links: [
        { label: 'Spot Exchanges', path: '/exchanges', icon: Building2 },
        { label: 'DeFi Hub (TVL)', path: '/defi', icon: Zap },
        { label: 'NFT Collections', path: '/nfts', icon: Layers },
        { label: 'Crypto News Feed', path: '/news', icon: Newspaper },
      ],
    },
    {
      title: 'Analytics & Sentiment',
      links: [
        { label: 'Fear & Greed Index', path: '/fear-and-greed', icon: Activity },
      ],
    },
    {
      title: 'Account Settings',
      links: [
        { label: 'User Profile', path: '/profile', icon: User },
        { label: 'Preferences & Currency', path: '/settings', icon: Settings },
      ],
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 md:hidden flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-80 max-w-[85vw] h-full bg-bg-secondary/95 backdrop-blur-2xl border-r border-border p-5 flex flex-col justify-between overflow-y-auto shadow-elevated z-10"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-glow-accent">
                  <Zap className="text-white w-5 h-5" fill="white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-text-primary">CryptoCity</h2>
                  <span className="text-[10px] font-mono text-accent font-semibold">PRO TRADING ENGINE</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Groups */}
            <div className="space-y-5">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-1.5">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.links.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;

                      return (
                        <button
                          key={link.path}
                          onClick={() => handleNavigate(link.path)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-accent/15 text-accent border border-accent/30 shadow-glow-accent'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={16} className={isActive ? 'text-accent' : 'text-text-muted'} />
                            <span>{link.label}</span>
                          </div>
                          {link.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-accent/20 text-accent uppercase">
                              {link.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer User Info */}
          <div className="pt-4 border-t border-border space-y-3 mt-6">
            {user ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-card border border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-xs">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">{user.name || 'Trader'}</p>
                    <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onSignOut) onSignOut();
                    onClose();
                  }}
                  className="p-1.5 rounded-lg text-negative hover:bg-negative/10"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate('/login')}
                className="w-full btn-primary py-2.5 text-xs font-bold shadow-glow-accent"
              >
                Sign In to CryptoCity
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
