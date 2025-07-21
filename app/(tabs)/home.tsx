import { useEffect, useState } from "react";
import { Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { account } from "@/lib/appwrite";

export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUsername(user.name || "User");
      } catch {
        console.log("Not logged in");
        router.replace("/login");
      }
    };

    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.replace("/login");
    } catch {
      Alert.alert("Logout Failed", "Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
      <Text className="text-2xl font-semibold text-gray-800 mb-4">
        Welcome, {username} 👋
      </Text>

      <Pressable
        onPress={handleLogout}
        className="bg-red-600 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-medium text-base">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}