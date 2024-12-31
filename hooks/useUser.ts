import { Users } from '@/db/schema'
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';


interface UseProfileResult {
  profile: Users | null;
  loading: boolean;
  error: string | null;
}

const fetchUser = async (userId: string | null): Promise<Users | null> => {
  if (!userId) return null;
  const { data } = await supabase.from('users').select('*').eq('id', userId).single();
  return data
};



/**
 * Custom hook to fetch the user profile data
 * @param userId - The ID of the user whose profile is to be fetched.
 */
export function useUser(userId: string | null): UseProfileResult {
  const {
    data: profile = null,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Only run the query if userId is provided
    staleTime: Infinity, // Prevent automatic refetching
  });

  return {
    profile,
    loading,
    error: isError ? (error as Error).message : null,
  };
}
