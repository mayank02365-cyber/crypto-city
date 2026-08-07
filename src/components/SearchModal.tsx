import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from './ui/Motion';

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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 pointer-events-none px-4"
          >
            <div className="glass-modal w-full max-w-lg rounded-modal overflow-hidden flex flex-col pointer-events-auto shadow-elevated">
              <div className="flex items-center px-4 py-3.5 border-b border-border bg-bg-secondary/80">
                <Search className="w-4 h-4 text-accent mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search CryptoCity assets, tickers, or markets..."
                  className="w-full bg-transparent border-none text-text-primary focus:outline-none placeholder:text-text-muted text-sm font-sans"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <button onClick={onClose} className="p-1 hover:bg-bg-hover rounded-xl text-text-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2.5 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  {query ? 'Results' : 'Popular Assets'}
                </div>
                {filteredCoins.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleSelect(coin.id)}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-bg-hover rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={coin.logo} alt={coin.name} className="w-6 h-6 rounded-full" />
                      <span className="text-xs font-semibold text-text-primary">{coin.name}</span>
                      <span className="text-[10px] font-mono text-text-muted bg-bg-secondary px-1.5 py-0.5 rounded">
                        {coin.symbol}
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-semibold ${coin.priceChange >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {coin.priceChange > 0 ? '+' : ''}{coin.priceChange}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
