import React from 'react';
import { motion } from '../components/ui/Motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowUpRight, Flame } from 'lucide-react';
import { useTopCoins } from '../hooks/useCryptoData';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

const formatPrice = (p: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p);

export const TrendingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: coins, isLoading, isError, refetch } = useTopCoins(1, 30);

  if (isLoading) return <CardSkeleton />;
  if (isError || !coins) return <ErrorState onRetry={refetch} />;

  const trending = [...coins].sort((a, b) => b.total_volume - a.total_volume).slice(0, 8);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary flex items-center gap-2">
          <Flame className="text-amber-500" /> Trending Cryptocurrency Coins
        </h1>
        <p className="text-xs text-text-muted mt-0.5">Top searched & highest trading volume crypto assets in the last 24 hours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {trending.map((coin, idx) => (
          <div
            key={coin.id}
            onClick={() => navigate(`/coin/${coin.id}`)}
            className="glass-card p-4 space-y-3 cursor-pointer hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-accent font-mono bg-accent/15 px-2 py-0.5 rounded-md">
                #{idx + 1} Trending
              </span>
              <span className="text-xs font-mono font-bold text-positive">
                +{coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full" />
              <div>
                <h3 className="text-xs font-bold text-text-primary">{coin.name}</h3>
                <p className="text-[10px] font-mono text-text-muted uppercase">{coin.symbol}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
              <span className="text-text-muted">Price</span>
              <span className="font-num font-bold text-text-primary">{formatPrice(coin.current_price)}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
