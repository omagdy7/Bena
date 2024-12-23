import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Place } from '@/types/place';

interface CategoryGroup {
  category: string;
  places: Place[];
  count: number;
}

interface UsePlacesReturn {
  categorizedPlaces: [string, Place[]][];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePlaces = (): UsePlacesReturn => {
  const [categorizedPlaces, setCategorizedPlaces] = useState<[string, Place[]][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = async (): Promise<void> => {
    try {
      setLoading(true);

      // First, get categories and their counts using the view
      const { data: categoryData, error: categoryError } = await supabase
        .from('category_counts')  // Query the view
        .select('category, count')
        .order('count', { ascending: false });

      if (categoryError) throw categoryError;

      // Then fetch places for each category in parallel
      const categoriesWithPlaces = await Promise.all(
        categoryData.map(async ({ category }) => {
          const { data: places, error: placesError } = await supabase
            .from('places')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

          if (placesError) throw placesError;

          return [category || 'Other', places] as [string, Place[]];
        })
      );

      setCategorizedPlaces(categoriesWithPlaces);
    } catch (err) {
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

  return { categorizedPlaces, loading, error, refetch: fetchPlaces };
};
