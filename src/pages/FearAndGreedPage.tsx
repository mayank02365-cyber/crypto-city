import React from 'react';
import { motion } from '../components/ui/Motion';
import { FearGreedGauge } from '../components/FearGreedGauge';
import { useFearAndGreed } from '../hooks/useCryptoData';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

export const FearAndGreedPage: React.FC = () => {
  const { data: fng, isLoading, isError, refetch } = useFearAndGreed();

  if (isLoading) return <CardSkeleton />;
  if (isError || !fng) return <ErrorState onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary">CryptoCity Fear & Greed Index</h1>
        <p className="text-xs text-text-muted mt-0.5">Real-time market sentiment & emotion analysis gauge</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6 glass-card p-6 flex flex-col items-center justify-center space-y-4">
          <FearGreedGauge value={fng.value} classification={fng.value_classification} size="lg" />
          <div className="text-center">
            <h2 className="text-3xl font-extrabold font-display text-text-primary">{fng.value} / 100</h2>
            <p className="text-sm font-semibold text-accent capitalize">{fng.value_classification}</p>
          </div>
        </div>

        <div className="xl:col-span-6 glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-text-primary">7-Day Historical Sentiment</h3>
          <div className="space-y-2">
            {fng.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-bg-secondary border border-border text-xs">
                <span className="text-text-muted">{h.timestamp}</span>
                <span className="font-num font-bold text-text-primary">{h.value} / 100</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
