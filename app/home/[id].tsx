import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, ScrollView, Image, Text, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';

const PlaceDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-black">
      <Image
        source={{ uri: place.image }}
        className="w-full h-64"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-2xl font-bold text-white">{place.name}</Text>
        <Text className="text-white">{place.description}</Text>
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;

