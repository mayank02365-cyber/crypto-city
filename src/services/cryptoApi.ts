export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply?: number;
  max_supply?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  sparkline_in_7d?: { price: number[] };
  category?: string;
}

export interface GlobalMarketStats {
  total_market_cap_usd: number;
  total_volume_24h_usd: number;
  btc_dominance: number;
  eth_dominance: number;
  market_cap_change_24h_pct: number;
  active_cryptocurrencies: number;
  active_exchanges: number;
  eth_gas_gwei: number;
}

export interface FearAndGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
  history: { value: number; timestamp: string }[];
}

export interface CryptoNewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  published_at: string;
  image_url: string;
}

export interface ExchangeData {
  id: string;
  name: string;
  year_established: number;
  country: string;
  description: string;
  url: string;
  image: string;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_usd: number;
}

export interface CategoryData {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  volume_24h: number;
  top_3_coins: string[];
}

export interface DeFiProtocolData {
  id: string;
  name: string;
  symbol: string;
  category: string;
  tvl: number;
  tvl_change_24h: number;
  chain: string;
  logo: string;
}

export interface NFTCollectionData {
  id: string;
  name: string;
  symbol: string;
  floor_price_eth: number;
  floor_price_change_24h: number;
  volume_24h_eth: number;
  owners_count: number;
  image_url: string;
}

const API_CACHE: Record<string, { timestamp: number; data: any }> = {};
const CACHE_TTL_MS = 30000; // 30s cache

const FALLBACK_GLOBAL_STATS: GlobalMarketStats = {
  total_market_cap_usd: 2540987654320,
  total_volume_24h_usd: 94876543210,
  btc_dominance: 54.8,
  eth_dominance: 16.2,
  market_cap_change_24h_pct: 3.42,
  active_cryptocurrencies: 13420,
  active_exchanges: 785,
  eth_gas_gwei: 18,
};

const FALLBACK_FEAR_GREED: FearAndGreedData = {
  value: 72,
  value_classification: 'Greed',
  timestamp: new Date().toISOString(),
  history: Array.from({ length: 7 }, (_, i) => ({
    value: Math.floor(65 + Math.sin(i) * 15),
    timestamp: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
  })),
};

