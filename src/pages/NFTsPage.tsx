import React from 'react';
import { motion } from '../components/ui/Motion';
import { Image, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNFTCollections } from '../hooks/useCryptoData';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

export const NFTsPage: React.FC = () => {
  const { data: collections, isLoading, isError, refetch } = useNFTCollections();

  if (isLoading) return <CardSkeleton />;
  if (isError || !collections) return <ErrorState onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold font-display text-text-primary flex items-center gap-2">
          <Image className="text-accent" /> NFT Collections Hub
        </h1>
        <p className="text-xs text-text-muted mt-0.5">Top digital collectible collections ranked by floor price & 24h trading volume</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {collections.map((nft) => (
          <div key={nft.id} className="glass-card p-4 space-y-3 hover:border-accent/40 transition-colors">
            <img src={nft.image_url} alt={nft.name} className="w-full h-44 object-cover rounded-xl" />
            <div>
              <h3 className="text-sm font-bold text-text-primary">{nft.name}</h3>
              <p className="text-[10px] font-mono text-text-muted">{nft.symbol} · {nft.owners_count.toLocaleString()} Owners</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div>
                <p className="text-[10px] text-text-muted">Floor Price</p>
                <p className="text-xs font-num font-bold text-text-primary">{nft.floor_price_eth} ETH</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-muted">24h Vol</p>
                <p className="text-xs font-num font-bold text-text-secondary">{nft.volume_24h_eth} ETH</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
