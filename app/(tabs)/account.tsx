import { View, TouchableOpacity, FlatList, Image } from 'react-native';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthProvider';
import { useProfile } from '@/hooks/useProfile'; // Assuming the custom hook
import { icons } from '@/constants';

export default function Account() {
  const { user, signOut } = useAuth();
  const { profile, loading, error } = useProfile(user?.id || null);
  console.log(profile)

  const menuItems = [
    { id: '1', title: 'History', icon: icons.history, onPress: () => { } },
    { id: '2', title: 'Profile', icon: icons.user, onPress: () => { } },
    { id: '3', title: 'Group', icon: icons.group, onPress: () => { } },
    { id: '4', title: 'settings', icon: icons.settings, onPress: () => { } },
  ];


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl text-gray-500">Loading...</Text>
      </View>
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
    <View className="flex-1 bg-black px-6 py-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-3xl font-bold">Account</Text>
        <Avatar alt="Corresponds to avatar picture">
          {profile?.avatar_url ? (
            <AvatarImage source={{ uri: profile.avatar_url }} />
          ) : (
            <AvatarFallback>
              <Text className="text-lg text-white">{profile?.username?.charAt(0) || 'U'}</Text>
            </AvatarFallback>
          )}
        </Avatar>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center justify-between border-b border-gray-700 py-4"
            onPress={item.onPress}
          >
            <View className="flex-row items-center">
              <Image
                source={item.icon}
                resizeMode='contain'
                className="w-6 h-6 mx-2"
              />
              <Text className="text-white text-lg">{item.title}</Text>
            </View>
            <Text className="text-gray-500 text-lg">{'>'}</Text>
          </TouchableOpacity>
        )}
      />
      <Button
        variant={"destructive"}
        onPress={signOut}
      >
        <Text className='font-psemibold text-white text-base'>
          Sign Out
        </Text>
      </Button>
    </View>
  );
}
