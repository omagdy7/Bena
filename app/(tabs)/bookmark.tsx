import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@/components/ui/text';
import BookmarkedTripItem from '@/components/BookmarkedTripItem';

const initialBookmarkedTrips = [
  { id: '1', name: 'Paris Getaway', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', date: '15-20 Aug 2023' },
  { id: '2', name: 'Tokyo Adventure', image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', date: '3-10 Sep 2023' },
  { id: '3', name: 'New York City Trip', image: 'https://images.unsplash.com/photo-1548019581-99d71784d09a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', date: '22-28 Oct 2023' },
  { id: '4', name: 'Bali Relaxation', image: 'https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', date: '5-12 Nov 2023' },
  { id: '5', name: 'London Explorer', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', date: '1-7 Dec 2023' },
];

const BookmarkScreen = () => {
  const [bookmarkedTrips, setBookmarkedTrips] = useState(initialBookmarkedTrips);

  const handleRemoveBookmark = (id: string) => {
    setBookmarkedTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <StatusBar style="light" />
      <View className="px-4 py-6">
        <Text className="text-3xl font-bold text-white mb-6">Your Bookmarks</Text>
        <FlatList
          data={bookmarkedTrips}
          renderItem={({ item, index }) => (
            <BookmarkedTripItem
              item={item}
              index={index}
              onRemoveBookmark={handleRemoveBookmark}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BookmarkScreen;