const FALLBACK_COINS: CoinData[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 67450.50,
    market_cap: 1324500000000,
    market_cap_rank: 1,
    total_volume: 38400000000,
    high_24h: 68120.00,
    low_24h: 65980.00,
    price_change_24h: 1840.50,
    price_change_percentage_24h: 2.81,
    price_change_percentage_7d_in_currency: 5.42,
    market_cap_change_24h: 36000000000,
    market_cap_change_percentage_24h: 2.81,
    circulating_supply: 19740000,
    max_supply: 21000000,
    ath: 73737.00,
    ath_change_percentage: -8.5,
    ath_date: '2024-03-14',
    atl: 67.81,
    atl_change_percentage: 99380,
    atl_date: '2013-07-06',
    category: 'Layer 1',
    sparkline_in_7d: { price: [63800, 64200, 63900, 65100, 66400, 66100, 67450] }
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3480.25,
    market_cap: 418500000000,
    market_cap_rank: 2,
    total_volume: 19800000000,
    high_24h: 3520.00,
    low_24h: 3390.00,
    price_change_24h: 112.50,
    price_change_percentage_24h: 3.34,
    price_change_percentage_7d_in_currency: 8.12,
    market_cap_change_24h: 13500000000,
    market_cap_change_percentage_24h: 3.34,
    circulating_supply: 120200000,
    ath: 4878.26,
    ath_change_percentage: -28.6,
    ath_date: '2021-11-10',
    atl: 0.43,
    atl_change_percentage: 809200,
    atl_date: '2015-10-20',
    category: 'Layer 1',
    sparkline_in_7d: { price: [3200, 3250, 3280, 3350, 3410, 3430, 3480] }
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 178.60,
    market_cap: 83200000000,
    market_cap_rank: 3,
    total_volume: 6400000000,
    high_24h: 182.00,
    low_24h: 169.50,
    price_change_24h: 7.80,
    price_change_percentage_24h: 4.56,
    price_change_percentage_7d_in_currency: 12.3,
    market_cap_change_24h: 3600000000,
    market_cap_change_percentage_24h: 4.56,
    circulating_supply: 465800000,
    ath: 259.96,
    ath_change_percentage: -31.2,
    ath_date: '2021-11-06',
    atl: 0.50,
    atl_change_percentage: 35620,
    atl_date: '2020-05-11',
    category: 'Layer 1',
    sparkline_in_7d: { price: [155, 160, 162, 168, 172, 175, 178.6] }
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 585.40,
    market_cap: 87800000000,
    market_cap_rank: 4,
    total_volume: 1200000000,
    high_24h: 592.00,
    low_24h: 578.00,
    price_change_24h: 4.20,
    price_change_percentage_24h: 0.72,
    price_change_percentage_7d_in_currency: 1.85,
    market_cap_change_24h: 630000000,
    market_cap_change_percentage_24h: 0.72,
    circulating_supply: 153800000,
    max_supply: 200000000,
    ath: 717.48,
    ath_change_percentage: -18.4,
    ath_date: '2024-06-06',
    atl: 0.0398,
    atl_change_percentage: 1470800,
    atl_date: '2017-10-19',
    category: 'Layer 1',
    sparkline_in_7d: { price: [575, 578, 580, 582, 586, 584, 585.4] }
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.612,
    market_cap: 34200000000,
    market_cap_rank: 5,
    total_volume: 2100000000,
    high_24h: 0.635,
    low_24h: 0.589,
    price_change_24h: 0.021,
    price_change_percentage_24h: 3.55,
    price_change_percentage_7d_in_currency: -1.2,
    market_cap_change_24h: 1100000000,
    market_cap_change_percentage_24h: 3.55,
    circulating_supply: 56000000000,
    max_supply: 100000000000,
    ath: 3.84,
    ath_change_percentage: -84.0,
    ath_date: '2018-01-04',
    atl: 0.00268,
    atl_change_percentage: 22730,
    atl_date: '2014-05-22',
    category: 'Payment',
    sparkline_in_7d: { price: [0.62, 0.61, 0.59, 0.60, 0.60, 0.59, 0.612] }
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.428,
    market_cap: 15300000000,
    market_cap_rank: 6,
    total_volume: 480000000,
    high_24h: 0.442,
    low_24h: 0.415,
    price_change_24h: 0.012,
    price_change_percentage_24h: 2.88,
    price_change_percentage_7d_in_currency: 4.10,
    market_cap_change_24h: 420000000,
    market_cap_change_percentage_24h: 2.88,
    circulating_supply: 35700000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -86.1,
    ath_date: '2021-09-02',
    atl: 0.0192,
    atl_change_percentage: 2125,
    atl_date: '2020-03-13',
    category: 'Layer 1',
    sparkline_in_7d: { price: [0.41, 0.412, 0.418, 0.42, 0.425, 0.422, 0.428] }
  },
  {
    id: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    current_price: 28.40,
    market_cap: 11200000000,
    market_cap_rank: 7,
    total_volume: 390000000,
    high_24h: 29.10,
    low_24h: 27.20,
    price_change_24h: 1.15,
    price_change_percentage_24h: 4.22,
    price_change_percentage_7d_in_currency: 9.80,
    market_cap_change_24h: 450000000,
    market_cap_change_percentage_24h: 4.22,
    circulating_supply: 395000000,
    max_supply: 720000000,
    ath: 144.96,
    ath_change_percentage: -80.4,
    ath_date: '2021-11-21',
    atl: 2.80,
    atl_change_percentage: 914,
    atl_date: '2020-12-31',
    category: 'Layer 1',
    sparkline_in_7d: { price: [25.8, 26.2, 26.9, 27.4, 28.1, 28.0, 28.4] }
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.124,
    market_cap: 18100000000,
    market_cap_rank: 8,
    total_volume: 980000000,
    high_24h: 0.129,
    low_24h: 0.118,
    price_change_24h: 0.005,
    price_change_percentage_24h: 4.20,
    price_change_percentage_7d_in_currency: 14.50,
    market_cap_change_24h: 730000000,
    market_cap_change_percentage_24h: 4.20,
    circulating_supply: 145000000000,
    ath: 0.731,
    ath_change_percentage: -83.0,
    ath_date: '2021-05-08',
    atl: 0.0000869,
    atl_change_percentage: 142600,
    atl_date: '2015-05-06',
    category: 'Meme Coins',
    sparkline_in_7d: { price: [0.108, 0.112, 0.115, 0.121, 0.126, 0.122, 0.124] }
  },
  {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    current_price: 14.85,
    market_cap: 8900000000,
    market_cap_rank: 9,
    total_volume: 320000000,
    high_24h: 15.20,
    low_24h: 14.10,
    price_change_24h: 0.65,
    price_change_percentage_24h: 4.58,
    price_change_percentage_7d_in_currency: 11.2,
    market_cap_change_24h: 390000000,
    market_cap_change_percentage_24h: 4.58,
    circulating_supply: 608000000,
    max_supply: 1000000000,
    ath: 52.70,
    ath_change_percentage: -71.8,
    ath_date: '2021-05-10',
    atl: 0.148,
    atl_change_percentage: 9934,
    atl_date: '2017-11-29',
    category: 'DeFi',
    sparkline_in_7d: { price: [13.2, 13.6, 14.1, 14.3, 14.9, 14.7, 14.85] }
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    current_price: 6.45,
    market_cap: 9200000000,
    market_cap_rank: 10,
    total_volume: 210000000,
    high_24h: 6.62,
    low_24h: 6.28,
    price_change_24h: 0.15,
    price_change_percentage_24h: 2.38,
    price_change_percentage_7d_in_currency: 3.80,
    market_cap_change_24h: 210000000,
    market_cap_change_percentage_24h: 2.38,
    circulating_supply: 1420000000,
    ath: 54.98,
    ath_change_percentage: -88.2,
    ath_date: '2021-11-04',
    atl: 2.70,
    atl_change_percentage: 138,
    atl_date: '2020-08-20',
    category: 'Layer 1',
    sparkline_in_7d: { price: [6.2, 6.25, 6.3, 6.4, 6.5, 6.42, 6.45] }
  }
];

