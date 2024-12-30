import { Tabs } from 'expo-router'
import { icons } from '../../constants'
import React from 'react'
import { TabIcon } from '@/components/TabIcon'
import { StatusBar } from 'expo-status-bar'
import { BlurView } from 'expo-blur'
import { View } from 'react-native'

const tabScreens = [
  { name: 'home', title: 'Home', icon: icons.home },
  { name: 'bookmark', title: 'Bookmark', icon: icons.bookmark },
  { name: 'create', title: 'Create', icon: icons.plus },
  { name: 'account', title: 'Account', icon: icons.profile },
]

const TabsLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#fcbf49',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 50,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: 60,
            zIndex: 1,
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
      <BlurView
        intensity={80}
        tint="light"
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 75,
          borderRadius: 15,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(12, 12, 12, 0.90)' }} />
      </BlurView>
      <StatusBar backgroundColor="#161622" style="light" />
    </View>
  )
}

export default TabsLayout


