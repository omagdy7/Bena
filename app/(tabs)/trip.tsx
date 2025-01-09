import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import TripStepCard from '@/components/TripStepCard';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

const TripTimeline = () => {
  const user = useAuthCheck();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInProgressTrip = async () => {
      if (!user) return;

      try {
        // Fetch the trip with status 'in_progress' for the current user
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'in_progress')
          .single();

        if (tripError && tripError.code !== 'PGRST116') throw tripError; // PGRST116 means no rows found

        if (!tripData) {
          setTrip(null);
          return;
        }

        // Fetch the steps for the trip
        const { data: stepsData, error: stepsError } = await supabase
          .from('tripstep')
          .select('*')
          .eq('trip_id', tripData.trip_id)
          .order('step_num', { ascending: true });

        if (stepsError) throw stepsError;

        // Fetch places for each step
        const stepsWithPlaces = await Promise.all(
          stepsData.map(async (step) => {
            const { data: placeData, error: placeError } = await supabase
              .from('places')
              .select('*')
              .eq('places_id', step.place_id)
              .single();

            if (placeError) throw placeError;

            return {
              ...step,
              place: placeData,
            };
          })
        );

        // Construct the trip object
        const constructedTrip = {
          ...tripData,
          steps: stepsWithPlaces,
        };

        setTrip(constructedTrip);
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressTrip();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-900 justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-900 justify-center items-center">
        <Text className="text-white text-lg mb-4">No ongoing trips found.</Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.replace('/create')}
        >
          <Text className="text-white">Create a New Trip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="flex-row justify-between items-center px-4 py-3"
      >
        <Text className="text-white text-2xl font-bold">{trip.title}</Text>
        <TouchableOpacity>
          <BlurView intensity={20} className="rounded-full p-2">
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {trip.steps.map((step, index) => (
          <TripStepCard
            key={step.step_id}
            step={step}
            index={index}
            onEdit={() => console.log('Edit step:', step.step_id)}
            isLast={index === trip.steps.length - 1}
            totalSteps={trip.steps.length}
          />
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripTimeline;
