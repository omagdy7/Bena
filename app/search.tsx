import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchPlace } from '@/hooks/useSearchPlace';
import Animated from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { router } from 'expo-router';

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState(''); // State to hold the user's input
  const [places, setPlaces] = useState([]); // State to hold the places returned from the API
  const navigation = useNavigation(); // Navigation hook
  const { getPlaces } = useSearchPlace(''); // Custom hook to fetch places from the API

  const handleSearch = async () => {
    Keyboard.dismiss();
    const places = await getPlaces(searchText); // Fetch places from
    setPlaces(places.search_results); // Update the state with the places returned from the API
  };

  const handlePlaceClick = (placeId: string) => {
    router.push(`../home/${placeId}`); // Navigate to the Place screen with the placeId
  };

  const renderPlaceCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-zinc-800 p-4 rounded-lg mb-4"
      onPress={() => handlePlaceClick(item.places_id)}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-48 rounded-lg"
        resizeMode="cover"
      />
      <View className="mt-2">
        <Text className="text-white text-lg font-bold">{item.name}</Text>
        <Text className="text-gray-400 text-sm">{item.city}</Text>
        <Text className="text-gray-400 text-xs">{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Animated.View className="flex-1 bg-zinc-900 p-4">
      <StatusBar style="light" />
      <View className="flex-1 bg-zinc-900">
        {/* Search Bar */}
        <View className="flex-row items-center bg-zinc-800 p-2 rounded-lg">
          <TextInput
            placeholder="Search for places..."
            placeholderTextColor="#ccc"
            className="flex-1 text-white bg-zinc-800 p-4 rounded-lg"
            autoCapitalize="none"
            autoCorrect={false}
            value={searchText} // Bind the TextInput to the state
            onChangeText={setSearchText} // Update state when the input changes
          />
          <TouchableOpacity
            onPress={handleSearch}
            className="ml-2"
          >
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Places List */}
        <FlatList
          data={places}
          keyExtractor={(item) => item.places_id}
          renderItem={renderPlaceCard}
          className="mt-4"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Animated.View>
  );
};

export default Search;
