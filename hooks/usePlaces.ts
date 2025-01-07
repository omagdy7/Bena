import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Place } from '@/db/schema';

// Define a type for the category data returned from the `category_counts` view
interface CategoryCount {
  category: string;
  count: number;
}

export type PlaceSubset = Pick<Place, 'places_id' | 'name' | 'category' | 'image' | 'description'>;

// Define a type for the grouped data (category with its places)
export interface CategoryGroup {
  category: string;
  places: PlaceSubset[];
}

// Define the return type of the `fetchPlaces` function
type FetchPlacesResult = CategoryGroup[];

// Fetch places and group them by category
const fetchPlaces = async (): Promise<FetchPlacesResult> => {
  // Get categories and their counts
  const { data: categoryData, error: categoryError } = await supabase
    .from('category_counts') // Query the view
    .select('category, count')
    .order('count', { ascending: false });

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  // Fetch places for each category in parallel
  const categoriesWithPlaces = await Promise.all(
    categoryData.map(async ({ category }) => {
      const { data: places, error: placesError } = await supabase
        .from('places')
        .select('places_id, name, category, image, description')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (placesError) {
        throw new Error(placesError.message);
      }

      return {
        category: category || 'Other', // Fallback for undefined categories
        places,
      };
    })
  );

  return categoriesWithPlaces;
};

// Define the return type of the `usePlaces` hook
export interface UsePlacesResult {
  categorizedPlaces: FetchPlacesResult;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<QueryObserverResult<FetchPlacesResult, Error>>;
}

// Custom hook to fetch and manage places data
export const usePlaces = (): UsePlacesResult => {
  const {
    data: categorizedPlaces = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<FetchPlacesResult>({
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
