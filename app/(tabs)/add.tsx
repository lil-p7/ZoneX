import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BasicScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-2xl font-bold mb-4">Add.tsx screen</Text>
    </SafeAreaView>
  );
}