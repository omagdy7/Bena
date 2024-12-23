import React, { useState } from 'react'
import { View, Text, Image, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'

interface FormData {
  email: string
  password: string
}

const SignIn = () => {
  const { signIn } = useAuth()
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSignIn = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const { user } = await signIn({
        email: form.email.trim(),
        password: form.password,
      })

      if (user) {
        router.replace("/home")
      }
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        error instanceof Error
          ? error.message
          : 'An error occurred during sign in. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-8">
            <Image
              source={images.logo}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl text-white font-bold mb-8 text-center">
            Welcome Back
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          // icon={<Ionicons name="mail-outline" size={20} color="#A1A1AA" />}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
          // icon={<Ionicons name="lock-closed-outline" size={20} color="#A1A1AA" />}
          />

          <TouchableOpacity className="self-end mb-4">
            <Text className="text-secondary text-sm">Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            handlePress={handleSignIn}
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center items-center mt-6">
            <View className="flex-1 h-px bg-zinc-700" />
            <Text className="mx-4 text-zinc-500">Or continue with</Text>
            <View className="flex-1 h-px bg-zinc-700" />
          </View>

          <View className="flex-row justify-center mt-4 space-x-4">
            {['logo-google', 'logo-apple', 'logo-facebook'].map((icon) => (
              <TouchableOpacity key={icon} className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center">
                <Ionicons name={icon} size={24} color="#fff" />
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-zinc-400 mr-1">Don't have an account?</Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-secondary font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignIn

