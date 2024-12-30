import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import TimelineNode from '@/components/TimelineNode';
import TripStepCard from '@/components/TripStepCard';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock data - replace with actual data fetching
const mockTrip = {
  trip_id: '1',
  title: 'Weekend in Paris',
  steps: [
    {
      step_id: '1',
      status: 'visited',
      start_time: new Date('2024-01-01T14:00:00'),
      end_time: new Date('2024-01-01T16:00:00'),
      place: {
        places_id: '1',
        name: 'Eiffel Tower',
        description: 'Iconic iron tower',
        address: '7th arrondissement, Paris',
        rating: 4.5,
        image: 'https://source.unsplash.com/featured/?eiffeltower',
        city: 'Paris',
      },
    },
    {
      step_id: '2',
      status: 'in_progress',
      start_time: new Date('2024-01-01T16:30:00'),
      end_time: new Date('2024-01-01T18:30:00'),
      place: {
        places_id: '2',
        name: 'Louvre Museum',
        description: 'World famous art museum',
        address: 'Rue de Rivoli, Paris',
        rating: 5,
        image: 'https://source.unsplash.com/featured/?louvre',
        city: 'Paris',
      },
    },
    {
      step_id: '3',
      status: 'pending',
      start_time: new Date('2024-01-01T19:00:00'),
      end_time: new Date('2024-01-01T21:00:00'),
      place: {
        places_id: '3',
        name: 'Notre-Dame Cathedral',
        description: 'Medieval Catholic cathedral',
        address: 'Île de la Cité, Paris',
        rating: 4.8,
        image: 'https://source.unsplash.com/featured/?notredame',
        city: 'Paris',
      },
    },
  ],
};

const TripTimeline = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="flex-row justify-between items-center px-4 py-3"
      >
        <Text className="text-white text-2xl font-bold">{mockTrip.title}</Text>
        <TouchableOpacity>
          <BlurView intensity={20} className="rounded-full p-2">
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-1 px-4 pb-8">
          <View className="mr-4">
            {mockTrip.steps.map((step, index) => (
              <TimelineNode
                key={step.step_id}
                isCompleted={step.status === 'visited'}
                isActive={step.status === 'in_progress'}
                isLast={index === mockTrip.steps.length - 1}
              />
            ))}
          </View>
          <View className="flex-1">
            {mockTrip.steps.map((step, index) => (
              <View key={step.step_id} className="mb-4">
                <TripStepCard
                  step={step}
                  index={index}
                  onEdit={() => console.log('Edit step:', step.step_id)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripTimeline;

