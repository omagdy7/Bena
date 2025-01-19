import { useQuery } from '@tanstack/react-query';
import { Place } from '@/db/schema';
import { useAuthCheck } from '@/hooks/useAuthCheck';

interface SearchPlaceResponse {
  places: Place[];
}

export const useSearchPlace = () => {
    const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;
    const SEARCH_PLACE_ROUTE = process.env.EXPO_PUBLIC_SEARCH_PLACE_ROUTE;
    
    const getSearchedPlaces = async (searchText: string) => {
        if (!searchText) {
        return [];
        }
        const API_URL = `${SERVER_URL}/${SEARCH_PLACE_ROUTE}/${searchText}`;
        const response = await fetch(API_URL);
        if (!response.ok) {
        throw new Error('Failed to fetch places');
        }
        return response.json();
    };

    const { data, isLoading, isError, error, refetch } = useQuery<SearchPlaceResponse, Error>({
        queryKey: ['searchedPlaces'],
        queryFn: async () => {
        const response = await fetch(`${SERVER_URL}/${SEARCH_PLACE_ROUTE}/p`);
        if (!response.ok) {
            throw new Error('Failed to fetch places');
        }
        return response.json();
        },
    });

    return { getPlaces: getSearchedPlaces, places: data?.places ?? [], loading: isLoading, isError, error, refetch };
};