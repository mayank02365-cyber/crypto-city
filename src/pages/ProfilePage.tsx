import React from 'react';
import { motion } from '../components/ui/Motion';
import { User, Shield, Wallet, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProfilePageProps {
  onOpenAuth: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary">CryptoCity Trader Profile</h1>
        <p className="text-xs text-text-muted mt-0.5">Account credentials, connected Web3 wallet & trading activity</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-2xl font-bold text-white shadow-glow-accent">
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-primary">{user?.name || 'Guest Trader'}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] bg-positive/15 text-positive font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} /> Verified PRO
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{user?.email || 'Not logged in'}</p>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => signOut()}
              className="btn-secondary text-xs px-4 py-2 text-negative border-negative/20 hover:bg-negative/10 gap-1.5"
            >
              <LogOut size={14} /> Sign Out
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary text-xs px-5 py-2 shadow-glow-accent"
            >
              Sign In / Register
            </button>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-bg-secondary border border-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <Wallet size={14} className="text-accent" /> Connected Wallet
            </div>
            <p className="text-xs font-mono font-bold text-text-primary truncate">0x71C...89A2 (MetaMask)</p>
          </div>

          <div className="p-4 rounded-xl bg-bg-secondary border border-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <Shield size={14} className="text-positive" /> Account Security
            </div>
            <p className="text-xs font-bold text-positive">2FA Enforced (Authenticator)</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
