import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { supabase } from '@/lib/supabase'

interface FormData {
  username: string
  email: string
  password: string
}

const SignUp = () => {
  const { signUp } = useAuth()
  const [form, setForm] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    if (!form.username || !form.email || !form.password) {
      Toast.show({
        type: 'error',
        text1: "Error",
        text2: 'Please fill in all fields'
      });
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      Toast.show({
        type: 'error',
        text1: "Error",
        text2: 'Please enter a valid email address'
      });
      return false
    }
    if (form.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: "Error",
        text2: 'Password must be at least 6 characters long'
      });
      return false
    }
    return true
  }

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Step 1: Sign up the user using Supabase Auth
      const { user } = await signUp({
        email: form.email.trim(),
        password: form.password,
      });

      if (user) {
        // Step 2: Insert the username into the `users` table
        const { error: dbError } = await supabase
          .from('users')
          .update([{ username: form.username.trim() }])
          .eq('id', user.id);

        if (dbError) {
          console.log(dbError)
          throw dbError;
        }

        // Step 3: Show success message and navigate to the home screen
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account created successfully',
        });
        router.replace('/home');
      }
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2:
          error instanceof Error
            ? error.message
            : 'An error occurred during sign up. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center gap-6">
          <View className="items-center mb-8">
            <Image
              source={images.logo}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl text-white font-bold mb-8 text-center">
            Create Account
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
          // icon={<Ionicons name="person-outline" size={20} color="#A1A1AA" />}
          />

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

          <CustomButton
            title="Sign Up"
            handlePress={handleSignUp}
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center items-center mt-6">
            <View className="flex-1 h-px bg-zinc-700" />
            <Text className="mx-4 text-zinc-500">Or sign up with</Text>
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
            <Text className="text-zinc-400 mr-1">Already have an account?</Text>
            <Link href="/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-secondary font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignUp


