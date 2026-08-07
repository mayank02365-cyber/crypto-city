import { useState, useEffect } from 'react';
import { localDb } from '../services/supabaseClient';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(() => localDb.getWatchlist());

  useEffect(() => {
    localDb.setWatchlist(watchlist);
  }, [watchlist]);

  const toggleWatchlist = (coinId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(coinId);
      if (exists) {
        return prev.filter((id) => id !== coinId);
      }
      return [...prev, coinId];
    });
  };

  const isWatched = (coinId: string) => watchlist.includes(coinId);

  return {
    watchlist,
    toggleWatchlist,
    isWatched,
  };
}
