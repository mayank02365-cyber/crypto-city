import React from 'react';
import { motion } from '../components/ui/Motion';
import { Grid3X3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCategories } from '../hooks/useCryptoData';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

const formatCompact = (num: number) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

export const CategoriesPage: React.FC = () => {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  if (isLoading) return <CardSkeleton />;
  if (isError || !categories) return <ErrorState onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary flex items-center gap-2">
          <Grid3X3 className="text-accent" /> Cryptocurrency Categories & Sectors
        </h1>
        <p className="text-xs text-text-muted mt-0.5">Explore market sectors & ecosystem capitalization breakdown</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary">{cat.name}</h3>
              <span className={`text-xs font-bold font-num flex items-center gap-0.5 ${cat.market_cap_change_24h >= 0 ? 'text-positive' : 'text-negative'}`}>
                {cat.market_cap_change_24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {cat.market_cap_change_24h >= 0 ? '+' : ''}{cat.market_cap_change_24h}%
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Sector Market Cap</span>
                <span className="font-num font-bold text-text-primary">{formatCompact(cat.market_cap)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">24h Volume</span>
                <span className="font-num font-bold text-text-secondary">{formatCompact(cat.volume_24h)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-text-muted">
              <span>Top Coins:</span>
              <div className="flex gap-1">
                {cat.top_3_coins.map((coinId) => (
                  <span key={coinId} className="px-2 py-0.5 rounded bg-bg-secondary font-mono uppercase font-bold text-text-primary">
                    {coinId}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
