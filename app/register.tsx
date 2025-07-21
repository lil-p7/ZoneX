import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    const result = await signUp(email, password, name);
    if (result === null) {
      router.replace('/login');
    } else {
      setError(result);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-blue-700 text-3xl font-bold text-center mb-8">
        Create Account
      </Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#6B7280"
        value={name}
        onChangeText={setName}
        className="bg-gray-100 text-black px-4 py-3 rounded-xl mb-5"
      />

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
        onPress={handleRegister}
        className="bg-blue-600 py-3 rounded-xl mt-2 shadow-md"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text className="text-gray-700 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Text className="text-blue-600 underline">Sign in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}