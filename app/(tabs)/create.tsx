import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import CustomButton from '@/components/CustomButton';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Create = () => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleCreateTrip = () => {
    // TODO: Implement trip creation logic here
    console.log('Creating trip:', { tripName, destination, startDate, endDate });
    router.push('/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900 mb-32"> {/* the mb-32 because the of the navigation bar*/}
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-6 pt-6">
        <Animated.View entering={FadeInDown.duration(500).springify()}>
          <Text className="text-3xl font-bold text-white mb-8">Create Your Trip</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
          <Text className="text-white text-lg mb-2">Trip Name</Text>
          <TextInput
            className="bg-zinc-800 text-white px-4 py-3 rounded-lg mb-6"
            placeholder="Enter trip name"
            placeholderTextColor="#a1a1aa"
            value={tripName}
            onChangeText={setTripName}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500).springify()}>
          <Text className="text-white text-lg mb-2">Destination</Text>
          <TextInput
            className="bg-zinc-800 text-white px-4 py-3 rounded-lg mb-6"
            placeholder="Enter destination"
            placeholderTextColor="#a1a1aa"
            value={destination}
            onChangeText={setDestination}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500).springify()}>
          <Text className="text-white text-lg mb-2">Start Date</Text>
          <TouchableOpacity
            className="bg-zinc-800 px-4 py-3 rounded-lg mb-6 flex-row justify-between items-center"
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text className="text-white">{startDate.toDateString()}</Text>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500).springify()}>
          <Text className="text-white text-lg mb-2">End Date</Text>
          <TouchableOpacity
            className="bg-zinc-800 px-4 py-3 rounded-lg mb-6 flex-row justify-between items-center"
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text className="text-white">{endDate.toDateString()}</Text>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {(showStartDatePicker || showEndDatePicker) && (
          <DateTimePicker
            value={showStartDatePicker ? startDate : endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === 'set') {
                if (showStartDatePicker) {
                  setStartDate(selectedDate || startDate);
                  setShowStartDatePicker(false);
                } else {
                  setEndDate(selectedDate || endDate);
                  setShowEndDatePicker(false);
                }
              } else {
                setShowStartDatePicker(false);
                setShowEndDatePicker(false);
              }
            }}
          />
        )}

        <Animated.View
          className="flex-row justify-between mt-6"
          entering={FadeInDown.delay(500).duration(500).springify()}
        >
          <AnimatedTouchableOpacity
            className="bg-zinc-800 p-4 rounded-full"
            entering={FadeInRight.delay(600).duration(500).springify()}
            onPress={() => {/* TODO: Add logic for adding activities */ }}
          >
            <Ionicons name="add-outline" size={24} color="white" />
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity
            className="bg-zinc-800 p-4 rounded-full"
            entering={FadeInRight.delay(700).duration(500).springify()}
            onPress={() => {/* TODO:Add logic for inviting friends */ }}
          >
            <Ionicons name="people-outline" size={24} color="white" />
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity
            className="bg-zinc-800 p-4 rounded-full"
            entering={FadeInRight.delay(800).duration(500).springify()}
            onPress={() => {/* TODO:Add logic for setting budget */ }}
          >
            <Ionicons name="wallet-outline" size={24} color="white" />
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity
            className="bg-zinc-800 p-4 rounded-full"
            entering={FadeInRight.delay(900).duration(500).springify()}
            onPress={() => {/* TODO: Add logic for adding notes */ }}
          >
            <Ionicons name="document-text-outline" size={24} color="white" />
          </AnimatedTouchableOpacity>
        </Animated.View>
      </ScrollView>

      <Animated.View
        className="p-6"
        entering={FadeInDown.delay(1000).duration(500).springify()}
      >
        <CustomButton
          title="Create Trip"
          handlePress={handleCreateTrip}
          icon="airplane-outline"
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Create;


