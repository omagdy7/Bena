import React from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { PlaceCard } from '@/components/PlaceCard';
import { usePlaces } from '@/hooks/usePlaces';
import { useRouter } from 'expo-router';

const Home: React.FC = () => {
  const { places, loading, error, refetch } = usePlaces();
  const [refreshing, setRefreshing] = React.useState<boolean>(false);


  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const router = useRouter();

  const handlePlacePress = (placeId: string) => {
    router.push(`/home/${placeId}`);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-700 items-center justify-center">
      <FlatList
        data={places}
        keyExtractor={(item) => item.places_id.toString()}
        renderItem={({ item }) => (
          <View className="px-4">
            <PlaceCard place={item} onPress={() => handlePlacePress(item.places_id)} />
          </View>
        )}
        contentContainerClassName="py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

export default Home;
