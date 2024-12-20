import { Tabs } from 'expo-router'
import { icons } from '../../constants'
import React from 'react'
import { TabIcon } from '@/components/TabIcon'
import { StatusBar } from 'expo-status-bar'

const tabScreens = [
  { name: 'home', title: 'Home', icon: icons.home },
  { name: 'saved', title: 'Saved', icon: icons.bookmark },
  { name: 'create', title: 'Create', icon: icons.plus },
  { name: 'profile', title: 'Profile', icon: icons.profile },
]

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84,
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
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  )
}

export default TabsLayout