const FALLBACK_NEWS: CryptoNewsArticle[] = [
  {
    id: 'news-1',
    title: 'Bitcoin Surges Past Key Resistance as Institutional Inflows Hit Record $1.2B',
    description: 'Spot ETF inflows accelerate while supply on exchanges drops to 5-year lows, signalling a potential bullish continuation.',
    url: 'https://coindesk.com',
    source: 'CoinDesk',
    category: 'Bitcoin',
    published_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'news-2',
    title: 'Ethereum Layer 2 TVL Hits All-Time High of $45 Billion Driven by Base & Arbitrum',
    description: 'Scaling solutions report massive adoption as gas fees remain under 1 cent following recent protocol upgrades.',
    url: 'https://cointelegraph.com',
    source: 'CoinTelegraph',
    category: 'Layer 2',
    published_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'news-3',
    title: 'Solana DEX Volume Flips Ethereum Mainnet for 3rd Consecutive Month',
    description: 'High throughput and vibrant meme & DeFi liquidity hubs propel Solana DEX volume past $2.5 billion daily average.',
    url: 'https://decrypt.co',
    source: 'Decrypt',
    category: 'DeFi',
    published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
  }
];

export const cryptoApi = {
  async getGlobalMarketStats(): Promise<GlobalMarketStats> {
    const cacheKey = 'global_stats';
    if (API_CACHE[cacheKey] && (Date.now() - API_CACHE[cacheKey].timestamp) < CACHE_TTL_MS) {
      return API_CACHE[cacheKey].data;
    }

    try {
      const res = await fetch('https://api.coingecko.com/api/v3/global');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const result: GlobalMarketStats = {
        total_market_cap_usd: data.data.total_market_cap.usd,
        total_volume_24h_usd: data.data.total_volume.usd,
        btc_dominance: Number(data.data.market_cap_percentage.btc.toFixed(1)),
        eth_dominance: Number(data.data.market_cap_percentage.eth.toFixed(1)),
        market_cap_change_24h_pct: Number(data.data.market_cap_change_percentage_24h_usd.toFixed(2)),
        active_cryptocurrencies: data.data.active_cryptocurrencies,
        active_exchanges: data.data.markets,
        eth_gas_gwei: 18,
      };
      API_CACHE[cacheKey] = { timestamp: Date.now(), data: result };
      return result;
    } catch (err) {
      return FALLBACK_GLOBAL_STATS;
    }
  },

  async getTopCoins(page = 1, perPage = 25, category?: string): Promise<CoinData[]> {
    const cacheKey = `top_coins_${page}_${perPage}_${category || 'all'}`;
    if (API_CACHE[cacheKey] && (Date.now() - API_CACHE[cacheKey].timestamp) < CACHE_TTL_MS) {
      return API_CACHE[cacheKey].data;
    }

    try {
      let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;
      if (category && category !== 'all') {
        url += `&category=${category}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CoinData[] = await res.json();
      API_CACHE[cacheKey] = { timestamp: Date.now(), data };
      return data;
    } catch (err) {
      return FALLBACK_COINS;
    }
  },

  async getCoinDetails(coinId: string): Promise<any> {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=true&sparkline=true`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      const fallbackCoin = FALLBACK_COINS.find(c => c.id === coinId) || FALLBACK_COINS[0];
      return {
        id: fallbackCoin.id,
        name: fallbackCoin.name,
        symbol: fallbackCoin.symbol,
        image: { large: fallbackCoin.image },
        market_cap_rank: fallbackCoin.market_cap_rank,
        description: { en: `${fallbackCoin.name} is a high-speed digital asset engine on the CryptoCity ecosystem.` },
        links: {
          homepage: ['https://bitcoin.org'],
          blockchain_site: ['https://mempool.space'],
          official_forum_url: ['https://bitcointalk.org'],
        },
        market_data: {
          current_price: { usd: fallbackCoin.current_price },
          market_cap: { usd: fallbackCoin.market_cap },
          total_volume: { usd: fallbackCoin.total_volume },
          high_24h: { usd: fallbackCoin.high_24h },
          low_24h: { usd: fallbackCoin.low_24h },
          price_change_percentage_24h: fallbackCoin.price_change_percentage_24h,
          price_change_percentage_7d: fallbackCoin.price_change_percentage_7d_in_currency || 5.4,
          circulating_supply: fallbackCoin.circulating_supply,
          max_supply: fallbackCoin.max_supply || null,
          ath: { usd: fallbackCoin.ath },
          ath_change_percentage: { usd: fallbackCoin.ath_change_percentage },
          ath_date: { usd: fallbackCoin.ath_date },
          atl: { usd: fallbackCoin.atl },
          sparkline_7d: fallbackCoin.sparkline_in_7d,
        },
      };
    }
  },

  async getCoinChartData(coinId: string, days: number | string = 7): Promise<{ timestamp: number; price: number }[]> {
    const daysStr = String(days);
    const cacheKey = `chart_${coinId}_${daysStr}`;

    if (API_CACHE[cacheKey] && (Date.now() - API_CACHE[cacheKey].timestamp) < CACHE_TTL_MS) {
      return API_CACHE[cacheKey].data;
    }

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${daysStr}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const points = data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price: Number(price.toFixed(4)),
      }));
      API_CACHE[cacheKey] = { timestamp: Date.now(), data: points };
      return points;
    } catch (err) {
      // Intelligent timeframe-specific historical data generator
      const baseCoin = FALLBACK_COINS.find(c => c.id === coinId) || FALLBACK_COINS[0];
      const basePrice = baseCoin.current_price;
      const now = Date.now();

      let pointsCount = 40;
      let timeStepMs = 3600000; // 1 hour default
      let volatility = 0.02;
      let trendMultiplier = 1;

      if (daysStr === '0.04' || daysStr === '1h' || daysStr === '1H') {
        pointsCount = 60;
        timeStepMs = 60000; // 1 min intervals
        volatility = 0.005;
        trendMultiplier = 0.8;
      } else if (daysStr === '1' || daysStr === '24h' || daysStr === '24H') {
        pointsCount = 24;
        timeStepMs = 3600000; // 1 hr intervals
        volatility = 0.025;
        trendMultiplier = 1.2;
      } else if (daysStr === '7' || daysStr === '7d' || daysStr === '7D') {
        pointsCount = 42;
        timeStepMs = 14400000; // 4 hr intervals
        volatility = 0.05;
        trendMultiplier = 1.5;
      } else if (daysStr === '30' || daysStr === '30d' || daysStr === '30D') {
        pointsCount = 30;
        timeStepMs = 86400000; // 1 day intervals
        volatility = 0.10;
        trendMultiplier = 2.2;
      } else if (daysStr === '90' || daysStr === '90d' || daysStr === '90D') {
        pointsCount = 45;
        timeStepMs = 86400000 * 2; // 2 day intervals
        volatility = 0.18;
        trendMultiplier = 3.0;
      } else if (daysStr === '365' || daysStr === '1y' || daysStr === '1Y') {
        pointsCount = 52;
        timeStepMs = 86400000 * 7; // 1 week intervals
        volatility = 0.35;
        trendMultiplier = 4.5;
      } else if (daysStr === 'max' || daysStr === 'all' || daysStr === 'ALL') {
        pointsCount = 60;
        timeStepMs = 86400000 * 30; // 1 month intervals
        volatility = 0.60;
        trendMultiplier = 8.0;
      }

      const generated = Array.from({ length: pointsCount }, (_, i) => {
        const progress = i / (pointsCount - 1);
        const cycle = Math.sin(i * 0.3) * (basePrice * volatility);
        const wave = Math.cos(i * 0.15) * (basePrice * volatility * 0.5);
        const trend = (progress - 0.5) * (basePrice * 0.05 * trendMultiplier);
        const price = Math.max(1, Number((basePrice + cycle + wave + trend).toFixed(2)));
        const timestamp = now - (pointsCount - 1 - i) * timeStepMs;
        return { timestamp, price };
      });

      API_CACHE[cacheKey] = { timestamp: Date.now(), data: generated };
      return generated;
    }
  },

  async getFearAndGreed(): Promise<FearAndGreedData> {
    try {
      const res = await fetch('https://api.alternative.me/fng/?limit=7');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const current = data.data[0];
      return {
        value: parseInt(current.value),
        value_classification: current.value_classification,
        timestamp: current.timestamp,
        history: data.data.map((item: any) => ({
          value: parseInt(item.value),
          timestamp: new Date(parseInt(item.timestamp) * 1000).toISOString().split('T')[0],
        })),
      };
    } catch (err) {
      return FALLBACK_FEAR_GREED;
    }
  },

  async getCryptoNews(): Promise<CryptoNewsArticle[]> {
    return FALLBACK_NEWS;
  },

  async getExchanges(): Promise<ExchangeData[]> {
    return [
      {
        id: 'binance',
        name: 'Binance',
        year_established: 2017,
        country: 'Cayman Islands',
        description: 'World largest cryptocurrency exchange by volume.',
        url: 'https://binance.com',
        image: 'https://assets.coingecko.com/markets/images/52/large/binance.png',
        trust_score: 10,
        trust_score_rank: 1,
        trade_volume_24h_btc: 245000,
        trade_volume_24h_usd: 16500000000,
      },
      {
        id: 'coinbase_exchange',
        name: 'Coinbase Exchange',
        year_established: 2012,
        country: 'United States',
        description: 'Regulated US crypto exchange & institutional custodian.',
        url: 'https://coinbase.com',
        image: 'https://assets.coingecko.com/markets/images/23/large/Coinbase_Coin_Primary_Payoff_RGB.png',
        trust_score: 10,
        trust_score_rank: 2,
        trade_volume_24h_btc: 48000,
        trade_volume_24h_usd: 3230000000,
      },
      {
        id: 'bybit',
        name: 'Bybit',
        year_established: 2018,
        country: 'United Arab Emirates',
        description: 'Global crypto spot & derivatives exchange.',
        url: 'https://bybit.com',
        image: 'https://assets.coingecko.com/markets/images/698/large/bybit_spot.png',
        trust_score: 9,
        trust_score_rank: 3,
        trade_volume_24h_btc: 62000,
        trade_volume_24h_usd: 4180000000,
      },
      {
        id: 'okx',
        name: 'OKX',
        year_established: 2017,
        country: 'Seychelles',
        description: 'Leading Web3 & crypto derivatives ecosystem.',
        url: 'https://okx.com',
        image: 'https://assets.coingecko.com/markets/images/96/large/okx.png',
        trust_score: 9,
        trust_score_rank: 4,
        trade_volume_24h_btc: 58000,
        trade_volume_24h_usd: 3910000000,
      }
    ];
  },

  async getCategories(): Promise<CategoryData[]> {
    return [
      { id: 'layer-1', name: 'Layer 1 (L1)', market_cap: 1980000000000, market_cap_change_24h: 3.2, volume_24h: 68000000000, top_3_coins: ['bitcoin', 'ethereum', 'solana'] },
      { id: 'layer-2', name: 'Layer 2 (L2)', market_cap: 42000000000, market_cap_change_24h: 4.8, volume_24h: 3800000000, top_3_coins: ['arbitrum', 'optimism', 'polygon'] },
      { id: 'ai', name: 'Artificial Intelligence', market_cap: 28500000000, market_cap_change_24h: 7.4, volume_24h: 4100000000, top_3_coins: ['near', 'fet', 'render-token'] },
      { id: 'defi', name: 'DeFi Protocols', market_cap: 89000000000, market_cap_change_24h: 2.1, volume_24h: 7200000000, top_3_coins: ['uniswap', 'aave', 'maker'] },
      { id: 'meme', name: 'Meme Coins', market_cap: 54000000000, market_cap_change_24h: -1.8, volume_24h: 5900000000, top_3_coins: ['dogecoin', 'shiba-inu', 'pepe'] }
    ];
  },

  async getDeFiProtocols(): Promise<DeFiProtocolData[]> {
    return [
      { id: 'lido', name: 'Lido', symbol: 'LDO', category: 'Liquid Stacking', tvl: 28900000000, tvl_change_24h: 2.4, chain: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/13573/large/Lido_SFI.png' },
      { id: 'aave', name: 'Aave', symbol: 'AAVE', category: 'Lending', tvl: 12400000000, tvl_change_24h: 3.8, chain: 'Multi-Chain', logo: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png' },
      { id: 'eigenlayer', name: 'EigenLayer', symbol: 'EIGEN', category: 'Restaking', tvl: 14800000000, tvl_change_24h: 1.9, chain: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/36528/large/eigenlayer.png' },
      { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', category: 'DEX', tvl: 5800000000, tvl_change_24h: -0.8, chain: 'Multi-Chain', logo: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png' },
      { id: 'maker', name: 'Maker / Sky', symbol: 'MKR', category: 'CDP / Stablecoin', tvl: 7100000000, tvl_change_24h: 0.5, chain: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png' }
    ];
  },

  async getNFTCollections(): Promise<NFTCollectionData[]> {
    return [
      { id: 'pudgy-penguins', name: 'Pudgy Penguins', symbol: 'PPG', floor_price_eth: 11.45, floor_price_change_24h: 5.2, volume_24h_eth: 450, owners_count: 4820, image_url: 'https://i.seadn.io/gcs/files/b495208f237ef1d48d08593459c394c8.png?auto=format&dpr=1&w=384' },
      { id: 'bored-ape-yacht-club', name: 'Bored Ape Yacht Club', symbol: 'BAYC', floor_price_eth: 13.80, floor_price_change_24h: -2.1, volume_24h_eth: 620, owners_count: 5410, image_url: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctRvoCcSqNuEptPNtGrhMYbuDHbkMh conceptual.jpg?auto=format&dpr=1&w=384' },
      { id: 'cryptopunks', name: 'CryptoPunks', symbol: 'PUNK', floor_price_eth: 29.50, floor_price_change_24h: 1.1, volume_24h_eth: 890, owners_count: 3620, image_url: 'https://i.seadn.io/gae/BDxLifGl-kjE80-vde-y5bXcjzvyP8l_iZBD508c9q5zL0Z.png?auto=format&dpr=1&w=384' },
      { id: 'azuki', name: 'Azuki', symbol: 'AZUKI', floor_price_eth: 4.85, floor_price_change_24h: 3.4, volume_24h_eth: 280, owners_count: 4210, image_url: 'https://i.seadn.io/gae/H-0x_e_17ORnhWg952V収.png?auto=format&dpr=1&w=384' }
    ];
  }
};
