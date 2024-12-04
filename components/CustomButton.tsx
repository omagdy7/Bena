import { TouchableOpacity, View, Text } from 'react-native'
import React from 'react'

type CustomButtonProps = {
  title: string,
  handlePress: () => void
  containerStyles?: string,
  textstyles?: string,
  isLoading?: boolean
}

const CustomButton = ({ title, handlePress, containerStyles, isLoading }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`} >
      <Text className="text-primary font-psemibold text-lg">{title}</Text>
    </TouchableOpacity >
  )
}

export default CustomButton
