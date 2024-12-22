import { Text, Image, View, ImageSourcePropType } from "react-native"

type TabIconProps = {
  icon: ImageSourcePropType | undefined,
  color: string,
  name: string,
  focused: boolean,

}

export const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View className="flex items-center justify-center gap-2 w-20 h-16 mt-8">
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-[10px]`} style={{ color: color }}>{name}</Text>
    </View>
  )
}

