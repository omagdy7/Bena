import { Tabs } from 'expo-router'
import { icons } from '../../constants'
import React from 'react'
import { TabIcon } from '@/components/TabIcon'
import { StatusBar } from 'expo-status-bar'

const tabScreens = [
  { name: 'home', title: 'Home', icon: icons.home },
  { name: 'bookmark', title: 'Bookmark', icon: icons.bookmark },
  { name: 'create', title: 'Create', icon: icons.plus },
  { name: 'account', title: 'Account', icon: icons.profile },
  // { name: 'home/[id]', title: 'PlaceDetails', icon: icons.profile },
]

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#fcbf49',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 64,
          },
        }}
      >
        {tabScreens.map(({ name, title, icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icon}
                  color={color}
                  name={title}
                  focused={focused}
                />
              ),
            }}
          />
        ))}
        <Tabs.Screen
          name="home/[id]"
          options={{
            headerShown: false, // Hide the header for the dynamic route
            tabBarButton: () => null, // Prevent the tab from showing
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  )
}

export default TabsLayout

