import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center space-y-10">
          {/* Welcome Text Block */}
          <View className="items-center space-y-3">
            <Text className="text-4xl font-bold text-gray-900 text-center">
              Welcome to
            </Text>
            <Text className="text-5xl pt-2 font-extrabold text-blue-600 text-center">
              ZoneX
            </Text>
            <Text className="text-base pt-5 text-gray-600 text-center">
              Your personal map for identifying Network Strength.
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Stay aware. Stay safe.
            </Text>
          </View>

          {/* Buttons */}
          <View className="w-full space-y-5 mt-6">
            <Pressable
              onPress={() => router.push("/register")}
              className="bg-blue-600 py-4 rounded-xl"
            >
              <Text className="text-center text-white text-lg font-semibold">
                Get Started
              </Text>
            </Pressable>

            {/* Optional login link */}
            {/* <Pressable onPress={() => router.push("/login")}>
              <Text className="text-center mt-2 text-blue-600 text-base font-semibold">
                Already have an account? Log in
              </Text>
            </Pressable> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
