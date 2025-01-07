import { useRouter } from 'expo-router';
import CategoryCarousel from './CategoryCarousel';
import { useRecommendations } from '@/hooks/useRecommendations';
import { Animated, Text, View } from 'react-native';
import { RecommendationSkeleton } from './RecommendationSkeleton';
import { FadeInRight } from 'react-native-reanimated';

export default function RecommendationCarousel() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useRecommendations();

  const handlePlacePress = (placeId: string) => {
    router.push(`/home/${placeId}`);
  };

  if (isLoading) {
    return <RecommendationSkeleton />;
  }

  if (isError) {
    return (
      <View className="p-4">
        <Text className="text-red-500">
          {error?.message || 'Failed to load recommendations'}
        </Text>
      </View>
    );
  }

  if (!data?.recommendations?.length) {
    return null; // Or render a "No recommendations" message
  }

  return (
    <Animated.View
      entering={FadeInRight.delay(200).springify()}
      className="mx-4 mb-8 mt-8"
    >
      <Text className="text-white text-2xl font-bold mb-4">
        Recommended for You
      </Text>
      <CategoryCarousel
        places={data.recommendations}
        onPlacePress={handlePlacePress}
      />
    </Animated.View>
  );
}
