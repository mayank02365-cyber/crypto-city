import React, { useState } from 'react';
import { motion } from '../components/ui/Motion';
import { User, Bell, Shield, Wallet, Save, Check } from 'lucide-react';
import { localDb } from '../services/supabaseClient';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState(() => localDb.getUserSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localDb.setUserSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary">CryptoCity Account Settings</h1>
        <p className="text-xs text-text-muted mt-0.5">Manage platform preferences, currency & security rules synced to Supabase</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="space-y-4 border-b border-border pb-6">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Wallet size={16} className="text-accent" /> Platform Currency
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['USD', 'EUR', 'GBP', 'JPY', 'BTC'].map((curr) => (
              <button
                key={curr}
                onClick={() => setSettings({ ...settings, currency: curr })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  settings.currency === curr
                    ? 'border-accent bg-accent/15 text-accent shadow-glow-accent'
                    : 'border-border bg-bg-secondary text-text-muted hover:text-text-primary'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-b border-border pb-6">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Bell size={16} className="text-accent" /> Notifications & Alerts
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-primary">Price Movement Notifications</p>
              <p className="text-[10px] text-text-muted">Receive alerts when assets move more than 5% in 24 hours.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              className="w-4 h-4 accent-accent rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="btn-primary text-xs px-5 py-2.5 shadow-glow-accent gap-2"
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? 'Preferences Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
