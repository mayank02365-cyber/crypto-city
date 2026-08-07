import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from '../ui/Motion';
import { 
  LayoutDashboard, BarChart3, TrendingUp, Star, 
  Briefcase, Building2, Grid3X3, Newspaper, 
  Activity, Settings, ChevronLeft, ChevronRight, Zap,
  Layers, Image, User
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-3 px-3.5 py-2.5 mx-2 rounded-xl transition-all relative group ${
          isActive 
            ? 'bg-accent/15 text-accent font-semibold border-l-2 border-accent shadow-glow-accent' 
            : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
        }`
      }
      title={isCollapsed ? label : undefined}
    >
      <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">{icon}</span>
      {!isCollapsed && (
        <span className="font-medium text-xs tracking-wide whitespace-nowrap flex-1">{label}</span>
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col fixed inset-y-0 left-0 z-40 glass-sidebar border-r border-border h-screen"
    >
      {/* Brand Header */}
      <div className="h-[64px] flex items-center px-4 mb-1">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex-shrink-0 shadow-glow-accent">
          <Zap className="text-white w-5 h-5" fill="white" />
        </div>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 flex flex-col"
          >
            <span className="font-display font-bold text-base text-text-primary tracking-tight whitespace-nowrap">
              CryptoCity
            </span>
            <span className="text-[10px] text-accent font-mono uppercase tracking-wider font-bold">
              PRO TRADING ENGINE
            </span>
          </motion.div>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 space-y-4">
        <div>
          {!isCollapsed && <h4 className="px-5 mb-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">Main</h4>}
          <div className="flex flex-col gap-0.5">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" isCollapsed={isCollapsed} />
            <NavItem to="/markets" icon={<BarChart3 size={18} />} label="Markets" isCollapsed={isCollapsed} />
            <NavItem to="/trending" icon={<TrendingUp size={18} />} label="Trending" isCollapsed={isCollapsed} />
          </div>
        </div>

        <div>
          {!isCollapsed && <h4 className="px-5 mb-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">Portfolio</h4>}
          <div className="flex flex-col gap-0.5">
            <NavItem to="/watchlist" icon={<Star size={18} />} label="Watchlist" isCollapsed={isCollapsed} />
            <NavItem to="/portfolio" icon={<Briefcase size={18} />} label="Portfolio" isCollapsed={isCollapsed} />
          </div>
        </div>

        <div>
          {!isCollapsed && <h4 className="px-5 mb-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">Explore</h4>}
          <div className="flex flex-col gap-0.5">
            <NavItem to="/exchanges" icon={<Building2 size={18} />} label="Exchanges" isCollapsed={isCollapsed} />
            <NavItem to="/categories" icon={<Grid3X3 size={18} />} label="Categories" isCollapsed={isCollapsed} />
            <NavItem to="/news" icon={<Newspaper size={18} />} label="News" isCollapsed={isCollapsed} />
            <NavItem to="/defi" icon={<Layers size={18} />} label="DeFi Hub" isCollapsed={isCollapsed} />
            <NavItem to="/nfts" icon={<Image size={18} />} label="NFT Hub" isCollapsed={isCollapsed} />
          </div>
        </div>

        <div>
          {!isCollapsed && <h4 className="px-5 mb-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">Analytics & Account</h4>}
          <div className="flex flex-col gap-0.5">
            <NavItem to="/fear-and-greed" icon={<Activity size={18} />} label="Fear & Greed" isCollapsed={isCollapsed} />
            <NavItem to="/profile" icon={<User size={18} />} label="User Profile" isCollapsed={isCollapsed} />
          </div>
        </div>
      </div>

      {/* Footer Settings & Collapse */}
      <div className="p-3 border-t border-border mt-auto flex flex-col gap-1">
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" isCollapsed={isCollapsed} />
        
        <button
          onClick={onToggle}
          className="flex items-center justify-center p-2 mx-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors mt-1"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span className="ml-2 text-xs font-medium">Collapse Menu</span>}
        </button>
      </div>
    </motion.aside>
  );
};
