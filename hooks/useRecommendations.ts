import { useQuery } from '@tanstack/react-query';
import { Place } from '@/db/schema';
import { useAuthCheck } from '@/hooks/useAuthCheck';

interface RecommendationResponse {
  recommendations: Place[];
}

export const useRecommendations = () => {
  const user = useAuthCheck();
  const RECOMMENDATION_ENDPOINT = process.env['RECOMMENDATION_MODEL_ENDPOINT'];

  return useQuery<RecommendationResponse, Error>({
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
    enabled: !!user?.id, // Only run query if we have a user ID
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};
