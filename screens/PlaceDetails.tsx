import React, { useEffect, useState } from 'react';
import { Place } from '@/types/place';
import { View, ScrollView, Image, Linking, ActivityIndicator, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  PlaceDetails: { id: number };
};

type PlaceDetailsProps = NativeStackScreenProps<RootStackParamList, 'PlaceDetails'>;

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ route }) => {
  const { id } = route.params;
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('places')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) throw supabaseError;
        setPlace(data as Place);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch place details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  if (!place) {
    return null; // Handle case where place is not found
  }

  const handleExternalLink = async () => {
    if (place.external_link) {
      await Linking.openURL(place.external_link);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <Image
        source={{ uri: place.image }}
        className="w-full h-64"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">{place.name}</Text>
        {place.arabic_name && (
          <Text className="text-lg text-gray-600 mb-4">{place.arabic_name}</Text>
        )}

        <View className="flex-row items-center mb-4">
          <Text className="text-lg">⭐ {place.rating.toFixed(1)}</Text>
          <Text className="ml-4 text-gray-600">{place.category}</Text>
        </View>

        <Text className="text-base mb-4">{place.description}</Text>

        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="font-semibold mb-2">Location</Text>
          <Text className="text-gray-600">{place.address}</Text>
          <Text className="text-gray-600">{place.location}</Text>
        </View>

        {place.external_link && (
          <Pressable
            onPress={handleExternalLink}
            className="bg-primary py-3 px-4 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Visit Website</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;
