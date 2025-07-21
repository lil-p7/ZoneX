import { View, Image } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/welcome'); 
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={require('../assets/images/ZoneX-logo.png')}
        className="w-80 h-80 mb-4"
        resizeMode="contain"
      />
    </View>
  );
}
