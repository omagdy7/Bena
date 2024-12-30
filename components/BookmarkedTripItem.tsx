import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';

interface BookmarkedTripItemProps {
  item: {
    id: string;
    name: string;
    image: string;
    date: string;
  };
  index: number;
  onRemoveBookmark: (id: string) => void;
}

const { width, height } = Dimensions.get('window');

const BookmarkedTripItem: React.FC<BookmarkedTripItemProps> = ({ item, index, onRemoveBookmark }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      className="bg-zinc-800 rounded-xl overflow-hidden mb-4"
    >
      <FastImage
        source={{ uri: item.image }}
        style={{ width: width, height: 0.2 * height }}
        resizeMode={FastImage.resizeMode.cover}
        accessibilityLabel={`Image of ${item.name}`}
      />
      <View className="p-4">
        <Text className="text-white text-xl font-bold mb-2">{item.name}</Text>
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={16} color="#a1a1aa" />
          <Text className="text-zinc-400 ml-2">{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity
        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2"
        onPress={() => onRemoveBookmark(item.id)}
        accessibilityLabel={`Remove ${item.name} from bookmarks`}
      >
        <Ionicons name="bookmark" size={24} color="#fcbf49" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default BookmarkedTripItem;


