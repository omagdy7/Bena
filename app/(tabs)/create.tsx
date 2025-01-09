import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import CustomButton from '@/components/CustomButton';
import { BlurView } from 'expo-blur';
import { TripStep } from '@/db/schema';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CreateTrip: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [steps, setSteps] = useState<Partial<TripStep>[]>([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStepStartTimePicker, setShowStepStartTimePicker] = useState(false);
  const [showStepEndTimePicker, setShowStepEndTimePicker] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const addStep = () => {
    setSteps([...steps, {
      step_num: steps.length + 1,
      start_time: new Date(),
      end_time: new Date(),
      status: 'pending'
    }]);
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
        setShowStartDatePicker(false);
      } else if (showEndDatePicker) {
        setEndDate(selectedDate);
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

  const handleCreateTrip = () => {
    // Implement trip creation logic here
    console.log('Creating trip:', { title, description, startDate, endDate, status, steps });
    router.push('/home');
  };

  const handleGenerateAITrip = () => {
    // TODO: Implement AI trip generation logic here
    console.log('Generating AI trip');

    // For now, let's just add a mock step
    setSteps([...steps, {
      step_num: steps.length + 1,
      place_id: 'AI Generated Place',
      start_time: new Date(),
      end_time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
      status: 'pending'
    }]);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-6 pt-6">
        <Animated.View entering={FadeInDown.duration(500).springify()}>
          <Text className="text-3xl font-bold text-white mb-8">Create Your Trip</Text>
        </Animated.View>

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

        <Animated.View entering={FadeInDown.delay(600).duration(500).springify()}>
          <Text className="text-white text-lg mb-2">Trip Steps</Text>
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
              <TextInput
                className="bg-zinc-700 text-white px-3 py-2 rounded-md mb-2"
                placeholder="Place Name"
                placeholderTextColor="#a1a1aa"
                value={step.place_id}
                onChangeText={(text) => updateStep(index, 'place_id', text)}
              />
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
              <View className="flex-row">
                {['pending', 'visited', 'skipped'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    className={`px-3 py-1 rounded-full mr-2 ${step.status === s ? 'bg-secondary' : 'bg-zinc-700'}`}
                    onPress={() => updateStep(index, 'status', s)}
                  >
                    <Text className={`${step.status === s ? 'text-zinc-900' : 'text-white'} text-sm`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ))}
          <TouchableOpacity
            className="bg-zinc-800 p-4 rounded-lg items-center mb-4"
            onPress={addStep}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white mt-2">Add Step</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View className="mt-10" entering={FadeInDown.delay(700).duration(500).springify()}>
          <CustomButton
            title="Generate Trip with AI"
            handlePress={handleGenerateAITrip}
            icon="bulb-outline"
            containerStyles="mb-4"
          />
        </Animated.View>
      </ScrollView>

      <BlurView intensity={10} className="p-4">
        <CustomButton
          title="Create Trip"
          handlePress={handleCreateTrip}
          icon="airplane-outline"
        />
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
