import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { icons } from '../constants'

type FormFieldProps = {
  title: string,
  value: string, // I could make this generic in the future
  placeholder?: string,
  handleChangeText: (e: string) => void,
  otherStyles?: string,
  isLoading?: boolean
  keyboardType?: string,
}

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }: FormFieldProps) => {
  const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="border-2 w-full h-16 rounded-2xl border-black-200 px-4 bg-black-100 focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => { setshowPassword(!showPassword) }}>
            <Image source={!showPassword ? icons.eye : icons.eyeHide} resizeMode='contain' className="w-6 h-6" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
