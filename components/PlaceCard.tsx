import React from 'react';
import { Image, Pressable } from 'react-native';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Place } from '@/types/place';

interface PlaceCardProps {
  place: Place;
  onPress?: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onPress }) => {
  return (
    <Pressable onPress={() => onPress?.(place)}>
      <Card className="dark w-full max-w-sm mb-4">
        <Image
          source={{ uri: place.image }}
          className="w-full h-40 rounded-t-lg"
          resizeMode="cover"
        />
        <CardHeader>
          <CardTitle>{place.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-row justify-between items-center pb-2">
          <Text className="text-sm text-gray-500">{place.category}</Text>
          <Text className="text-sm">⭐ {place.rating.toFixed(1)}</Text>
        </CardContent>
      </Card>
    </Pressable>
  );
};
