import React, { useState } from 'react';
import { motion } from '../components/ui/Motion';
import { Plus, PieChart, DollarSign, Wallet, Trash2, Edit } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useTopCoins } from '../hooks/useCryptoData';
import { PortfolioModal } from '../components/PortfolioModal';
import { CardSkeleton } from '../components/ui/Skeleton';

const formatPrice = (p: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p);

export const PortfolioPage: React.FC = () => {
  const { holdings, addHolding, deleteHolding } = usePortfolio();
  const { data: coins, isLoading } = useTopCoins(1, 20);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <CardSkeleton />;

  // Calculate live values
  const holdingsWithLivePrice = holdings.map((h) => {
    const liveCoin = coins?.find((c) => c.id === h.id);
    const currentPrice = liveCoin ? liveCoin.current_price : h.avgPrice;
    const value = h.amount * currentPrice;
    const cost = h.amount * h.avgPrice;
    const pnl = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return {
      ...h,
      currentPrice,
      value,
      cost,
      pnl,
      pnlPct,
    };
  });

  const totalValue = holdingsWithLivePrice.reduce((sum, h) => sum + h.value, 0);
  const totalCost = holdingsWithLivePrice.reduce((sum, h) => sum + h.cost, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-extrabold font-display text-text-primary">Investment Portfolio</h1>
          <p className="text-xs text-text-muted mt-0.5 font-sans">Track positions, average cost basis, and real-time profit & loss</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs h-9 px-4 gap-1.5 shadow-glow-accent font-sans"
        >
          <Plus size={14} /> Add New Holding
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <Wallet size={14} className="text-accent" /> Total Portfolio Value
          </div>
          <p className="text-2xl font-extrabold font-display font-num text-text-primary">{formatPrice(totalValue)}</p>
        </div>

        <div className="glass-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <DollarSign size={14} className="text-text-muted" /> Total Invested Cost
          </div>
          <p className="text-2xl font-extrabold font-display font-num text-text-secondary">{formatPrice(totalCost)}</p>
        </div>

        <div className="glass-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <PieChart size={14} className={totalPnL >= 0 ? 'text-positive' : 'text-negative'} /> Total Profit / Loss
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-display font-num ${totalPnL >= 0 ? 'text-positive' : 'text-negative'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatPrice(totalPnL)}
            </span>
            <span className={`text-xs font-bold font-num ${totalPnL >= 0 ? 'text-positive' : 'text-negative'}`}>
              ({totalPnLPct >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-bold text-text-primary">Your Asset Positions</h3>
          <span className="text-xs text-text-muted">{holdings.length} Assets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="market-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th className="text-right">Holdings</th>
                <th className="text-right">Avg Buy Price</th>
                <th className="text-right">Current Price</th>
                <th className="text-right">Position Value</th>
                <th className="text-right">Profit / Loss</th>
                <th className="w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {holdingsWithLivePrice.map((h) => (
                <tr key={h.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img src={h.image} alt={h.name} className="w-7 h-7 rounded-full" />
                      <div>
                        <p className="text-xs font-bold text-text-primary">{h.name}</p>
                        <p className="text-[10px] font-mono text-text-muted uppercase">{h.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right text-xs font-num font-semibold text-text-primary">
                    {h.amount} {h.symbol.toUpperCase()}
                  </td>
                  <td className="text-right text-xs font-num text-text-secondary">{formatPrice(h.avgPrice)}</td>
                  <td className="text-right text-xs font-num text-text-primary font-bold">{formatPrice(h.currentPrice)}</td>
                  <td className="text-right text-xs font-num font-bold text-text-primary">{formatPrice(h.value)}</td>
                  <td className="text-right">
                    <span className={`text-xs font-num font-bold ${h.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {h.pnl >= 0 ? '+' : ''}{formatPrice(h.pnl)} ({h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(2)}%)
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => deleteHolding(h.id)}
                      className="p-1 rounded text-text-muted hover:text-negative transition-colors"
                      title="Delete Holding"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Holding Modal */}
      <PortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newH) => addHolding(newH)}
        availableCoins={coins || []}
      />
    </motion.div>
  );
};
