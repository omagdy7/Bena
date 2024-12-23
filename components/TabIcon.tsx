import React from 'react'
import { Text, Image, View, ImageSourcePropType } from 'react-native'
import { MotiView } from 'moti'

type TabIconProps = {
  icon: ImageSourcePropType | undefined
  color: string
  name: string
  focused: boolean
}

export const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View className="flex items-center justify-center w-16 h-16">
      <MotiView
        from={{
          scale: 1,
          opacity: 0.5,
        }}
        animate={{
          scale: focused ? 1.2 : 1,
          opacity: focused ? 1 : 0.5,
        }}
        transition={{
          type: 'timing',
          duration: 300,
        }}
      >
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="w-6 h-6"
        />
      </MotiView>
      {focused && (
        <MotiView
          from={{
            opacity: 0,
            translateY: 10,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: 'timing',
            duration: 300,
          }}
        >
          <Text
            className="text-[10px] mt-1 font-psemibold"
            style={{ color: color }}
          >
            {name}
          </Text>
        </MotiView>
      )}
    </View>
  )
}
