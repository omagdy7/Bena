import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const ICON_SIZE = 48;
const ANIMATION_DURATION = 2000;

const LoadingUI: React.FC = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: ANIMATION_DURATION, easing: Easing.linear }),
      -1
    );
    scale.value = withRepeat(
      withTiming(1.2, { duration: ANIMATION_DURATION / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="flex-1 items-center justify-center bg-zinc-900"
    >
      <BlurView intensity={20} className="p-8 rounded-3xl">
        <Animated.View style={animatedStyle}>
          <Ionicons name="airplane" size={ICON_SIZE} color="#fcbf49" />
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(500).duration(500)}
          className="mt-4"
        >
          <Text className="text-white text-xl font-bold text-center">Preparing Your Journey</Text>
          <Text className="text-gray-400 text-sm text-center mt-2">Fasten your seatbelts!</Text>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
};

export default LoadingUI;
