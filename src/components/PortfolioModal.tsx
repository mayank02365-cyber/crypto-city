import React, { useState } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from './ui/Motion';
import type { Holding } from '../hooks/usePortfolio';
import type { CoinData } from '../services/cryptoApi';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (holding: Holding) => void;
  availableCoins: CoinData[];
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableCoins,
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState(availableCoins[0]?.id || 'bitcoin');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const selectedCoin = availableCoins.find((c) => c.id === selectedCoinId) || availableCoins[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !buyPrice || !selectedCoin) return;

    onSave({
      id: selectedCoin.id,
      symbol: selectedCoin.symbol,
      name: selectedCoin.name,
      amount: parseFloat(amount),
      avgPrice: parseFloat(buyPrice),
      image: selectedCoin.image,
    });

    setAmount('');
    setBuyPrice('');
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-modal w-full max-w-md rounded-modal p-6 pointer-events-auto space-y-5 shadow-elevated">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                    <Plus size={18} />
                  </div>
                  <h2 className="text-base font-bold text-text-primary">Add Portfolio Holding</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-xl text-text-muted hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Coin Select */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Select Cryptocurrency</label>
                  <select
                    value={selectedCoinId}
                    onChange={(e) => {
                      setSelectedCoinId(e.target.value);
                      const c = availableCoins.find((x) => x.id === e.target.value);
                      if (c) setBuyPrice(c.current_price.toString());
                    }}
                    className="w-full bg-bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    {availableCoins.map((coin) => (
                      <option key={coin.id} value={coin.id} className="bg-bg-secondary text-text-primary">
                        {coin.name} ({coin.symbol.toUpperCase()}) — ${coin.current_price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Quantity / Amount</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 0.5"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent font-num"
                  />
                </div>

                {/* Buy Price */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Buy Price (USD per coin)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 64500"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    required
                    className="w-full bg-bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent font-num"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:bg-bg-hover"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs px-5 py-2 shadow-glow-accent"
                  >
                    Save Holding
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
