import React, { useState } from 'react';

interface CryptoImageProps {
  src?: string;
  alt: string;
  symbol?: string;
  className?: string;
}

const WIKIPEDIA_LOGOS: Record<string, string> = {
  btc: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg',
  bitcoin: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg',
  eth: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg',
  ethereum: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg',
  sol: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
  solana: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
  bnb: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.svg',
  binancecoin: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.svg',
  xrp: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Ripple-logo.svg',
  ripple: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Ripple-logo.svg',
  usdt: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Tether_USDT.png',
  ada: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Cardano_Logo.png',
  doge: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Dogecoin_Logo.png',
};

export const CryptoImage: React.FC<CryptoImageProps> = ({
  src,
  alt,
  symbol = '',
  className = 'w-6 h-6 rounded-full',
}) => {
  const [imgState, setImgState] = useState<'primary' | 'wikipedia' | 'fallback'>('primary');

  const symKey = symbol.toLowerCase();
  const nameKey = alt.toLowerCase();
  const wikiUrl = WIKIPEDIA_LOGOS[symKey] || WIKIPEDIA_LOGOS[nameKey];

  const handleError = () => {
    if (imgState === 'primary' && wikiUrl) {
      setImgState('wikipedia');
    } else {
      setImgState('fallback');
    }
  };

  if (imgState === 'primary' && src) {
    return <img src={src} alt={alt} onError={handleError} className={className} loading="lazy" />;
  }

  if (imgState === 'wikipedia' && wikiUrl) {
    return <img src={wikiUrl} alt={alt} onError={() => setImgState('fallback')} className={className} loading="lazy" />;
  }

  // Fallback SVG badge with initial
  const initial = (symbol || alt || 'C').charAt(0).toUpperCase();

  return (
    <div className={`${className} bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center font-bold text-white text-[10px] shadow-sm uppercase font-mono`}>
      {initial}
    </div>
  );
};
