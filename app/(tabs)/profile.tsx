import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { account } from "@/lib/appwrite";
import { RelativePathString, useRouter } from "expo-router";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from Appwrite
  const fetchUser = async () => {
    try {
      const res = await account.get();
      setUser(res);
    } catch {
      Alert.alert("Error", "Unable to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Only show these menu items in ZoneX
  const menuItems = [
    {
      icon: <Feather name="log-out" size={20} color="red" />,
      label: "Log Out",
      danger: true,
      divider: false, // Added divider property
    },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3A8DFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 pt-6">
        {/* Profile Info */}
        <View className="items-center">
          <Image
            source={{
              uri:
                user?.prefs?.avatarUrl ||
                "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name),
            }}
            className="w-24 h-24 rounded-full mb-3"
          />
          <Text className="text-xl font-bold text-[#0F172A]">{user?.name}</Text>
          <Text className="text-gray-500 mb-2">{user?.email}</Text>

          <Pressable
  className="bg-blue-600 px-4 py-1 rounded-full mt-2"
  onPress={() => router.push("/edit-profile" as RelativePathString)}
>
  <Text className="text-white font-medium">Edit Profile</Text>
</Pressable>
        </View>

        {/* Menu Section */}
        <View className="mt-6">
          {menuItems.map((item, index) =>
            item.divider ? (
              <View key={index} className="h-[1px] bg-gray-300 my-3" />
            ) : (
              <Pressable
                key={index}
                className="flex-row justify-between items-center py-4 border-b border-gray-200"
                onPress={() => {
                  if (item.label === "Log Out") {
                    account.deleteSession("current").then(() => {
                      router.replace("/login");
                    });
                  }
                }}
              >
                <View className="flex-row items-center gap-3">
                  {item.icon}
                  <Text
                    className={`text-base ${
                      item.danger ? "text-red-500 font-semibold" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#999" />
              </Pressable>
            )
          )}
        </View>

        <Text className="text-center text-gray-400 mt-6 text-xs">
          ZoneX v1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}