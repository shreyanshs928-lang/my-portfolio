import useSWR from 'swr';
import { fetchPortfolioData } from '../../firebase/firestore';

/**
 * Custom hook to fetch and cache portfolio data from Firestore via SWR.
 * Automatically handles deduping and revalidates every 5 minutes (300,000ms).
 */
export const usePortfolioData = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'firestore/portfolio',
    fetchPortfolioData,
    {
      revalidateOnFocus: false, // Prevents refetching when switching browser tabs
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache deduping interval: 5 minutes
      refreshInterval: 300000,  // Revalidate cache in background every 5 minutes
      errorRetryCount: 3
    }
  );

  return {
    portfolioData: data,
    error,
    isLoading,
    mutate
  };
};
