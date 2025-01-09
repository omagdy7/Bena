import { useQuery } from '@tanstack/react-query';
import { Place } from '@/db/schema';
import { useAuthCheck } from '@/hooks/useAuthCheck';

interface RecommendationResponse {
  recommendations: Place[];
}

export const useRecommendations = () => {
  const user = useAuthCheck();
  const RECOMMENDATION_ENDPOINT = process.env.EXPO_PUBLIC_RECOMMENDATION_MODEL_ENDPOINT;

  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<RecommendationResponse, Error>({
    queryKey: ['recommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      const response = await fetch(`${RECOMMENDATION_ENDPOINT}/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return response.json();
    },
  });

  return {
    recommendations: data?.recommendations ?? [],
    loading,
    error: isError ? error.message : null,
    refetch,
  };
};
