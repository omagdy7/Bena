import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import RatingStars from './RatingStars';
import ProgressBar from './ProgressBar';
import { format } from 'date-fns';
import { TripStep, Place } from '@/db/schema';
import TimelineNode from './TimelineNode';
import { Button } from './ui/button';
import { icons } from '@/constants';

interface TripStepCardProps {
  step: TripStep & { place: Place };
  index: number;
  onEdit: () => void;
  isLast: boolean;
  totalSteps: number;
}

const TripStepCard: React.FC<TripStepCardProps> = ({
  step,
  index,
  onEdit,
  isLast,
  totalSteps
}) => {
  const progress = step.status === 'visited' ? 1 : step.status === 'pending' ? 0 : 0.5;

  return (
    <View className="flex-row">
      <View className="mr-4 h-full">
        <TimelineNode
          isCompleted={step.status === 'visited'}
          isActive={step.status === 'in_progress'}
          isLast={isLast}
        />
      </View>
      <Animated.View
        entering={FadeInRight.delay(index * 200).springify()}
        className="flex-1 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 mb-4"
      >
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg font-bold">{step.place.name}</Text>
            <TouchableOpacity
              onPress={onEdit}
              className="bg-zinc-800 p-2 rounded-full"
            >
              <Ionicons name="pencil" size={16} color="#fcbf49" />
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: step.place.image }}
            className="w-full h-48 rounded-lg mb-3"
            resizeMode="cover"
          />

          <View className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-secondary">Start Time: {format(step.start_time, 'h:mm a')}</Text>
              <Text className="text-secondary">End Time: {format(step.end_time, 'h:mm a')}</Text>
            </View>
            <ProgressBar progress={progress} index={index} />
          </View>

          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-zinc-400 mb-1">{step.place.address}</Text>
              <RatingStars rating={step.place.rating} />
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-zinc-800 px-3 py-1 rounded-full">
                <Text className="text-white">{step.place.city}</Text>
              </TouchableOpacity>
              <Button size='icon' variant={'ghost'} className='bg-zinc-800 px-3 py-1 rounded-full'>
                <Image className='color-white' source={icons.map_pinned}></Image>
              </Button>
              {/* <TouchableOpacity className="bg-zinc-800 px-3 py-1 rounded-full"> */}
              {/*   <Text className="text-white">Map</Text> */}
              {/* </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </Animated.View >
    </View >
  );
};

export default TripStepCard;

