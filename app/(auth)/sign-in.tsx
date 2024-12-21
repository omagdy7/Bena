import { ScrollView, View, Text, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import React from 'react'
import { useAuth } from '@/context/AuthProvider';

interface FormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const { signIn } = useAuth();
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  }

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { user } = await signIn({
        email: form.email.trim(),
        password: form.password,
      });

      if (user) {
        router.replace("/home");
      }
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        error instanceof Error
          ? error.message
          : 'An error occurred during sign in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-zinc-900 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode='contain'
            className="w-[135px] h-[135px]"
            style={{ marginHorizontal: -8 }}
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Log in to Bena
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={handleSignIn}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className='text-lg font-semibold text-secondary'
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
