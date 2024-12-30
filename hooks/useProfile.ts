import { useEffect, useState } from 'react';
import { fetchAll } from '@/db/db';
import { Profiles } from '@/db/schema'

interface ProfileData {
  id: string;
  username: string;
  avatar_url: string;
  updated_at: string;
}

interface UseProfileResult {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch the user profile data from the database.
 * @param userId - The ID of the user whose profile is to be fetched.
 */
export function useProfile(userId: string | null): UseProfileResult {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const profiles = await fetchAll('profiles');
        const userProfile = profiles.find((p) => p.id === userId) || null;
        setProfile(userProfile);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  return { profile, loading, error };
}
