import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }

    const result = await signIn(email, password);
    if (result === null) {
      router.replace("/(tabs)/map" as RelativePathString);
    } else {
      setError(result);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-blue-700 text-3xl font-bold text-center mb-8">
        Welcome Back
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#6B7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="bg-gray-100 text-black px-4 py-3 rounded-xl mb-5"
      />

      <View className="relative mb-5">
        <TextInput
          placeholder="Password"
          placeholderTextColor="#6B7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          className="bg-gray-100 text-black px-4 py-3 rounded-xl pr-12"
        />
        <TouchableOpacity
          className="absolute right-4 top-3.5"
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {error && (
        <Text className="text-red-500 text-center mb-4 text-sm">{error}</Text>
      )}

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 py-3 rounded-xl shadow-md"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/register')}>
        <Text className="text-gray-700 text-center mt-6 text-sm">
          Don’t have an account?{' '}
          <Text className="text-blue-600 underline">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}