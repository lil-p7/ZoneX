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
      setError('Both email and password are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const result = await signIn(email, password);
      if (result === null) {
        router.replace('/(tabs)/map' as RelativePathString);
      } else {
        setError(result);
      }
    } catch (e: any) {
      console.error('Login error:', e);
      setError('Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 py-8">
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
            autoCorrect={false}
            style={styles.input}
            className="text-black px-4 py-3 rounded-xl mb-5"
            accessibilityLabel="Email input"
            selectionColor="rgba(0, 0, 0, 0.2)" // Subtle selection color
            cursorColor="#000000" // Visible cursor
            onFocus={() => console.log('Email input focused')}
          />

          <View className="relative mb-5">
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCorrect={false}
              style={[styles.input, { paddingRight: 48 }]}
              className="text-black px-4 py-3 rounded-xl"
              accessibilityLabel="Password input"
              selectionColor="rgba(0, 0, 0, 0.2)" // Subtle selection color
              cursorColor="#000000" // Visible cursor
              onFocus={() => console.log('Password input focused')}
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
            onPress={handleLogin}
            className="bg-blue-600 py-3 rounded-xl mt-2 shadow-md"
            accessibilityRole="button"
            accessibilityLabel="Log in"
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/register')}
            className="mt-6"
            accessibilityRole="button"
            accessibilityLabel="Go to sign up"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 text-center text-sm">
              Don’t have an account?{' '}
              <Text className="text-blue-600 underline">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
  },
});