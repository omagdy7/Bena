import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import CustomButton from '@/components/CustomButton';
import { BlurView } from 'expo-blur';
import { TripStep, Place } from '@/db/schema';
import { supabase } from '@/lib/supabase';
import { useAuthCheck } from '@/hooks/useAuthCheck';


const CreateTrip: React.FC = () => {
  const params = useLocalSearchParams();
  const user = useAuthCheck()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [steps, setSteps] = useState<(Partial<TripStep> & { place?: Place })[]>([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStepStartTimePicker, setShowStepStartTimePicker] = useState(false);
  const [showStepEndTimePicker, setShowStepEndTimePicker] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [loading, setLoading] = useState(false);  // New state to track loading status
  const [isEmptyFields, setIsEmptyFields] = useState(false);  // New state to track loading status



  useEffect(() => {
    if (params.selectedPlaces) {
      const selectedPlaces = JSON.parse(params.selectedPlaces as string) as Place[];
      const newSteps = selectedPlaces.map((place, index) => ({
        step_num: steps.length + index + 1,
        place_id: place.places_id,
        place: place,
        start_time: new Date(),
        end_time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
        status: 'pending' as const
      }));
      setSteps([...steps, ...newSteps]);
    }
  }, [params.selectedPlaces]);

  const addSteps = () => {
    router.push('/choosePlace');
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof TripStep, value: any) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      if (showStartDatePicker) {
        setStartDate(selectedDate);
        if (selectedDate > endDate) {
          setEndDate(selectedDate);  // Automatically update end date if it's before start date
        }
        setShowStartDatePicker(false);
      } else if (showEndDatePicker) {
        if (selectedDate >= startDate) {
          setEndDate(selectedDate);
        } else {
          // Handle case where end date is before start date
          alert('End date cannot be before start date.');
        }
        setShowEndDatePicker(false);
      } else if (showStepStartTimePicker) {
        updateStep(activeStepIndex, 'start_time', selectedDate);
        setShowStepStartTimePicker(false);
      } else if (showStepEndTimePicker) {
        updateStep(activeStepIndex, 'end_time', selectedDate);
        setShowStepEndTimePicker(false);
      }
    } else {
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);
      setShowStepStartTimePicker(false);
      setShowStepEndTimePicker(false);
    }
  };


  const handleCreateTrip = async () => {
    if (steps.length === 0) {
      setIsEmptyFields(true);
      return;
    }
    setLoading(true);
    const tripData = {
      title,
      description,
      user_id: user?.id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'in_progress',
    };
  
    try {
      // Insert the trip into the 'trip' table
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert([tripData])
        .select('trip_id')
        .single();
  
      if (tripError) throw tripError;
  
      // Insert each step into the 'trip_step' table
      const stepsData = steps.map((step, index) => ({
        trip_id: trip.trip_id,
        step_num: step.step_num,
        place_id: step.place_id,
        start_time: step.start_time.toISOString(),
        end_time: step.end_time.toISOString(),
        status: index === 0 ? 'in_progress' : 'pending', // First step is 'in_progress', others are 'pending'
      }));
  
      const { error: stepsError } = await supabase.from('tripstep').insert(stepsData);
  
      if (stepsError) throw stepsError;
  
      console.log('Trip created successfully:', trip);
  
      // Reset inputs after successful creation
      setTitle('');
      setDescription('');
      setStartDate(new Date());
      setEndDate(new Date());
      setSteps([]);
      // set the isEmptyFields to false
      setIsEmptyFields(false);
  
      // Show success message
      setSuccessMessageVisible(true);
      setTimeout(() => setSuccessMessageVisible(false), 3000); // Hide after 3 seconds

    } catch (error) {
      console.error('Error creating trip:', error);
      alert('An error occurred while creating the trip. Please try again.');
    } finally {
      setLoading(false); // Set loading to false once the creation process is complete
    }
  };
  
  // Calculate the trip duration in days
  const getTripDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 3600 * 24)); // Convert milliseconds to days
  };

  const tripDuration = getTripDuration(startDate, endDate);




  const handleGenerateAITrip = () => {
    // TODO: Implement AI trip generation logic here
    console.log('Generating AI trip');
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900 box" style={{ paddingBottom: 80 }}>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-6 pt-6">
      <Animated.View
        entering={FadeInDown.duration(500).springify()}
        className="flex-row justify-between items-center mb-8"
      >
        <Text className="text-2xl font-bold text-white flex-shrink" style={{color:"white"}}>
          Create Your Trip
          </Text>
        <TouchableOpacity
          onPress={handleGenerateAITrip}
          className="flex-row items-center bg-gray-700 px-3 py-2 rounded-md"
        >
        <Ionicons name="bulb-outline" size={16} color="white" className="mr-2" />
        <Text className="text-white text-sm">Generate AI Trip</Text>
      </TouchableOpacity>
    </Animated.View>
      
      {/* Trip Title and Description */}
      <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
        <Text className="text-white text-lg mb-2">Trip Title</Text>
        <TextInput
          className="bg-zinc-800 text-white px-4 py-3 rounded-lg mb-6"
          placeholder="Enter trip title"
          placeholderTextColor="#a1a1aa"
          value={title}
          onChangeText={setTitle}
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).duration(500).springify()}>
        <Text className="text-white text-lg mb-2">Description</Text>
        <TextInput
          className="bg-zinc-800 text-white px-4 py-3 rounded-lg mb-6"
          placeholder="Enter trip description"
          placeholderTextColor="#a1a1aa"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </Animated.View>

      {/* Start Date and End Date */}
      <Animated.View entering={FadeInDown.delay(300).duration(500).springify()} className="flex-row justify-between mb-6">
        <View className="flex-1 mr-4">
          <Text className="text-white text-lg mb-2">Start Date</Text>
          <TouchableOpacity
            className="bg-zinc-800 px-4 py-3 rounded-lg flex-row justify-between items-center"
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text className="text-white">{startDate.toDateString()}</Text>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1">
        <Text className="text-white text-lg mb-2">
          End Date {' '}
          {tripDuration === 0 ? (
            <Text className="text-gray-400 font-bold">
             same day 
          </Text>
          ) : (
            <Text className="text-gray-400 font-semibold">
              takes {tripDuration} days
            </Text>
          )}
          {' '}
      </Text>
          <TouchableOpacity
            className="bg-zinc-800 px-4 py-3 rounded-lg flex-row justify-between items-center"
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text className="text-white">{endDate.toDateString()}</Text>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
      </Animated.View>

      {/* Trip Steps */}
      <Animated.View entering={FadeInDown.delay(600).duration(500).springify()}>
        <Text className="text-white text-lg mb-2">Trip Steps {steps.length === 0 ? isEmptyFields ? <Text className="text-red-400 font-bold">* please add places to the trip </Text> : "" : ""}</Text>
        {steps.map((step, index) => (
          <Animated.View
            key={index}
            entering={FadeInRight.duration(300)}
            exiting={FadeOutRight.duration(300)}
            className="bg-zinc-800 p-4 rounded-lg mb-4"
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-semibold">Step {step.step_num}</Text>
              <TouchableOpacity onPress={() => removeStep(index)}>
                <Ionicons name="close-circle-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
            {step.place && (
              <View className="mb-2">
                <Image
                  source={{ uri: step.place.image }}
                  className="w-full h-32 rounded-lg mb-2"
                  resizeMode="cover"
                />
                <Text className="text-white font-semibold">{step.place.name}</Text>
              </View>
            )}
            <View className="flex-row justify-between mb-2">
              <TouchableOpacity
                className="bg-zinc-700 px-3 py-2 rounded-md flex-1 mr-2"
                onPress={() => {
                  setActiveStepIndex(index);
                  setShowStepStartTimePicker(true);
                }}
              >
                <Text className="text-white">Start: {step.start_time?.toLocaleTimeString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-zinc-700 px-3 py-2 rounded-md flex-1 ml-2"
                onPress={() => {
                  setActiveStepIndex(index);
                  setShowStepEndTimePicker(true);
                }}
              >
                <Text className="text-white">End: {step.end_time?.toLocaleTimeString()}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
        <TouchableOpacity
          className="bg-zinc-800 p-4 rounded-lg items-center mb-4"
          onPress={addSteps}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="text-white mt-2">Add Steps</Text>
        </TouchableOpacity>
      </Animated.View>

        
      </ScrollView>

      {/* Creating Trip Button */}

      <BlurView intensity={10} className="p-4">
        <TouchableOpacity
          onPress={handleCreateTrip}
          className="flex-row items-center justify-center bg-zinc-700 px-4 py-3 rounded-md"
          disabled={loading}  // Disable the button if loading is true
        >
          <Ionicons name={successMessageVisible ? "checkmark-circle-outline" : loading ? "refresh-outline" : "airplane-outline" } size={18} color={successMessageVisible ? "#fcbf49" : "#ffffff"} className="mr-2" />
          <Text className="text-2xl font-bold text-white flex-shrink" style={{color: successMessageVisible ? "#fcbf49" : "#ffffff"}}>
            {successMessageVisible ? "Trip Created Successfully!" : loading ? "Creating Trip..." : "Create Trip"}
          </Text>
        </TouchableOpacity>
      </BlurView>

      {(showStartDatePicker || showEndDatePicker || showStepStartTimePicker || showStepEndTimePicker) && (
        <DateTimePicker
          value={showStartDatePicker ? startDate : showEndDatePicker ? endDate : steps[activeStepIndex]?.start_time || new Date()}
          mode={showStartDatePicker || showEndDatePicker ? "date" : "time"}
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default CreateTrip;
