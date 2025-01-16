import React from 'react';
import { View, TouchableOpacity, Image, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import RatingStars from './RatingStars';
import ProgressBar from './ProgressBar';
import { format } from 'date-fns';
import { TripStep, Place } from '@/db/schema';
import TimelineNode from './TimelineNode';
import { Button } from './ui/button';
import { MapPinned } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import useAllTrips from '@/hooks/useAllTrips';
import { useState } from 'react';






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
  totalSteps,
  isSelected,
  onStepSelect, // New prop
}) => {

  const { markAsVisited, markAsPending, deleteStep} = useAllTrips();
  const [ isSelectedToSwap, setIsSelectedToSwap ] = useState(false);

  const handleOnMapPress = () => {
    Linking.openURL(step.place.external_link!);

  }

  const handleMarkAsDone = async () => {
    markAsVisited(step.step_id);
  }

  const handleMarkAsPending = async () => {
    markAsPending(step.step_id);
  }

  const handleDeleteStep = async () => {
    deleteStep(step.step_id);
  }

  const handleSelectedToSwap = async () => {
    onStepSelect(step.step_id);
    setIsSelectedToSwap(!isSelectedToSwap);
  }


  const progress = step.status === 'visited' ? 1 : step.status === 'pending' ? 0 : 0.5;

  return (
    <TouchableOpacity onPress={() => router.push(`/home/${step.place.places_id}`) } className="">
    <View className="flex-row">
      <View className="mr-4 h-full">
        <TimelineNode
          style={{
            backgroundColor: step.status === 'visited' ? 'green' : step.status === 'in_progress' ? 'orange' : 'gray',
            color: step.status === 'visited' || step.status === 'in_progress' ? 'white' : 'black',
          }}
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
          <View className="flex-row justify-between items-center gap-2">
            <Text className="text-white text-lg font-bold">
            {step.place.name.length > 20 ? `${step.place.name.slice(0, 30)}...` : step.place.name}
            </Text>
            <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleDeleteStep}
              className=" p-1 rounded-full flex-row items-center gap-1"
            >
              
              <Ionicons name="trash" size={12} color="#fcbf49" />
              <Text className="text-[#fcbf49] text-xs">Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onEdit}
              className=" p-1 rounded-full flex-row items-center gap-1"
            >
              
              <Ionicons name="pencil" size={12} color="#fcbf49" />
              <Text className="text-[#fcbf49] text-xs">Edit</Text>
            </TouchableOpacity>
          </View>
          </View>
          <TouchableOpacity className="flex-row items-center bg-zinc-800 px-2 py-1 rounded-full my-2">
                <Ionicons name="location-outline" size={10} color="#fcbf49" />
                <Text className="text-white text-sm px-1">{step.place.city}</Text>
              </TouchableOpacity>

          <Image
            source={{ uri: step.place.image }}
            className="w-full h-48 rounded-lg mb-3"
            resizeMode="cover"
          />

          <View className="mb-1">
            <View className="flex-row justify-between mb-1">
              {/* <Text className="text-secondary">Start Time: {format(step.start_time, 'h:mm a')}</Text>
              <Text className="text-secondary">End Time: {format(step.end_time, 'h:mm a')}</Text> */}
            </View>
          </View>

          <View className="">
            <View className="flex-row gap-flex-row justify-between items-center">
              <TouchableOpacity onPress={handleOnMapPress} className="flex-row items-center bg-zinc-800 px-3 py-2 rounded-full">
                <Ionicons name="map-outline" size={16} color="#fcbf49" />
                <Text className="text-white text-sm px-1 text-[#fcbf49]">Open On Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSelectedToSwap} className={`flex-row items-center px-3 py-2 rounded-full ${isSelected ? 'bg-[#fcbf49]' : 'bg-zinc-800'}`}>
                <Ionicons name="swap-vertical-outline" size={16} color={isSelected ? '#18181b' : '#fcbf49'} />
                <Text className={`text-white text-sm px-1 text-[${isSelected ? '#18181b' : '#fcbf49'}]`}>Swap Order</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={step.status === 'visited' ? handleMarkAsPending : handleMarkAsDone} className="flex-row items-center bg-zinc-800 px-3 py-2 rounded-full">
                <Ionicons name={step.status === 'visited' ? "return-up-back-outline" : "checkmark-done-circle-outline"} size={16} color="#fcbf49" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View >
    </View >
    </TouchableOpacity>
  );
};

export default TripStepCard;

