import React, { useCallback, useState } from 'react';
import { View, RefreshControl, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import { Text } from '@/components/ui/text';
import { usePlaces } from '@/hooks/usePlaces';
import { useRouter } from 'expo-router';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const Home: React.FC = () => {
  const { categorizedPlaces, loading, error, refetch } = usePlaces();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handlePlacePress = (placeId: string) => {
    router.push(`/home/${placeId}`);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-zinc-900">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-900">
      <FlashList
        data={categorizedPlaces}
        keyExtractor={(item) => item[0]}
        renderItem={({ item: [category, categoryPlaces] }) => (
          <View key={category} className="mx-4 mb-8">
            <Text className="text-white text-2xl font-bold mb-4">
              {category
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Text>
            <CategoryCarousel
              places={categoryPlaces}
              onPlacePress={handlePlacePress}
            />
          </View>
        )}
        estimatedItemSize={50}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
            className="h-96 justify-end"
          >
            <LinearGradient
              colors={["transparent", "rgba(24, 24, 27, 0.8)", "#18181b"]}
              className="h-full justify-end pb-8 px-4"
            >
              <BlurView intensity={20} className="rounded-2xl p-4">
                <Text className="text-white text-3xl font-bold mt-4">
                  Discover Your Next Adventure
                </Text>
                <Text className="text-gray-300 text-lg mt-2">
                  Explore amazing destinations around the world
                </Text>
              </BlurView>
            </LinearGradient>
          </ImageBackground>
        }
      />
    </View>
  );
};

export default Home;
