import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { Text } from '@/components/ui/text';
import { Place } from '@/db/schema';
import { LinearGradient } from 'expo-linear-gradient';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface CategoryCarouselProps {
  places: Place[];
  onPlacePress: (placeId: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ places, onPlacePress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.Value(0)).current;
  const MAX_VISIBLE_DOTS = 5; // Maximum number of visible dots

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx }) => {
      position.setValue(dx);
    },
    onPanResponderRelease: (_, { dx }) => {
      const minSwipeDistance = 50;

      if (Math.abs(dx) > minSwipeDistance) {
        if (dx < 0 && currentIndex < places.length - 1) {
          // Swipe left
          setCurrentIndex(current => current + 1);
        } else if (dx > 0 && currentIndex > 0) {
          // Swipe right
          setCurrentIndex(current => current - 1);
        }
      }

      // Reset position with animation
      Animated.spring(position, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminate: () => {
      // Reset position if gesture is interrupted
      Animated.spring(position, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  const currentPlace = places[currentIndex];

  // Calculate which dots to show
  const generateVisibleDots = () => {
    if (places.length <= MAX_VISIBLE_DOTS) {
      return places.map((_, index) => index);
    }

    let start = currentIndex - Math.floor(MAX_VISIBLE_DOTS / 2);
    let end = currentIndex + Math.floor(MAX_VISIBLE_DOTS / 2);

    // Adjust start and end if they're out of bounds
    if (start < 0) {
      start = 0;
      end = MAX_VISIBLE_DOTS - 1;
    } else if (end >= places.length) {
      end = places.length - 1;
      start = places.length - MAX_VISIBLE_DOTS;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visibleDots = generateVisibleDots();

  return (
    <View className="px-4">
      <Animated.View
        style={{
          transform: [{ translateX: position }],
        }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={() => onPlacePress(currentPlace.places_id)}
          activeOpacity={0.9}
        >
          <View
            style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.2 }}
            className="rounded-3xl overflow-hidden"
          >
            <FastImage
              source={{
                uri: currentPlace.image,
                priority: FastImage.priority.normal,
              }}
              style={{ width: '100%', height: '100%' }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              className="absolute bottom-0 left-0 right-0 p-4"
            >
              <Text className="text-white text-xl font-bold">{currentPlace.name}</Text>
              <Text className="text-gray-300 mt-2" numberOfLines={2}>
                {currentPlace.description}
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Navigation dots */}
      <View className="flex-row justify-center mt-4 gap-7 space-x-1 items-center">
        {visibleDots.map((dotIndex) => (
          <View
            key={dotIndex}
            className={`h-2 rounded-full ${dotIndex === currentIndex ? 'w-4 bg-white' : 'w-2 bg-white/50'
              }`}
          />
        ))}
      </View>
    </View>
  );
};

export default CategoryCarousel;
