import React from 'react';
import { motion } from '../components/ui/Motion';
import { Newspaper, ExternalLink } from 'lucide-react';
import { useCryptoNews } from '../hooks/useCryptoData';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

export const NewsPage: React.FC = () => {
  const { data: news, isLoading, isError, refetch } = useCryptoNews();

  if (isLoading) return <CardSkeleton />;
  if (isError || !news) return <ErrorState onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary flex items-center gap-2">
          <Newspaper className="text-accent" /> CryptoCity Market News
        </h1>
        <p className="text-xs text-text-muted mt-0.5">Real-time breaking crypto news, research & institutional insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {news.map((item) => (
          <div key={item.id} className="glass-card p-5 space-y-3 flex flex-col justify-between hover:border-accent/40 transition-colors">
            <div className="space-y-2">
              <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover rounded-xl" />
              <div className="flex items-center justify-between text-[10px] text-text-muted">
                <span className="font-bold text-accent uppercase font-mono">{item.category}</span>
                <span>{new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <h3 className="text-sm font-bold text-text-primary line-clamp-2">{item.title}</h3>
              <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
              <span className="font-semibold text-text-secondary">{item.source}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline inline-flex items-center gap-1 font-semibold"
              >
                Read Article <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
