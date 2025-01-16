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
import { StatusBar } from 'expo-status-bar';
import useAllTrips from '@/hooks/useAllTrips';


const TripTimeline = () => {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ status, setStatus ] = useState<'in_progress' | 'planned' | 'completed'>('in_progress');
  const [isCompleted, setIsCompleted] = useState(false);
  const { markAsCompleted, markAsPlanned, deleteTrip }= useAllTrips();

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

  const handleSwitchToCompleted = async () => {
      setIsCompleted(true);
      setLoading(true);
      await markAsCompleted(trip.trip_id);
      setTrip(null);
      // await fetchInProgressTrip();
      router.push('/mytrips');
      setIsCompleted(false);
  
    };
  
    const handleSwitchToPlanned = async () => {
      setIsCompleted(true);
      setLoading(true);
      await markAsPlanned(trip.trip_id);
      setTrip(null);
      // await fetchInProgressTrip();
      router.push('/mytrips');
      setIsCompleted(false);
    };
  
      const handleDeleteTrip = async () => {
        Alert.alert(
            'Delete Trip',
            'Are you sure you want to delete this trip?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    setIsCompleted(true);
                    await deleteTrip(trip.trip_id);
                    setLoading(true);
                    setTrip(null);
                    // await fetchInProgressTrip();
                    setIsCompleted(false);
                  if (error) {
                    Alert.alert('Error', error.message);
                  } else {
                    await fetchTrip();
                  }
                },
              },
            ],
            { cancelable: true }
          );
      };
  
      const handleShareTrip = async () => {
        // TODO: Implement share trip functionality
      };
  
      const handleOpenOnMaps = async () => {
        // TODO: Implement open on maps functionality 
      }
  


  if (!trip) return <Text>Loading...</Text>;

  return (
    <SafeAreaView className="flex-1 bg-zinc-900 pt-2">
      <StatusBar style="light"/>
      <View className="flex-row items-center mb-4 justify-between">
              <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()}
              className=" p-2 rounded-full px-6"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-row items-center px-4">
                  <Animated.Text
                  entering={FadeInDown.duration(500).springify()}
                  className="text-3xl font-bold text-white "
                  >
                      <Text className="text-3xl font-bold text-white text-white">{trip.title}</Text>
                  </Animated.Text>
              </View>
                <View className="flex-row items-center ">
              </View>
              </View>
      
              <View className="flex-row items-center px-4">
                  <Animated.Text
                  entering={FadeInDown.duration(500).springify()}
                  className="text-3xl font-bold text-white"
                  >
                    <TouchableOpacity onPress={handleShareTrip} className="px-4">
                      <Ionicons name="share-outline" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteTrip} className="px-4">
                      <Ionicons name="trash-outline" size={20} color="white" />
                    </TouchableOpacity>
      
                  </Animated.Text>
              </View>
          </View>
          <View className="flex-row items-center justify-between px-2 pb-4">
            <TouchableOpacity
              style={{ width: 120 }}
              onPress={trip.status === 'in_progress' ? handleSwitchToPlanned : handleSwitchToCompleted}
              className={`p-2 mt-2 rounded-xl  flex-row items-center justify-center mr-1 ${trip.status === 'in_progress' ? 'bg-gray-400' : trip.status === 'completed' ? 'bg-blue-400' : 'bg-green-400'}`}>
              <Ionicons
                  name={trip.status === 'in_progress' ? 'pause-circle-outline' : trip.status === 'completed' ? 'refresh' : 'play'}
                  size={18}
                  color="black"
              />
              <Text className="ml-1 text-sm font-bold text-black">{trip.status === 'in_progress' ? 'Hold For Later' : trip.status === 'completed' ? 'Restart Trip' : 'Mark As Active'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 120 }}
              onPress={handleSwitchToPlanned}
              className={`p-2 mt-2 rounded-xl flex-row items-center justify-center mx-1 ${trip.status === 'completed' ? 'bg-[#fcbf49]' : 'bg-zinc-400'}`}>
              <Ionicons
                  name={trip.status === 'completed' ? 'checkmark-done-circle' : 'checkmark-done-circle-outline'}
                  size={18}
                  color="black"
              />
              <Text className="ml-1 text-sm font-bold text-black">{trip.status === 'completed' ? 'Completed' : 'Mark As Completed'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 120 }}
              onPress={handleOpenOnMaps}
              className={`p-2 mt-2 rounded-xl  flex-row items-center justify-center bg-blue-400 ml-1`}>
              <Ionicons
                  name='navigate-circle-outline'
                  size={18}
                  color="black"
              />
              <Text className="ml-1 text-sm font-bold text-black">Open On Maps</Text>
            </TouchableOpacity>
          </View>
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
