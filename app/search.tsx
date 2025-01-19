import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchPlace } from '@/hooks/useSearchPlace';
import Animated from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { router } from 'expo-router';
import { useUserBookmarks } from '@/hooks/useUserBookmarks';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider'; 
import FastImage from 'react-native-fast-image';




const Search: React.FC = () => {
  const [searchText, setSearchText] = useState(''); // State to hold the user's input
  const [places, setPlaces] = useState([]); // State to hold the places returned from the API
  const navigation = useNavigation(); // Navigation hook
  const { getPlaces } = useSearchPlace(); // Custom hook to fetch places from the API
  const { bookmarkedPlaces , addToBookmarks, removeFromBookmarks, refetch } = useUserBookmarks(); // Custom hook to fetch user's bookmarks
  const { user } = useAuth();
  const userId = user?.id;

  const handleSearch = async () => {
    Keyboard.dismiss();
    const places = await getPlaces(searchText); // Fetch places from
    setPlaces(places.search_results); // Update the state with the places returned from the API
  };

  const handlePlaceClick = (placeId: string) => {
    router.push(`../home/${placeId}`); // Navigate to the Place screen with the placeId
  };
  const handleAddToBookmarks =  (placeId: string) => {
    addToBookmarks(userId, placeId);
    refetch();
  };

  const handleRemoveBookmark = async (placeId: string) => {
    removeFromBookmarks(userId, placeId);
    refetch();
  };

  const renderPlaceCard = ({ item }: { item: any }) =>  (
    <TouchableOpacity
      className="bg-zinc-800 p-2 rounded-lg mb-2 flex-row"
      onPress={() => handlePlaceClick(item.places_id)}
    >
      {/* Place Image */}
      <FastImage
        source={{ uri: item.image }}
        style={{ width: 96, height: 96, borderRadius: 8, marginRight: 8 }} // w-24, h-24, rounded-lg, and mr-2
        resizeMode={FastImage.resizeMode.cover}
      />
          
      {/* Place Details */}
      <View className="flex-1">
        <Text className="text-white text-base font-semibold">{item.name.length > 20 ? `${item.name.slice(0, 40)}...` : item.name}</Text>
        <Text className="text-gray-400 text-xs">{item.city}</Text>
        <Text className="text-gray-400 text-xs mb-2">{item.address}</Text>
        <View className="flex-row items-center">
        {/* Bookmark Button */}
        <TouchableOpacity
          onPress={bookmarkedPlaces.some(place => place.places_id === item.places_id) ? () => handleRemoveBookmark(item.places_id) : async () => handleAddToBookmarks(item.places_id)}
          className={`mt-auto px-4 py-1 rounded flex-row items-center justify-center gap-1 ${
            bookmarkedPlaces.some(place => place.places_id === item.places_id) ? "bg-[#fcbf49]" : "bg-gray-600"
          }`}
        >
          <Ionicons name={bookmarkedPlaces.some(place => place.places_id === item.places_id) ? "bookmark" : "bookmark-outline"}   size={16} color={bookmarkedPlaces.some(place => place.places_id === item.places_id) ? "black" : "white"} />
          <Text className={`text-xs text-center ${bookmarkedPlaces.some(place => place.places_id === item.places_id) ? "text-black" : "text-white"}`} >

            {bookmarkedPlaces.some(place => place.places_id === item.places_id) ? "Added to Bookmarks" : "Add to Bookmarks"}
          </Text>
        </TouchableOpacity>
      </View>
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
