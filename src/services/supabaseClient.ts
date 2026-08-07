import { supabase } from '../lib/supabase';

export { supabase };

export const localDb = {
  getWatchlist(): string[] {
    try {
      const stored = localStorage.getItem('cryptocity_watchlist');
      return stored ? JSON.parse(stored) : ['bitcoin', 'ethereum', 'solana', 'binancecoin'];
    } catch {
      return ['bitcoin', 'ethereum', 'solana', 'binancecoin'];
    }
  },
  setWatchlist(watchlist: string[]) {
    try {
      localStorage.setItem('cryptocity_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  },
  getPortfolio() {
    try {
      const stored = localStorage.getItem('cryptocity_portfolio');
      return stored
        ? JSON.parse(stored)
        : [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', amount: 0.42, avgPrice: 62000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', amount: 3.5, avgPrice: 3100, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
            { id: 'solana', symbol: 'sol', name: 'Solana', amount: 25.0, avgPrice: 140, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
          ];
    } catch {
      return [];
    }
  },
  setPortfolio(holdings: any[]) {
    try {
      localStorage.setItem('cryptocity_portfolio', JSON.stringify(holdings));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  },
  getUserSettings() {
    try {
      const stored = localStorage.getItem('cryptocity_settings');
      return stored
        ? JSON.parse(stored)
        : { currency: 'USD', theme: 'dark', notifications: true };
    } catch {
      return { currency: 'USD', theme: 'dark', notifications: true };
    }
  },
  setUserSettings(settings: any) {
    try {
      localStorage.setItem('cryptocity_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  },
};
