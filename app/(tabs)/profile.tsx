import { View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await account.get();
        setUser(response);
      } catch {
        Alert.alert("Not logged in", "Please log in to view your profile.");
        router.replace("/login");
      }
    };

    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    try {
      await account.deleteSession("current");
      router.replace("/login");
    } catch {
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
      <Text className="text-3xl font-bold mb-6">Your Profile</Text>

      {user ? (
        <View className="items-center">
          <Text className="text-lg mb-2">👤 Name: {user.name}</Text>
          <Text className="text-lg mb-6">📧 Email: {user.email}</Text>

          <Pressable
            onPress={handleSignOut}
            className="bg-red-600 px-6 py-3 rounded-full mt-4"
          >
            <Text className="text-white font-semibold text-base">
              Sign Out
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text className="text-gray-500">Loading user data...</Text>
      )}
    </SafeAreaView>
  );
}