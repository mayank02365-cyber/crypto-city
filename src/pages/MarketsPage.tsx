import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from '../components/ui/Motion';
import {
  Search,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTopCoins } from '../hooks/useCryptoData';
import { CryptoImage } from '../components/ui/CryptoImage';
import { SparklineChart } from '../components/SparklineChart';
import { TableSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

interface MarketsPageProps {
  watchlistCoins: string[];
  onToggleWatchlist: (id: string) => void;
}

type SortField = 'rank' | 'price' | 'change24h' | 'marketCap' | 'volume';
type SortOrder = 'asc' | 'desc';

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

export const MarketsPage: React.FC<MarketsPageProps> = ({ watchlistCoins, onToggleWatchlist }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: coins, isLoading, isError, refetch } = useTopCoins(1, 100);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'rank' ? 'asc' : 'desc');
    }
  };

  const filteredCoins = useMemo(() => {
    if (!coins) return [];
    let list = coins.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase())
    );

    if (activeCategory !== 'all') {
      list = list.filter((c) => c.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    list.sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;
      switch (sortField) {
        case 'rank':
          valA = a.market_cap_rank;
          valB = b.market_cap_rank;
          break;
        case 'price':
          valA = a.current_price;
          valB = b.current_price;
          break;
        case 'change24h':
          valA = a.price_change_percentage_24h;
          valB = b.price_change_percentage_24h;
          break;
        case 'marketCap':
          valA = a.market_cap;
          valB = b.market_cap;
          break;
        case 'volume':
          valA = a.total_volume;
          valB = b.total_volume;
          break;
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [coins, search, activeCategory, sortField, sortOrder]);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage) || 1;
  const paginatedCoins = filteredCoins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <TableSkeleton />;
  if (isError || !coins) return <ErrorState onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary">CryptoCity Markets Explorer</h1>
        <p className="text-xs text-text-muted mt-0.5">Explore 100+ cryptocurrencies by market cap, 24h volume & sector filters</p>
      </div>

      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search coin by name or ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', 'Layer 1', 'DeFi', 'Payment', 'Meme Coins'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-accent text-bg-primary shadow-glow-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              {cat === 'all' ? 'All Assets' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="market-table">
            <thead>
              <tr>
                <th className="w-12 text-center cursor-pointer" onClick={() => handleSort('rank')}>
                  # {sortField === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Coin</th>
                <th className="text-right cursor-pointer" onClick={() => handleSort('price')}>
                  Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-right cursor-pointer" onClick={() => handleSort('change24h')}>
                  24h % {sortField === 'change24h' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-right cursor-pointer hidden lg:table-cell" onClick={() => handleSort('marketCap')}>
                  Market Cap {sortField === 'marketCap' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-right cursor-pointer hidden lg:table-cell" onClick={() => handleSort('volume')}>
                  24h Volume {sortField === 'volume' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-right hidden xl:table-cell w-[100px]">7D Trend</th>
                <th className="w-10 text-center">★</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoins.map((coin) => {
                const isUp = coin.price_change_percentage_24h >= 0;
                const isWatched = watchlistCoins.includes(coin.id);

                return (
                  <tr key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)} className="group cursor-pointer">
                    <td className="text-center text-xs text-text-muted font-num">{coin.market_cap_rank}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <CryptoImage src={coin.image} alt={coin.name} symbol={coin.symbol} className="w-7 h-7 rounded-full" />
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
                    <td className="text-right hidden lg:table-cell text-xs font-num text-text-secondary">{formatCompact(coin.market_cap)}</td>
                    <td className="text-right hidden lg:table-cell text-xs font-num text-text-secondary">{formatCompact(coin.total_volume)}</td>
                    <td className="text-right hidden xl:table-cell">
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

        {/* Pagination Controls */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>Showing Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:bg-bg-hover"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:bg-bg-hover"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
