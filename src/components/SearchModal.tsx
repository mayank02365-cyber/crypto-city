import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from './ui/Motion';
import { CryptoImage } from './ui/CryptoImage';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', priceChange: 2.5, logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', priceChange: -1.2, logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', priceChange: 5.4, logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', priceChange: 0.8, logo: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', priceChange: -0.5, logo: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', priceChange: 1.8, logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', priceChange: 4.2, logo: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredCoins = POPULAR_COINS.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    navigate(`/coin/${id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-4 sm:pt-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.2 }}
            className="glass-modal w-full max-w-lg overflow-hidden flex flex-col relative z-10 shadow-elevated border border-border rounded-2xl"
          >
            {/* Input Header */}
            <div className="flex items-center px-3.5 py-3 border-b border-border bg-bg-secondary/90 gap-2.5">
              <Search className="w-4 h-4 text-accent shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search assets, tickers, markets..."
                className="w-full bg-transparent border-none text-text-primary focus:outline-none placeholder:text-text-muted text-xs sm:text-sm font-sans"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 text-text-muted hover:text-text-primary text-xs">
                  Clear
                </button>
              )}
              <button onClick={onClose} className="p-1.5 hover:bg-bg-hover rounded-xl text-text-muted transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Body */}
            <div className="p-2 max-h-[70vh] sm:max-h-96 overflow-y-auto space-y-1">
              <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                <span>{query ? 'Search Results' : 'Popular Assets'}</span>
                <span className="flex items-center gap-1 font-mono text-accent">
                  <TrendingUp size={10} /> Live Feeds
                </span>
              </div>

              {filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleSelect(coin.id)}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-bg-hover rounded-xl cursor-pointer transition-all border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CryptoImage src={coin.logo} alt={coin.name} symbol={coin.symbol} className="w-7 h-7 rounded-full shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate">{coin.name}</p>
                        <p className="text-[10px] font-mono text-text-muted uppercase">{coin.symbol}</p>
                      </div>
                    </div>

                    <span className={`text-xs font-mono font-bold ${coin.priceChange >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {coin.priceChange > 0 ? '+' : ''}{coin.priceChange}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-text-muted">
                  No assets found matching "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
