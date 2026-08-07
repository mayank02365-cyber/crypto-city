import React from 'react';
import { motion } from '../components/ui/Motion';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTopCoins } from '../hooks/useCryptoData';
import { SparklineChart } from '../components/SparklineChart';
import { TableSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

const formatPrice = (p: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p);

interface WatchlistPageProps {
  watchlistCoins: string[];
  onToggleWatchlist: (id: string) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({ watchlistCoins, onToggleWatchlist }) => {
  const navigate = useNavigate();
  const { data: coins, isLoading, isError, refetch } = useTopCoins(1, 100);

  if (isLoading) return <TableSkeleton />;
  if (isError || !coins) return <ErrorState onRetry={refetch} />;

  const filteredCoins = coins.filter((c) => watchlistCoins.includes(c.id));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold font-display text-text-primary">Saved Watchlist</h1>
          <p className="text-xs text-text-muted mt-0.5">Your pinned cryptocurrencies synced to Supabase</p>
        </div>
        <span className="text-xs font-bold text-accent bg-accent/15 px-3 py-1 rounded-xl">
          {filteredCoins.length} Coins Watched
        </span>
      </div>

      {filteredCoins.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <Star className="w-10 h-10 text-text-muted mx-auto" />
          <p className="text-sm font-bold text-text-primary">Your watchlist is empty</p>
          <p className="text-xs text-text-muted">Click the star icon next to any coin on the Dashboard or Markets page to pin it here.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="market-table">
              <thead>
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Coin</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">24h %</th>
                  <th className="text-right hidden md:table-cell">Market Cap</th>
                  <th className="text-right hidden lg:table-cell">7D Trend</th>
                  <th className="w-12 text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((coin) => {
                  const isUp = coin.price_change_percentage_24h >= 0;
                  return (
                    <tr key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)} className="group cursor-pointer">
                      <td className="text-center text-xs text-text-muted font-num">{coin.market_cap_rank}</td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                          <div>
                            <p className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">{coin.name}</p>
                            <p className="text-[10px] text-text-muted font-mono uppercase">{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-num text-xs font-semibold text-text-primary">{formatPrice(coin.current_price)}</td>
                      <td className="text-right">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-bold font-num ${isUp ? 'text-positive' : 'text-negative'}`}>
                          {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right hidden md:table-cell text-xs font-num text-text-secondary">
                        ${(coin.market_cap / 1e9).toFixed(2)}B
                      </td>
                      <td className="text-right hidden lg:table-cell">
                        {coin.sparkline_in_7d?.price && (
                          <SparklineChart data={coin.sparkline_in_7d.price} width={80} height={26} positive={isUp} />
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(coin.id);
                          }}
                          className="p-1 rounded text-amber-400 hover:text-negative transition-colors"
                        >
                          <Star size={14} className="fill-amber-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};
