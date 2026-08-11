import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from '../components/ui/Motion';
import {
  TrendingUp,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  PieChart,
  Flame,
  Zap,
} from 'lucide-react';
import { useTopCoins, useGlobalMarketStats, useFearAndGreed, useCoinChartData } from '../hooks/useCryptoData';
import { SparklineChart } from '../components/SparklineChart';
import { FearGreedGauge } from '../components/FearGreedGauge';
import { TradingChart } from '../components/TradingChart';
import { LongShortBar } from '../components/ui/LongShortBar';
import { TableSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { CryptoImage } from '../components/ui/CryptoImage';

interface HomePageProps {
  watchlistCoins: string[];
  onToggleWatchlist: (id: string) => void;
}

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(8)}`;
}

function formatCompact(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
}

function formatPct(val: number | undefined): string {
  if (val === undefined || val === null) return '0.00%';
  return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
}

export const HomePage: React.FC<HomePageProps> = ({ watchlistCoins, onToggleWatchlist }) => {
  const navigate = useNavigate();
  const [selectedHeroCoin, setSelectedHeroCoin] = useState<string>('bitcoin');
  const [heroTimeframe, setHeroTimeframe] = useState<string>('7D');

  const { data: coins, isLoading: loadingCoins, isError, refetch } = useTopCoins(1, 20);
  const { data: globalStats } = useGlobalMarketStats();
  const { data: fearGreed } = useFearAndGreed();

  // Dynamic Query for timeframe chart data
  const { data: chartData, isLoading: loadingChart } = useCoinChartData(selectedHeroCoin, heroTimeframe);

  const btc = useMemo(() => coins?.find((c) => c.id === selectedHeroCoin) || coins?.[0], [coins, selectedHeroCoin]);

  const topMovers = useMemo(
    () =>
      coins
        ? [...coins].sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)).slice(0, 3)
        : [],
    [coins]
  );

  if (loadingCoins) return <TableSkeleton />;
  if (isError || !coins) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* === TOP ROW: Asset Analytics & Portfolio Cards === */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Hero Asset Chart & Trading Analytics */}
        <motion.div
          className="xl:col-span-8 glass-card p-5 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {btc && <CryptoImage src={btc.image} alt={btc.name} symbol={btc.symbol} className="w-8 h-8 rounded-full shadow-md" />}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold font-display text-text-primary">{btc?.name || 'Bitcoin'}</h2>
                  <span className="text-2xs font-mono font-bold text-text-muted bg-bg-secondary px-2 py-0.5 rounded-md uppercase">
                    {btc?.symbol}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">Rank #{btc?.market_cap_rank} · Market Cap {formatCompact(btc?.market_cap || 0)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-bg-secondary p-1 rounded-xl border border-border">
              {['bitcoin', 'ethereum', 'solana'].map((coinId) => {
                const c = coins.find((x) => x.id === coinId);
                if (!c) return null;
                return (
                  <button
                    key={coinId}
                    onClick={() => setSelectedHeroCoin(coinId)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedHeroCoin === coinId
                        ? 'bg-accent text-bg-primary shadow-glow-accent'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {c.symbol.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dominant Price Typography */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl md:text-4xl font-extrabold font-display font-num text-text-primary tracking-tight">
              {btc ? formatPrice(btc.current_price) : '$0.00'}
            </span>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold font-num px-2.5 py-0.5 rounded-full ${
                (btc?.price_change_percentage_24h ?? 0) >= 0
                  ? 'bg-positive-muted text-positive border border-positive/20'
                  : 'bg-negative-muted text-negative border border-negative/20'
              }`}
            >
              {(btc?.price_change_percentage_24h ?? 0) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {formatPct(btc?.price_change_percentage_24h)}
            </span>
            <span className="text-xs text-text-muted font-mono">{heroTimeframe} Market Performance</span>
          </div>

          <div className="pt-2">
            <TradingChart
              data={chartData || []}
              coinName={btc?.name}
              isPositive={(btc?.price_change_percentage_24h ?? 0) >= 0}
              height={260}
              timeframe={heroTimeframe}
              isLoading={loadingChart}
              onTimeframeChange={(tf) => setHeroTimeframe(tf)}
            />
          </div>

          <div className="pt-3 border-t border-border">
            <LongShortBar
              longPercentage={64.5}
              shortPercentage={35.5}
              longVolume="$1.84B"
              shortVolume="$1.01B"
            />
          </div>
        </motion.div>

        {/* Right Column (4 cols): Portfolio, Sentiment & Top Movers Widgets */}
        <div className="xl:col-span-4 space-y-4">
          {/* Portfolio Overview Widget */}
          <motion.div
            className="glass-card p-5 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart size={16} className="text-accent" />
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Portfolio Overview</h3>
              </div>
              <button
                onClick={() => navigate('/portfolio')}
                className="text-xs text-accent hover:underline flex items-center gap-0.5 font-medium"
              >
                Manage <ChevronRight size={12} />
              </button>
            </div>

            <div>
              <p className="text-[11px] text-text-muted mb-0.5">Total Valuation</p>
              <p className="text-2xl font-extrabold font-display font-num text-text-primary">$48,250.80</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold font-num text-positive flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> +$1,420.50 (24h)
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Bitcoin (BTC)</span>
                  <span className="font-num font-semibold text-text-primary">$28,500.00 (59%)</span>
                </div>
                <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: '59%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Ethereum (ETH)</span>
                  <span className="font-num font-semibold text-text-primary">$12,400.00 (26%)</span>
                </div>
                <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: '26%' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Market Sentiment Widget */}
          <motion.div
            className="glass-card p-4 flex items-center justify-between gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <FearGreedGauge
              value={fearGreed?.value || 72}
              classification={fearGreed?.value_classification || 'Greed'}
              size="sm"
            />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Market Sentiment</span>
              <span className="text-xl font-bold font-display font-num text-text-primary">
                {fearGreed?.value || 72} / 100
              </span>
              <span className="text-xs font-semibold text-accent capitalize">
                {fearGreed?.value_classification || 'Greed'}
              </span>
            </div>
          </motion.div>

          {/* Top Movers Widget (Eliminating right-side empty space) */}
          <motion.div
            className="glass-card p-4 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Flame size={14} className="text-accent" />
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Top 24h Movers</h4>
              </div>
              <button onClick={() => navigate('/trending')} className="text-[10px] text-accent hover:underline font-semibold">
                View All
              </button>
            </div>

            <div className="space-y-2">
              {topMovers.map((coin) => {
                const isUp = coin.price_change_percentage_24h >= 0;
                return (
                  <div
                    key={coin.id}
                    onClick={() => navigate(`/coin/${coin.id}`)}
                    className="flex items-center justify-between p-2 rounded-xl bg-bg-secondary/60 hover:bg-bg-hover cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CryptoImage src={coin.image} alt={coin.name} symbol={coin.symbol} className="w-6 h-6 rounded-full" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate">{coin.name}</p>
                        <p className="text-[10px] text-text-muted font-mono uppercase">{coin.symbol}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-text-primary">{formatPrice(coin.current_price)}</p>
                      <span className={`text-[10px] font-mono font-bold ${isUp ? 'text-positive' : 'text-negative'}`}>
                        {formatPct(coin.price_change_percentage_24h)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* === BOTTOM ROW: Market Directory Table === */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-bold text-text-primary">CryptoCity Market Directory</h3>
            <p className="text-xs text-text-muted">Real-time cryptocurrency prices & 7D trends</p>
          </div>
          <button
            onClick={() => navigate('/markets')}
            className="btn-primary text-xs h-8 px-3 gap-1.5"
          >
            Explore Markets <ChevronRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="market-table">
            <thead>
              <tr>
                <th className="w-12 text-center">#</th>
                <th>Coin</th>
                <th className="text-right">Price</th>
                <th className="text-right">24h %</th>
                <th className="text-right hidden md:table-cell">7d %</th>
                <th className="text-right hidden lg:table-cell">Market Cap</th>
                <th className="text-right hidden lg:table-cell">24h Volume</th>
                <th className="text-right hidden xl:table-cell w-[100px]">7D Trend</th>
                <th className="w-10 text-center">★</th>
              </tr>
            </thead>
            <tbody>
              {coins.slice(0, 10).map((coin) => {
                const isUp = coin.price_change_percentage_24h >= 0;
                const is7dUp = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;
                const isWatched = watchlistCoins.includes(coin.id);

                return (
                  <tr
                    key={coin.id}
                    onClick={() => navigate(`/coin/${coin.id}`)}
                    className="group cursor-pointer"
                  >
                    <td className="text-center text-xs text-text-muted font-num">
                      {coin.market_cap_rank}
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <CryptoImage src={coin.image} alt={coin.name} symbol={coin.symbol} className="w-7 h-7 rounded-full" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                            {coin.name}
                          </p>
                          <p className="text-[10px] text-text-muted font-mono uppercase">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-num text-xs font-semibold text-text-primary">
                      {formatPrice(coin.current_price)}
                    </td>
                    <td className="text-right">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-bold font-num ${isUp ? 'text-positive' : 'text-negative'}`}>
                        {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {formatPct(coin.price_change_percentage_24h)}
                      </span>
                    </td>
                    <td className="text-right hidden md:table-cell">
                      <span className={`text-xs font-num font-semibold ${is7dUp ? 'text-positive' : 'text-negative'}`}>
                        {formatPct(coin.price_change_percentage_7d_in_currency)}
                      </span>
                    </td>
                    <td className="text-right hidden lg:table-cell text-xs font-num text-text-secondary">
                      {formatCompact(coin.market_cap)}
                    </td>
                    <td className="text-right hidden lg:table-cell text-xs font-num text-text-secondary">
                      {formatCompact(coin.total_volume)}
                    </td>
                    <td className="text-right hidden xl:table-cell">
                      {coin.sparkline_in_7d?.price && (
                        <SparklineChart
                          data={coin.sparkline_in_7d.price}
                          width={80}
                          height={26}
                          positive={is7dUp}
                        />
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(coin.id);
                        }}
                        className="p-1 rounded transition-colors"
                      >
                        <Star size={14} className={isWatched ? 'fill-amber-400 text-amber-400' : 'text-text-muted hover:text-amber-400'} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
