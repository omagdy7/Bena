import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-2xl'>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
