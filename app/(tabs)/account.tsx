import React, { useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthProvider';
import { useUser } from '@/hooks/useUser';
import { History, UserPen, Users, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import LoadingUI from '@/components/LoadingUI';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export default function Account() {
  const user = useAuthCheck();
  const { signOut } = useAuth();
  const { profile, loading, error } = useUser(user?.id || null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const menuItems = [
    { id: '1', title: 'History', icon: History, onPress: () => { router.push('/history') } },
    { id: '2', title: 'Profile', icon: UserPen, onPress: () => { router.push('/profile') } },
    { id: '3', title: 'Group', icon: Users, onPress: () => { router.push('/group') } },
    { id: '4', title: 'settings', icon: Settings, onPress: () => { router.push('/settings') } },
  ];


  if (loading) {
    return (
      <LoadingUI />
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1a202c', '#2d3748']}
      className="flex-1 mb-32 mt-8"
    >
      <Animated.View className="flex-1 bg-black px-6 py-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-white text-3xl font-bold">Account</Text>
          <Avatar alt="Corresponds to avatar picture " className="w-16 h-16 border-2 border-purple-500">
            {profile?.avatar_url ? (
              <AvatarImage source={{ uri: profile.avatar_url }} />
            ) : (
              <AvatarFallback>
                <Text className="text-2xl text-white">{profile?.username?.charAt(0) || 'U'}</Text>
              </AvatarFallback>
            )}
          </Avatar>
        </View>

        {/* User Info */}
        <View className="mb-8">
          <Text className="text-white text-2xl font-semibold">{profile?.username || 'User'}</Text>
          <Text className="text-gray-400 text-base">{user?.email || 'email@example.com'}</Text>
        </View>

        {/* Menu List */}
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center justify-between bg-zinc-800 rounded-lg mb-4 p-4"
              onPress={item.onPress}
            >
              <View className="flex-row items-center">
                <View className="bg-secondary rounded-full p-2 mr-4">
                  <item.icon />
                </View>
                <Text className="text-white text-lg">{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <View className="mt-auto">
          <Button
            variant="destructive"
            onPress={signOut}
            className="bg-red-500 py-4 rounded-lg"
          >
            <Text className="font-semibold text-white text-base">
              Sign Out
            </Text>
          </Button>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
