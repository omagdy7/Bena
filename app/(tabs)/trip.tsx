import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import TripStepCard from '@/components/TripStepCard';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// TODO: replace with actual data fetching from database
const mockTrip = {
  trip_id: '1',
  title: 'Weekend in Giza',
  steps: [
    {
      step_id: '1',
      status: 'visited',
      start_time: new Date('2024-01-01T14:00:00'),
      end_time: new Date('2024-01-01T16:00:00'),
      place: {
        places_id: '1',
        name: 'Greate Pyriamds',
        description: '',
        address: '7th Pyraimd St.',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1541769740-098e80269166?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        city: 'Giza',
      },
    },
    {
      step_id: '2',
      status: 'in_progress',
      start_time: new Date('2024-01-01T16:30:00'),
      end_time: new Date('2024-01-01T18:30:00'),
      place: {
        places_id: '2',
        name: 'Sphinx',
        description: '',
        address: 'Faisal 7th St',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1566288623500-66fdb0f40fa6?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        city: 'Giza',
      },
    },
    {
      step_id: '3',
      status: 'pending',
      start_time: new Date('2024-01-01T19:00:00'),
      end_time: new Date('2024-01-01T21:00:00'),
      place: {
        places_id: '3',
        name: 'Egyptian Musuem',
        description: '',
        address: 'Tahrir St.4',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1710211288826-b7df3ab71588?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        city: 'Cairo',
      },
    },
  ],
};

const TripTimeline = () => {
  // const { id } = useLocalSearchParams();
  const id = '1'

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

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {mockTrip.steps.map((step, index) => (
          <TripStepCard
            key={step.step_id}
            step={step}
            index={index}
            onEdit={() => console.log('Edit step:', step.step_id)}
            isLast={index === mockTrip.steps.length - 1}
            totalSteps={mockTrip.steps.length}
          />
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};
export default TripTimeline;

