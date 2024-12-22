import { View } from 'react-native'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import React from 'react'

const Home = () => {
  return (
    <View className='flex-1 items-center justify-center'>
      <Card className='dark w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Home Card</CardTitle>
          <CardDescription>This is a Home card</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Card Content</Text>
        </CardContent>
        <CardFooter>
          <Text>Card Footer</Text>
        </CardFooter>
      </Card>
    </View>
  )
}

export default Home
