import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Place } from '@/db/schema';

interface CategoryGroup {
  category: string;
  places: Place[];
  count: number;
}

const fetchPlaces = async (): Promise<[string, Place[]][]> => {
  // Get categories and their counts
  const { data: categoryData, error: categoryError } = await supabase
    .from('category_counts') // Query the view
    .select('category, count')
    .order('count', { ascending: false });

  if (categoryError) throw new Error(categoryError.message);

  // Fetch places for each category in parallel
  const categoriesWithPlaces = await Promise.all(
    categoryData.map(async ({ category }) => {
      const { data: places, error: placesError } = await supabase
        .from('places')
        .select('places_id, name, category, image')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (placesError) throw new Error(placesError.message);

      return [category || 'Other', places] as [string, Place[]];
    })
  );

  return categoriesWithPlaces;
};

export const usePlaces = () => {
  const {
    data: categorizedPlaces = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['places'], // The unique key for caching and identification
    queryFn: fetchPlaces, // The function to fetch data
    staleTime: Infinity, // Never refetch automatically
  });

  return {
    categorizedPlaces,
    loading,
    error: isError ? (error as Error).message : null,
    refetch,
  };
};
