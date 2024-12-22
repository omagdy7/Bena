import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Place } from '@/types/place';

interface UsePlacesReturn {
  places: Place[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePlaces = (): UsePlacesReturn => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });


      if (supabaseError) throw supabaseError;

      setPlaces(data as Place[]);
    } catch (err) {
      console.log("Hi from err")
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching places'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return { places, loading, error, refetch: fetchPlaces };
};
