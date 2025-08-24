import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Basic password validation (minimum 8 characters for Appwrite)
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const result = await signUp(email, password, name);
      if (result === null) {
        router.replace('/login');
      } else {
        setError(result);
      }
    } catch (e: any) {
      console.error('Registration error:', e);
      setError(
        e.message || 'Failed to register. Please check your details and try again.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-white px-6 py-8 justify-center">
          <Text className="text-blue-700 text-3xl font-bold text-center mb-8">
            Create Account
          </Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#6B7280"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            style={styles.input}
            className="text-black px-4 py-3 rounded-xl mb-5"
            accessibilityLabel="Name input"
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            style={styles.input}
            className="text-black px-4 py-3 rounded-xl mb-5"
            accessibilityLabel="Email input"
          />

          <View className="relative mb-5">
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCorrect={false}
              style={[styles.input, { paddingRight: 48 }]} // Extra padding for icon
              className="text-black px-4 py-3 rounded-xl"
              accessibilityLabel="Password input"
            />
            <TouchableOpacity
              className="absolute right-4 top-3.5"
              onPress={() => setShowPassword(!showPassword)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
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
            accessibilityRole="button"
            accessibilityLabel="Register"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/login')}
            className="mt-6"
            accessibilityRole="button"
            accessibilityLabel="Go to sign in"
          >
            <Text className="text-gray-700 text-center text-sm">
              Already have an account?{' '}
              <Text className="text-blue-600 underline">Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white', // Force white background
    borderWidth: 1,
    borderColor: '#D1D5DB', // Matches Tailwind's gray-300
    borderRadius: 10,
  },
});