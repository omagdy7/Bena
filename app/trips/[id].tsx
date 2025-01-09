import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import TripStepCard from '@/components/TripStepCard';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

const TripTimeline = () => {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCompleteTrip = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status: 'completed' })
        .eq('trip_id', id);

      if (error) throw error;

      setTrip((prev: any) => ({
        ...prev,
        status: 'completed'
      }));

      Alert.alert('Success', 'Trip marked as completed!');
    } catch (error) {
      console.error('Error updating trip status:', error);
      Alert.alert('Error', 'Failed to update trip status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditStep = (stepId: string) => {
    router.push({
      pathname: '/editPlace',
      params: { tripId: id, stepId }
    });
  };

  const fetchTrip = async () => {
    try {
      // Fetch the trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('trip_id', id)
        .single();
      if (tripError) throw tripError;
      // Fetch the steps for the trip
      const { data: stepsData, error: stepsError } = await supabase
        .from('tripstep')
        .select('*')
        .eq('trip_id', id)
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
    }
  };
  fetchTrip();


  useFocusEffect(() => {
    fetchTrip();
  });

  if (!trip) return <Text>Loading...</Text>;

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="flex-row justify-between items-center px-4 py-3"
      >
        <Text className="text-white text-2xl font-bold">{trip.title}</Text>
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={handleCompleteTrip}
            disabled={isUpdating || trip.status === 'completed'}
          >
            <BlurView intensity={20} className="rounded-full p-2">
              <Ionicons
                name={trip.status === 'completed' ? "checkmark-circle" : "checkmark-circle-outline"}
                size={24}
                color={trip.status === 'completed' ? "#4CAF50" : "white"}
              />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity>
            <BlurView intensity={20} className="rounded-full p-2">
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </BlurView>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-1 px-4 pb-8">
          <View className="flex-1">
            {trip.steps.map((step, index) => (
              <View key={step.step_id} className="mb-4">
                <TripStepCard
                  step={step}
                  index={index}
                  onEdit={() => handleEditStep(step.step_id)}
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
