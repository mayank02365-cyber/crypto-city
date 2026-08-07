import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Layers, Briefcase, Menu } from 'lucide-react';

interface BottomNavProps {
  onOpenMobileDrawer: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMobileDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Main', icon: Home, path: '/' },
    { label: 'Explore', icon: TrendingUp, path: '/markets' },
    { label: 'Data', icon: Layers, path: '/categories' },
    { label: 'Portfolio', icon: Briefcase, path: '/portfolio' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-3 pt-2 bg-bg-primary/95 backdrop-blur-xl border-t border-border shadow-elevated">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-accent scale-105 font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : ''} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenMobileDrawer}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-text-muted hover:text-text-primary"
        >
          <Menu size={18} />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </div>
    </div>
  );
};
