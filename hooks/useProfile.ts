import { fetchAll } from '@/db/db';
import { Profiles } from '@/db/schema'
import { useQuery } from '@tanstack/react-query';


interface UseProfileResult {
  profile: Profiles | null;
  loading: boolean;
  error: string | null;
}

const fetchProfile = async (userId: string | null): Promise<Profiles | null> => {
  if (!userId) return null;

  const profiles = await fetchAll('profiles');
  return profiles.find((p) => p.id === userId) || null;
};



/**
 * Custom hook to fetch the user profile data
 * @param userId - The ID of the user whose profile is to be fetched.
 */
export function useProfile(userId: string | null): UseProfileResult {
  const {
    data: profile = null,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId, // Only run the query if userId is provided
    staleTime: Infinity, // Prevent automatic refetching
  });

  return {
    profile,
    loading,
    error: isError ? (error as Error).message : null,
  };
}
