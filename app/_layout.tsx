import { Stack } from "expo-router";
import { AuthProvider } from "@/lib/auth-context";
import { StatusBar } from "expo-status-bar";
import "../app/global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade', 
        }}
      />
    </AuthProvider>
  );
}
