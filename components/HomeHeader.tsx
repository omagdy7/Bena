import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { icons } from '@/constants';

export const HomeHeader: React.FC = () => (
  <View className="px-4 pt-12 pb-6 mt-6 bg-zinc-950">
    <View className="flex-row items-center mb-2">
      <Image source={icons.map_pin} resizeMode='contain' className="w-6 h-6" />
      <Text className="text-2xl font-bold ml-2 text-white">Bena</Text>
    </View>
    <Text className="text-3xl font-bold text-white mb-2">
      Discover Wonders
    </Text>
    <Text className="text-gray-400 text-lg">
      Explore endless possibilities in every corner
    </Text>
  </View>
);
