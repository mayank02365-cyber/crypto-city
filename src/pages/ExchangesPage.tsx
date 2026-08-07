import React from 'react';
import { motion } from '../components/ui/Motion';
import { Building2, ExternalLink, ShieldCheck } from 'lucide-react';
import { useExchanges } from '../hooks/useCryptoData';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

const formatCompact = (num: number) => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

export const ExchangesPage: React.FC = () => {
  const { data: exchanges, isLoading, isError, refetch } = useExchanges();

  if (isLoading) return <CardSkeleton />;
  if (isError || !exchanges) return <ErrorState onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary flex items-center gap-2">
          <Building2 className="text-accent" /> Top Cryptocurrency Exchanges
        </h1>
        <p className="text-xs text-text-muted mt-0.5">Top-ranked global spot & derivatives exchange venues by Trust Score</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="market-table">
            <thead>
              <tr>
                <th className="w-12 text-center">Rank</th>
                <th>Exchange</th>
                <th>Trust Score</th>
                <th>Country</th>
                <th className="text-right">24h Trade Volume (USD)</th>
                <th className="w-16 text-center">Visit</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((ex) => (
                <tr key={ex.id}>
                  <td className="text-center text-xs font-num font-bold text-text-muted">#{ex.trust_score_rank}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img src={ex.image} alt={ex.name} className="w-7 h-7 rounded-full" />
                      <div>
                        <p className="text-xs font-bold text-text-primary">{ex.name}</p>
                        <p className="text-[10px] text-text-muted">Est. {ex.year_established || '2017'}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-positive bg-positive/15 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck size={12} /> {ex.trust_score} / 10
                    </span>
                  </td>
                  <td className="text-xs text-text-secondary">{ex.country}</td>
                  <td className="text-right text-xs font-num font-bold text-text-primary">
                    {formatCompact(ex.trade_volume_24h_usd)}
                  </td>
                  <td className="text-center">
                    <a
                      href={ex.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-border inline-block hover:bg-bg-hover text-text-muted hover:text-accent transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
