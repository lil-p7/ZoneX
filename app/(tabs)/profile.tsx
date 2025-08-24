import React, { useState, useEffect } from "react";
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
import Animated, { FadeInDown } from "react-native-reanimated"; // npm install react-native-reanimated

interface User {
  $id: string;
  name: string;
  email: string;
  prefs: { avatarUrl?: string };
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user profile from Appwrite
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await account.get();
      setUser(res as User);
      setErrorMessage(null);
    } catch (e: any) {
      console.error("Fetch user error:", e);
      setErrorMessage("Unable to fetch user info");
      Alert.alert("Error", "Unable to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.replace("/login");
    } catch (e: any) {
      console.error("Logout error:", e);
      setErrorMessage("Failed to log out. Please try again.");
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Menu items
  const menuItems = [
    {
      icon: <Feather name="log-out" size={24} color="#EF4444" />,
      label: "Log Out",
      danger: true,
      onPress: handleLogout,
    },
  ];

  // Dummy avatar URL (public placeholder image)
  const dummyAvatar =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80";

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          className="px-6 pt-10 pb-6 bg-white"
        >
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Your Profile
          </Text>
          <Text className="text-base text-gray-500 text-center mt-2">
            Manage your ZoneX account
          </Text>
          {errorMessage && (
            <Text className="text-red-500 text-center mt-3 text-sm">
              {errorMessage}
            </Text>
          )}
        </Animated.View>

        {/* Profile Section */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="px-6 pt-8 pb-6"
        >
          <View className="items-center">
            <Image
              source={{ uri: user?.prefs?.avatarUrl || dummyAvatar }}
              className="w-24 h-24 rounded-full mb-4"
            />
            <Text className="text-2xl font-bold text-gray-900">
              {user?.name || "User"}
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              {user?.email || "No email"}
            </Text>
            <Pressable
              className="bg-blue-600 px-6 py-2 rounded-full mt-4 active:bg-blue-700"
              onPress={() => router.push("/edit-profile" as RelativePathString)}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
            >
              <Text className="text-white text-base font-semibold">
                Edit Profile
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Menu Section */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          className="px-6 pt-2"
        >
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              className="flex-row justify-between items-center py-4 px-4 bg-white mb-2"
              onPress={item.onPress}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View className="flex-row items-center gap-4">
                {item.icon}
                <Text
                  className={`text-base font-medium ${item.danger ? "text-red-500" : "text-gray-900"}`}
                >
                  {item.label}
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color="#6B7280" />
            </Pressable>
          ))}
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(600)}
          className="mt-10 mb-8"
        >
          <Text className="text-center text-gray-500 text-sm">ZoneX v1.0</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
