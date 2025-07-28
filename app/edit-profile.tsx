import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { account } from "@/lib/appwrite";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setName(user.name);
        setEmail(user.email);
      } catch {
        Alert.alert("Error", "Failed to load user data.");
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and email are required.");
      return;
    }

    try {
      setLoading(true);
      await account.updateName(name);

      const user = await account.get();
      if (email !== user.email) {
        if (!password) {
          Alert.alert(
            "Password Required",
            "Enter your current password to update email."
          );
          return;
        }
        await account.updateEmail(email, password);
      }

      if (newPassword || confirmPassword) {
        if (!password) {
          Alert.alert(
            "Password Required",
            "Enter your current password to update password."
          );
          return;
        }

        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "New passwords do not match.");
          return;
        }

        await account.updatePassword(newPassword, password);
      }

      Alert.alert("Success", "Profile updated successfully.");

      // Reset fields
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");

      const updated = await account.get();
      setName(updated.name);
      setEmail(updated.email);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <Text className="text-blue-600 text-2xl font-bold mb-6">
          Edit Profile
        </Text>

        <Text className="text-gray-800 mb-1">Name</Text>
        <TextInput
          className="bg-gray-100 rounded-md p-3 mb-4 text-gray-900"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-gray-800 mb-1">Email</Text>
        <TextInput
          className="bg-gray-100 rounded-md p-3 mb-2 text-gray-900"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {email !== "" && (
          <>
            <Text className="text-gray-600 text-xs mb-4">
              * Enter current password if changing email or password
            </Text>

            <Text className="text-gray-800 mb-1">Current Password</Text>
            <TextInput
              className="bg-gray-100 rounded-md p-3 mb-4 text-gray-900"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Required for updates"
            />
          </>
        )}

        <Text className="text-blue-600 text-lg mb-2">Change Password</Text>

        <Text className="text-gray-800 mb-1">New Password</Text>
        <TextInput
          className="bg-gray-100 rounded-md p-3 mb-4 text-gray-900"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="New password"
        />
        <Text className="text-gray-800 mb-1">Confirm New Password</Text>
        <TextInput
          className="bg-gray-100 rounded-md p-3 mb-6 text-gray-900"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm new password"
        />

        <Pressable
          onPress={handleUpdate}
          className="bg-blue-600 p-4 rounded-full items-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Save Changes
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
