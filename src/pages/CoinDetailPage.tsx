import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from '../components/ui/Motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Star,
  ArrowLeft,
  Globe,
  Layers,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useCoinDetails, useCoinChartData, useTopCoins } from '../hooks/useCryptoData';
import { TradingChart } from '../components/TradingChart';
import { LongShortBar } from '../components/ui/LongShortBar';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

interface CoinDetailPageProps {
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
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

export const CoinDetailPage: React.FC<CoinDetailPageProps> = ({ watchlistCoins, onToggleWatchlist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const coinId = id || 'bitcoin';

  const [timeframe, setTimeframe] = useState('7D');
  const [calcAmount, setCalcAmount] = useState('1');

  const { data: coin, isLoading: loadingDetails, isError, refetch } = useCoinDetails(coinId);
  const { data: chartPoints } = useCoinChartData(coinId, timeframe);
  const { data: topCoins } = useTopCoins(1, 6);

  if (loadingDetails) return <CardSkeleton />;
  if (isError || !coin) return <ErrorState onRetry={refetch} />;

  const marketData = coin.market_data;
  const price = marketData?.current_price?.usd || 0;
  const pct24h = marketData?.price_change_percentage_24h || 0;
  const isUp = pct24h >= 0;
  const isWatched = watchlistCoins.includes(coinId);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={14} /> Back to Markets
      </button>

      {/* Header Info */}
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={coin.image?.large} alt={coin.name} className="w-12 h-12 rounded-full shadow-md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display text-text-primary">{coin.name}</h1>
              <span className="text-xs font-mono font-bold text-text-muted bg-bg-secondary px-2 py-0.5 rounded-md uppercase">
                {coin.symbol}
              </span>
              <span className="text-xs font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-md">
                Rank #{coin.market_cap_rank || 1}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">Real-time Trading & Valuation Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-extrabold font-display font-num text-text-primary">
              {formatPrice(price)}
            </p>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold font-num px-2.5 py-0.5 rounded-full ${
                isUp ? 'bg-positive-muted text-positive' : 'bg-negative-muted text-negative'
              }`}
            >
              {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {isUp ? '+' : ''}{pct24h.toFixed(2)}% (24h)
            </span>
          </div>

          <button
            onClick={() => onToggleWatchlist(coinId)}
            className="p-2.5 rounded-xl border border-border bg-bg-secondary hover:bg-bg-hover transition-colors"
          >
            <Star size={18} className={isWatched ? 'fill-amber-400 text-amber-400' : 'text-text-muted'} />
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Chart + Key Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">Interactive Price Chart</h2>
          </div>

          <TradingChart
            data={chartPoints || []}
            coinName={coin.name}
            isPositive={isUp}
            height={320}
            timeframe={timeframe}
            onTimeframeChange={(tf) => setTimeframe(tf)}
          />

          <div className="pt-3 border-t border-border">
            <LongShortBar
              longPercentage={62.0}
              shortPercentage={38.0}
              longVolume="$2.41B"
              shortVolume="$1.48B"
            />
          </div>
        </div>

        {/* Right Stats Column */}
        <div className="xl:col-span-4 space-y-5">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Market Statistics</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-muted">Market Cap</span>
                <span className="font-num font-bold text-text-primary">{formatCompact(marketData?.market_cap?.usd || 0)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-muted">24h Trading Volume</span>
                <span className="font-num font-bold text-text-primary">{formatCompact(marketData?.total_volume?.usd || 0)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-muted">Circulating Supply</span>
                <span className="font-num font-bold text-text-primary">
                  {marketData?.circulating_supply?.toLocaleString()} {coin.symbol?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-muted">All-Time High (ATH)</span>
                <span className="font-num font-bold text-text-primary">{formatPrice(marketData?.ath?.usd || 0)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-muted">All-Time Low (ATL)</span>
                <span className="font-num font-bold text-text-primary">{formatPrice(marketData?.atl?.usd || 0)}</span>
              </div>
            </div>
          </div>

          {/* Crypto Converter Widget */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Quick Unit Converter</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-secondary border border-border">
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  className="w-24 bg-transparent text-xs font-mono font-bold text-text-primary focus:outline-none"
                />
                <span className="text-xs font-mono font-bold text-accent uppercase">{coin.symbol}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-secondary border border-border">
                <span className="text-xs font-mono font-bold text-text-primary font-num">
                  ${(parseFloat(calcAmount || '0') * price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-mono font-bold text-text-muted">USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
