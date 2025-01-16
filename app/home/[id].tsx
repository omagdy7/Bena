import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, ScrollView, Text, ActivityIndicator, Dimensions, TouchableOpacity, Linking, Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Place } from '@/db/schema';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { useAuth } from '@/context/AuthProvider';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

const PlaceDetails: React.FC = () => {
  const { user } = useAuth()
  const navigation = useNavigation()
  const { id } = useLocalSearchParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | 'expensive' | 'affordable' | 'exhausting' | 'relaxing' | null>(null);
  const [isGoodFeedback, setIsGoodFeedback] = useState<'up' | 'down'| null>(null);
  const [isCheap, setIsCheap] = useState<'expensive' | 'affordable' | null>(null);
  const [isEasy, setIsEasy] = useState<'exhausting' | 'relaxing' | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxDescriptionLength = 150; // Maximum length of description to show before expanding
  




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
        setIsBookmarked(false);
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('place_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        setIsBookmarked(true);
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            place_id: id,
            user_id: user.id,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      // You might want to show an error message to the user
    }
  }

  const handleFeedbackUp = async () => {
    setIsGoodFeedback('up');
  };

  const handleFeedbackDown = async () => {
    setIsGoodFeedback('down');
  };

  const handleFeedbackExpensive = async () => {
    setIsCheap('expensive');
  };

  const handleFeedbackAffordable = async () => {
    setIsCheap('affordable');
  };

  const handleFeedbackRelaxing = async () => {
    setIsEasy('relaxing');
  };

  const handleFeedbackExhausting = async () => {
    setIsEasy('exhausting');
  };

  const handleClickOnLocation = async () => { 
    Linking.openURL(place?.external_link!);
  }

  const handleClickOnGoogleMaps = async () => {
    Linking.openURL(place?.external_link!);
  }


  const handleClickOnTiktok = async () => {
    Linking.openURL(`https://www.google.com/search?q=site%3Atiktok.com+${place?.name} ${place?.city}  ${!(place?.arabic_name === "Not available yet") ? place?.arabic_name : ''}`);
  };

  const handleClickOnInstagram = async () => {
    Linking.openURL(`https://www.google.com/search?q=site%3Ainstagram.com+${place?.name} ${place?.city}  ${!(place?.arabic_name === "Not available yet") ? place?.arabic_name : ''}`);

  }

  const handleClickOnTwitter = async () => {
    Linking.openURL(`https://www.google.com/search?q=site%3Atwitter.com+${place?.name}`);
  }

  const handleClickOnPinterest = async () => {
    Linking.openURL(`https://www.google.com/search?q=site%3Apinterest.com+${place?.name}`);
  }

  const handleClickOnYoutube = async () => {
    Linking.openURL(`https://www.google.com/search?q=site%3Ayoutube.com+${!(place?.arabic_name === "Not available yet") ? place?.arabic_name : place?.name + place?.city}`);

  }

  const handleClickOnTripadvisor = async () => {
    Linking.openURL(`https://www.google.com/search?q=site%3Atripadvisor.com+${place?.name}`);
  }


  const toggleExpanded = async() => {
    setIsExpanded(!isExpanded);
  };

  const description =
    place?.description.length > maxDescriptionLength && !isExpanded
      ? `${place?.description.slice(0, maxDescriptionLength)}...`
      : place?.description;


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
        <BlurView intensity={0} style={{ position: 'absolute', top: 40, left: 20, right: 20, borderRadius: 20, overflow: 'hidden' }}>
          <View className="flex-row justify-between items-center p-2">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </BlurView>
        <TouchableOpacity onPress={handleBookmark} className= {`ml-2 absolute bottom-0 right-10 flex-row items-center p-4 rounded-xl drop-shadow-xl  ${!isBookmarked ? 'bg-zinc-800' : 'bg-zinc-800'}`}>
          <Text className={`text-xl text-gray-300 mr-2 flex-col ${!isBookmarked ? 'text-white' : 'text-[#fcbf49]'}`}>{!isBookmarked ? 'Add to Bookmark' : 'Added to Bookmarkes'}</Text>
            {
              !isBookmarked ?
                <Ionicons className="" name="bookmark-outline" size={25} color="#fff" />
                : <Ionicons name="bookmark" size={25} color="#fcbf49" />
            }
          </TouchableOpacity>
      </View>``
      
      <Animated.View entering={FadeInUp.delay(300).duration(500)} className="p-6">
        <Animated.Text entering={FadeInDown.delay(400).duration(500)} className="text-4xl font-bold text-white width-full mb-2 flex-row justify-between items-center"><Text className="mr-4">{place?.name}</Text>
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} className="flex-row items-center mb-4 ">
          <TouchableOpacity className="bg-zinc-800 py-1 px-2 mr-2 rounded-full flex-row items-center" onPress={handleClickOnLocation}> 
            <Ionicons name="location-outline" size={14} color="#fcbf49" />
            <Text className="text-gray-300 ml-1 " style={{fontSize: 12}}>{place?.city || 'Unknown Location'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-zinc-800 py-1 px-2 mr-5 rounded-full flex-row items-center">
          <Ionicons name="pricetag-outline" size={14} color="#fcbf49" />
          <Text className="text-gray-300 ml-1" style={{fontSize: 12}}>{place?.category}</Text>
          </TouchableOpacity>
        </Animated.View>

        { !(description === 'No description yet') && <TouchableOpacity onPress={toggleExpanded} >
          <Animated.Text
            entering={FadeInDown.delay(600).duration(500)}
            className="text-gray-300 text-base leading-6 mb-2 rounded-xl p-4 bg-zinc-800"
          >
            <Text>{description} </Text>
            {isExpanded || description.length < maxDescriptionLength ? null : (<Text className="text-blue-400">Show More</Text>)}
          </Animated.Text>
        </TouchableOpacity>}

        <Animated.View
          entering={FadeInDown.delay(800).duration(500)}
          className="py-2 mt-0 mb-4 bg-zinc-800 border-2 pb-8 pt-4 px-2 rounded-xl border-2 border-zinc-700"
        >
          <Text className="text-white text-xl font-bold mb-4 py-2 px-2" style={{ color: '#AAA' }}>Share Your Experience With The Place</Text>
          <View className="flex-row justify-center items-center my-2">
            <TouchableOpacity
              style={{ width: 145 }}
              onPress={handleFeedbackUp}
              className={`p-2 rounded-lg mx-4 flex-row items-center justify-center ${
                isGoodFeedback === 'up' ? 'bg-blue-400' : 'bg-white'
              }`}
            >
              <Text className={`mr-2 text-sm font-bold ${isGoodFeedback === 'up' ? 'text-zinc-900' : 'text-zinc-800'}`}>Place is Amazing</Text>
              <Ionicons
                name={isGoodFeedback === 'up' ? 'thumbs-up' : 'thumbs-up-outline'}
                size={18}
                color={isGoodFeedback === 'up' ? '#18181b' : '#18181b'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: 145 }}
              onPress={handleFeedbackDown}
              className={`p-2 rounded-lg mx-4 flex-row items-center justify-center ${
                isGoodFeedback === 'down' ? 'bg-red-400' : 'bg-white'
              }`}
            >
              
              <Ionicons
                name={isGoodFeedback === 'down' ? 'thumbs-down' : 'thumbs-down-outline'}
                size={18}
                color={isGoodFeedback === 'down' ? '#18181b' : '#18181b'}
              />
              <Text className={`ml-2 text-sm font-bold ${isGoodFeedback === 'down' ? 'text-zinc-900' : 'text-zinc-800'}`}>Below Expectations</Text>
            </TouchableOpacity>
          </View>


          {/* Feedback for Place is Expensive */}
          <View className="flex-row justify-center items-center my-2">
            <TouchableOpacity
            style={{ width: 145 }}
              onPress={handleFeedbackAffordable}
              className={`p-2 rounded-lg mx-4 flex-row items-center ${
                isCheap === 'affordable' ? 'bg-orange-400' : 'bg-white'
              }`}
            >
              <Text className={`mr-2 text-sm font-bold ${isCheap === 'affordable' ? 'text-zinc-900' : 'text-zinc-800'}`} >Cheaper than Expect</Text>
              <Ionicons
                name={isCheap === 'affordable' ? 'flame' : 'flame-outline'}
                size={18}
                color="#18181b"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: 145 }}
              onPress={handleFeedbackExpensive}
              className={`p-2 rounded-lg mx-4 flex-row items-center justify-center ${
                isCheap === 'expensive' ? 'bg-yellow-400' : 'bg-white'
              }`}
            >
              <Ionicons
                name={isCheap === 'expensive' ? 'cash' : 'cash-outline'}
                size={18}
                color="#18181b"
              />
              <Text className={`ml-2 text-sm font-bold ${isCheap === 'expensive' ? 'text-zinc-900' : 'text-zinc-800'}`}>Place is Expensive</Text>
            </TouchableOpacity>
          </View>

          {/* Feedback for Place is Exhausting */}
          <View className="flex-row justify-center items-center my-2">
              
            <TouchableOpacity
              style={{ width: 145 }}
              onPress={handleFeedbackRelaxing}
              className={`p-2 rounded-lg mx-4 flex-row items-center justify-center ${
                isEasy === 'relaxing' ? 'bg-green-400' : 'bg-white'
              }`}
            >
              
              <Text className={`mr-2 text-sm font-bold ${isEasy === 'relaxing' ? 'text-zinc-900' : 'text-zinc-800'}`}>Place is Relaxing</Text>
              <Ionicons
                name={isEasy === 'relaxing' ? 'leaf' : 'leaf-outline'}
                size={18}
                color="#18181b"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: 145 }}
              onPress={handleFeedbackExhausting}
              className={`p-2 rounded-lg mx-4 flex-row items-center justify-center ${
                isEasy === 'exhausting' ? 'bg-gray-400' : 'bg-white'
              }`}
            >
              <Ionicons
                name={isEasy === 'exhausting' ? 'battery-dead' : 'battery-dead-outline'}
                size={18}
                color="#18181b"
              />
              <Text className={`ml-2 text-sm font-bold ${isEasy === 'exhausting' ? 'text-zinc-900' : 'text-zinc-800'}`}>Place is Exhausting</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Explore More */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(500)}
          className="py-2 mt-0 mb-4 bg-zinc-800 border-2 pb-8 pt-4 px-2 rounded-xl border-2 border-zinc-900 shadow-lg"
        >
          <Text className="text-white text-xl font-bold mb-4 py-2 px-2" style={{ color: '#AAA' }}>Explore More About The Place</Text>
          
          <View className="flex-row justify-center items-center my-2">

            <TouchableOpacity
              style={{ width: 145 }}
              onPress={handleClickOnTiktok}
              className="p-2 rounded-lg mx-4 flex-row items-center justify-center bg-black">
              <Ionicons
                name="logo-tiktok"
                size={18}
                color="white"
              />
              <Text className="ml-2 text-sm font-bold text-white">Explore on TikTok</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{ width: 145 }}
              onPress={handleClickOnYoutube}
              className="p-2 rounded-lg mx-4 flex-row items-center justify-center bg-red-600">
              <Ionicons
                name="logo-youtube"
                size={18}
                color="white"
              />
              <Text className="ml-2 text-sm font-bold text-white">Explore on YouTube</Text>
            </TouchableOpacity>

            
          </View>
          <View className="flex-row justify-center items-center my-2">

          <TouchableOpacity
              style={{ width: 145 }}
              onPress={handleClickOnInstagram}
              className="p-2 rounded-lg mx-4 flex-row items-center justify-center bg-pink-600">
              <Ionicons
                name="logo-instagram"
                size={18}
                color="white"
              />
              <Text className="ml-2 text-sm font-bold text-white">Explore on Instagram</Text>
            </TouchableOpacity>
            
          <TouchableOpacity
             style={{ width: 145 }}
              onPress={handleClickOnPinterest}
              className="p-2 rounded-lg mx-4 flex-row items-center justify-center bg-red-400">
              <Ionicons
                name="logo-pinterest"
                size={18}
                color="white"
              />
              <Text className="ml-2 text-sm font-bold text-white">Explore on Pinterest</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
        {/* todo add nearby places and show first places in use's bookmark */}
      </Animated.View>
    </ScrollView>
  );
};

export default PlaceDetails;


