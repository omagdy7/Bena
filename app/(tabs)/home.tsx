import React, { useCallback, useState } from 'react';
import { View, RefreshControl, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { usePlaces } from '@/hooks/usePlaces';
import { useRouter } from 'expo-router';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeInRight,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import CustomSuspense from '@/components/CustomSuspense';
import HomeSkeleton from '@/components/HomeSkeleton';
import RecommendationCarousel from '@/components/RecommendationCarousel';
import { UsePlacesResult } from '@/hooks/usePlaces';
import { PlaceSubset } from '@/hooks/usePlaces';
import { Hero } from '@/components/Hero';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const HomeContent: React.FC = () => {
  const { categorizedPlaces, error, refetch }: UsePlacesResult = usePlaces();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();
  const scrollY = useSharedValue(0);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handlePlacePress = (placeId: string) => {
    router.push(`/home/${placeId}`);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-zinc-900">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  const renderListHeader = () => (
    <>
      <Hero />
      <RecommendationCarousel />
    </>
  );

  return (
    <View className="flex-1 bg-zinc-900">

      <AnimatedFlashList
        data={categorizedPlaces}
        keyExtractor={(item: unknown, _: number) => {
          const [category] = item as [string, PlaceSubset[]]; // Type assertion
          return category;
        }}
        renderItem={(info: { item: unknown; index: number }) => {
          const [category, categoryPlaces] = info.item as [string, PlaceSubset[]]; // Type assertion
          return (
            <Animated.View
              entering={FadeInRight.delay(info.index * 100).springify()}
              className="mx-4 mb-8"
            >
              <Text className="text-white text-2xl font-bold mb-4">
                {category
                  .split('_')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Explicitly type `word`
                  .join(' ')}
              </Text>
              <CategoryCarousel
                places={categoryPlaces}
                onPlacePress={handlePlacePress}
              />
            </Animated.View>
          );
        }}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={renderListHeader}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <Animated.View
        className="absolute top-12 left-4 right-4 flex-row justify-between items-center"
        style={headerAnimatedStyle}
      >
        <BlurView intensity={80} className="rounded-full p-2">
          <Ionicons name="menu" size={24} color="white" />
        </BlurView>
        <BlurView intensity={80} className="rounded-full p-2">
          <Ionicons name="search" size={24} color="white" />
        </BlurView>
      </Animated.View>
    </View>
  );
};

const Home: React.FC = () => {
  return (
    <CustomSuspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </CustomSuspense>
  );
};

export default Home;
