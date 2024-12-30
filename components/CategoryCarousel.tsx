import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Place } from '@/db/schema';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

interface CategoryCarouselProps {
  places: Place[];
  onPlacePress: (placeId: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ places, onPlacePress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 20 }}
    >
      {places.map((place) => (
        <TouchableOpacity
          key={place.places_id}
          onPress={() => onPlacePress(place.places_id)}
          className="mr-4"
        >
          <View style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.2 }} className="rounded-3xl overflow-hidden">
            <Image
              source={{ uri: place.image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              className="absolute bottom-0 left-0 right-0 p-4"
            >
              <Text className="text-white text-xl font-bold">{place?.name}</Text>
              <Text className="text-gray-300 mt-2" numberOfLines={2}>
                {place?.description}
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
