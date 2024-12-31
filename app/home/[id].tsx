import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, ScrollView, Text, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Place } from '@/db/schema';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { useAuth } from '@/context/AuthProvider';

const { width } = Dimensions.get('window');

const PlaceDetails: React.FC = () => {
  const { user } = useAuth()
  const navigation = useNavigation()
  const { id } = useLocalSearchParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);


  // Check if place is bookmarked on component mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('bookmark_id')
          .eq('place_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setIsBookmarked(!!data);
      } catch (err) {
        console.error('Error checking bookmark status:', err);
      }
    };

    checkBookmarkStatus();
  }, [user, id]);

  const handleBookmark = async () => {
    if (!user) {
      // Handle unauthenticated user case
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('place_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsBookmarked(false);
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            place_id: id,
            user_id: user.id,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      // You might want to show an error message to the user
    }
  }


  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('places')
          .select('*')
          .eq('places_id', id)
          .single();

        if (supabaseError) throw supabaseError;
        setPlace(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch place details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlace();
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <ActivityIndicator size="large" color="#fcbf49" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-zinc-900">
      <View className="relative">
        <FastImage
          source={{ uri: place?.image }}
          style={{ width, height: width * 0.8 }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(24, 24, 27, 0.8)', '#18181b']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }}
        />
        <BlurView intensity={20} style={{ position: 'absolute', top: 40, left: 20, right: 20, borderRadius: 20, overflow: 'hidden' }}>
          <View className="flex-row justify-between items-center p-2">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBookmark}>
              {
                !isBookmarked ?
                  <Ionicons name="heart-outline" size={24} color="#fff" />
                  : <Ionicons name="heart" size={24} color="#EA0000" />
              }
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
      <Animated.View entering={FadeInUp.delay(300).duration(500)} className="p-6">
        <Animated.Text entering={FadeInDown.delay(400).duration(500)} className="text-3xl font-bold text-white mb-2">{place?.name}</Animated.Text>
        <Animated.View entering={FadeInDown.delay(500).duration(500)} className="flex-row items-center mb-4">
          <Ionicons name="location-outline" size={16} color="#fcbf49" />
          <Text className="text-gray-300 ml-1">{place?.location || 'Unknown Location'}</Text>
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(600).duration(500)} className="text-gray-300 text-base leading-6 mb-6">{place?.description}</Animated.Text>
        <Animated.View entering={FadeInDown.delay(700).duration(500)} className="flex-row justify-between items-center bg-zinc-800 rounded-lg p-4">
          <View>
            <Text className="text-gray-400 text-sm">Price</Text>
            <Text className="text-white text-lg font-bold">${place?.price || 'N/A'}</Text>
          </View>
          <TouchableOpacity className="bg-fcbf49 py-3 px-6 rounded-full">
            <Text className="text-zinc-900 font-bold">Book Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
};

export default PlaceDetails;


