import React from 'react';
import { View, Text, TextInput,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const search: React.FC = () => {
  
  return (
    <View className="flex-1 bg-zinc-900 p-4">
  <View className="flex-row items-center bg-zinc-800 p-2 rounded-lg">
    <TextInput
      placeholder="Search for places..."
      placeholderTextColor="#ccc"
      className="flex-1 text-white bg-zinc-800 p-4 rounded-lg"
    />
    <TouchableOpacity
      onPress={() => {
        // Handle search button press
        console.log('Search button pressed');
      }}
      className="ml-2"
    >
      <Ionicons name="search" size={24} color="white" />
    </TouchableOpacity>
  </View>
</View>
  );
};

export default search;
