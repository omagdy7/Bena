import { ScrollView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { images } from '../constants'
import CustomButton from '../components/CustomButton';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function App() {
  return (
    <SafeAreaView className="h-full bg-black">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full h-[85vh] justify-center items-center px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[140px]"
            resizeMode='contain'
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center"> Plan Your Perfect Getaway with{' '}
              <Text className="text-secondary-200">Bena</Text>
            </Text>
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where creativity meets innovation: embark on a journey of limitless exploration with
          </Text>
          <CustomButton
            title={"Continue with Email"}
            handlePress={() => router.push('/sign-in')}
            containerStyles={"w-full mt-7"}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  );
}


