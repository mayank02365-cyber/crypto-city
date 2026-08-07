import React from 'react';
import { motion } from '../components/ui/Motion';
import { Layers, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useDeFiProtocols } from '../hooks/useCryptoData';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

const formatCompact = (num: number) => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

export const DeFiPage: React.FC = () => {
  const { data: protocols, isLoading, isError, refetch } = useDeFiProtocols();

  if (isLoading) return <CardSkeleton />;
  if (isError || !protocols) return <ErrorState onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary flex items-center gap-2">
          <Layers className="text-accent" /> DeFi Analytics & Total Value Locked (TVL)
        </h1>
        <p className="text-xs text-text-muted mt-0.5">Top decentralized finance protocols ranked by TVL & chain ecosystem</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="market-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Protocol</th>
                <th>Category</th>
                <th>Chain</th>
                <th className="text-right">Total Value Locked (TVL)</th>
                <th className="text-right">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {protocols.map((proto, idx) => (
                <tr key={proto.id}>
                  <td className="text-xs font-num text-text-muted">{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img src={proto.logo} alt={proto.name} className="w-7 h-7 rounded-full" />
                      <div>
                        <p className="text-xs font-bold text-text-primary">{proto.name}</p>
                        <p className="text-[10px] font-mono text-text-muted">{proto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-text-secondary">{proto.category}</td>
                  <td className="text-xs font-semibold text-accent">{proto.chain}</td>
                  <td className="text-right text-xs font-num font-bold text-text-primary">
                    {formatCompact(proto.tvl)}
                  </td>
                  <td className="text-right">
                    <span className={`text-xs font-num font-bold flex items-center justify-end gap-0.5 ${proto.tvl_change_24h >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {proto.tvl_change_24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {proto.tvl_change_24h >= 0 ? '+' : ''}{proto.tvl_change_24h}%
                    </span>
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
