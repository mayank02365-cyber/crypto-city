import { useQuery } from '@tanstack/react-query';
import { cryptoApi } from '../services/cryptoApi';

export function useGlobalMarketStats() {
  return useQuery({
    queryKey: ['globalStats'],
    queryFn: () => cryptoApi.getGlobalMarketStats(),
    refetchInterval: 30000,
  });
}

export function useTopCoins(page = 1, perPage = 25, category?: string) {
  return useQuery({
    queryKey: ['topCoins', page, perPage, category],
    queryFn: () => cryptoApi.getTopCoins(page, perPage, category),
    refetchInterval: 30000,
  });
}

export function useCoinDetails(coinId: string) {
  return useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: () => cryptoApi.getCoinDetails(coinId),
    enabled: Boolean(coinId),
    refetchInterval: 60000,
  });
}

export function useCoinChartData(coinId: string, timeframe: string = '7D') {
  const daysMap: Record<string, string | number> = {
    '1H': '0.04',
    '24H': '1',
    '7D': '7',
    '30D': '30',
    '90D': '90',
    '1Y': '365',
    'ALL': 'max',
  };
  const days = daysMap[timeframe] || '7';

  return useQuery({
    queryKey: ['coinChart', coinId, timeframe],
    queryFn: () => cryptoApi.getCoinChartData(coinId, days),
    enabled: Boolean(coinId),
  });
}

export function useFearAndGreed() {
  return useQuery({
    queryKey: ['fearAndGreed'],
    queryFn: () => cryptoApi.getFearAndGreed(),
    refetchInterval: 300000,
  });
}

export function useCryptoNews() {
  return useQuery({
    queryKey: ['cryptoNews'],
    queryFn: () => cryptoApi.getCryptoNews(),
  });
}

export function useExchanges() {
  return useQuery({
    queryKey: ['exchanges'],
    queryFn: () => cryptoApi.getExchanges(),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => cryptoApi.getCategories(),
  });
}

export function useDeFiProtocols() {
  return useQuery({
    queryKey: ['defiProtocols'],
    queryFn: () => cryptoApi.getDeFiProtocols(),
  });
}

export function useNFTCollections() {
  return useQuery({
    queryKey: ['nftCollections'],
    queryFn: () => cryptoApi.getNFTCollections(),
  });
}
