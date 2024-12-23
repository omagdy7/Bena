import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface CustomButtonProps {
  title: string
  handlePress: () => void
  isLoading?: boolean
  icon?: string
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  isLoading = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      className="bg-secondary py-4 rounded-full items-center justify-center flex-row"
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Text className="text-zinc-900 font-bold text-lg mr-2">{title}</Text>
          {icon && <Ionicons name={icon} size={24} color="#18181b" />}
        </>
      )}
    </TouchableOpacity>
  )
}

export default CustomButton


