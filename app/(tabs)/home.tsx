import React, { useCallback, useState } from 'react';
import { View, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { usePlaces } from '@/hooks/usePlaces';
import { useRouter } from 'expo-router';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import CustomSuspense from '@/components/CustomSuspense';
import HomeSkeleton from '@/components/HomeSkeleton';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const HomeContent: React.FC = () => {
  const { categorizedPlaces, loading, error, refetch } = usePlaces();
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

  return (
    <View className="flex-1 bg-zinc-900">
      <AnimatedFlashList
        data={categorizedPlaces}
        keyExtractor={(item) => item[0]}
        renderItem={({ item: [category, categoryPlaces], index }) => (
          <Animated.View
            entering={FadeInRight.delay(index * 100).springify()}
            className="mx-4 mb-8"
          >
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
          </Animated.View>
        )}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <Animated.View style={{ height: HEADER_HEIGHT }}>
            <FastImage
              source={{ uri: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
              style={{ width, height: HEADER_HEIGHT }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <LinearGradient
              colors={["transparent", "rgba(24, 24, 27, 0.8)", "#18181b"]}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: HEADER_HEIGHT }}
            >
              <BlurView intensity={20} style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}>
                <Animated.Text
                  entering={FadeInDown.delay(300).springify()}
                  className="text-white text-4xl font-bold"
                >
                  Discover Your Next Adventure
                </Animated.Text>
                <Animated.Text
                  entering={FadeInDown.delay(400).springify()}
                  className="text-gray-300 text-xl mt-2"
                >
                  Explore amazing destinations around the world
                </Animated.Text>
                <Animated.View
                  entering={FadeInDown.delay(500).springify()}
                  className="flex-row mt-4"
                >
                  <TouchableOpacity className="bg-secondary py-3 px-6 rounded-full mr-4">
                    <Text className="text-zinc-900 font-bold">Explore Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-zinc-800 py-3 px-6 rounded-full">
                    <Text className="text-white font-bold">Learn More</Text>
                  </TouchableOpacity>
                </Animated.View>
              </BlurView>
            </LinearGradient>
          </Animated.View>
        }
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
