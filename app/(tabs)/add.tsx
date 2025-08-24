import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Permission, Role, AppwriteException } from 'react-native-appwrite';
import { databases, ID, account, DB_ID, REPORTS_COL_ID } from '@/lib/appwrite';

const NETWORKS = ['MTN', 'Airtel', 'Glo', '9mobile'] as const;
const STRENGTHS = ['Strong', 'Weak', 'Deadzone'] as const;
const MAX_NOTE_LENGTH = 500;

const strengthColor: Record<(typeof STRENGTHS)[number], string> = {
  Strong: 'bg-green-600',
  Weak: 'bg-yellow-500',
  Deadzone: 'bg-gray-600',
};

interface PickerButtonProps {
  item: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
  accessibilityLabel: string;
}

const PickerButton = ({
  item,
  selected,
  onPress,
  color,
  accessibilityLabel,
}: PickerButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    className={`px-4 py-2 rounded-full mr-2 mb-2 ${selected ? color || 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <Text className={`${selected ? 'text-white' : 'text-gray-800'} font-medium`}>
      {item}
    </Text>
  </TouchableOpacity>
);

export default function AddScreen() {
  const [network, setNetwork] = useState<string>('');
  const [strength, setStrength] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  // Environment variable validation
  if (!DB_ID || !REPORTS_COL_ID) {
    console.error(`Environment variables missing: DB_ID=${DB_ID}, REPORTS_COL_ID=${REPORTS_COL_ID}`);
    Alert.alert('Config Error', 'Set Appwrite Database and Collection IDs');
    return null;
  }

  const isValidCollectionId = (id: string) => /^[a-zA-Z0-9][a-zA-Z0-9_]{0,35}$/.test(id);
  if (!isValidCollectionId(REPORTS_COL_ID)) {
    console.error(`Invalid REPORTS_COL_ID: ${REPORTS_COL_ID}`);
    Alert.alert('Config Error', 'Invalid Appwrite Collection ID');
    return null;
  }

  // Request location
  const requestLocation = useCallback(async () => {
    try {
      setLocating(true);
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services to submit a report.',
          [
            { text: 'OK', style: 'cancel' },
            { text: 'Retry', onPress: () => requestLocation() },
          ]
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Denied',
          'Please grant location permissions to submit a report.',
          [
            { text: 'OK', style: 'cancel' },
            { text: 'Retry', onPress: () => requestLocation() },
          ]
        );
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest, // Maximize precision
      });

      const location = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setCoords(location);
      console.log('Location fetched:', location); // Debug log
    } catch (e: any) {
      console.error('Location error:', e);
      Alert.alert(
        'Location Error',
        `Unable to get location: ${e.message || 'Unknown error'}.`,
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Retry', onPress: () => requestLocation() },
        ]
      );
    } finally {
      setLocating(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleSave = useCallback(async () => {
    if (!network || !strength) {
      return Alert.alert('Missing Info', 'Please select network and signal strength.');
    }

    if (!coords) {
      return Alert.alert('Location Required', 'Cannot save report without location.', [
        { text: 'OK', style: 'cancel' },
        { text: 'Retry Location', onPress: () => requestLocation() },
      ]);
    }

    try {
      setSaving(true);
      const me = await account.get();
      const userId = me.$id;

      const reportData = {
        userId,
        network,
        strength,
        note,
        latitude: coords.latitude,
        longitude: coords.longitude,
        createdAt: new Date().toISOString(),
      };
      console.log('Saving report:', reportData); // Debug log

      await databases.createDocument(
        DB_ID,
        REPORTS_COL_ID,
        ID.unique(),
        reportData,
        [Permission.read(Role.any()), Permission.write(Role.user(userId))]
      );

      Alert.alert('Success', 'Report saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setNetwork('');
            setStrength('');
            setNote('');
            setCoords(null);
            requestLocation();
          },
        },
      ]);
    } catch (e: any) {
      console.error('Save error:', e);
      Alert.alert('Save Failed', e instanceof AppwriteException ? e.message : 'Could not save report');
    } finally {
      setSaving(false);
    }
  }, [network, strength, note, coords, requestLocation]);

  const handleNoteChange = (text: string) => {
    if (text.length <= MAX_NOTE_LENGTH) {
      setNote(text);
    } else {
      Alert.alert('Note Too Long', `Maximum ${MAX_NOTE_LENGTH} characters allowed.`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View className="px-6 py-8">
          <Text className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Add Signal Report
          </Text>

          {/* Location Status */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-2">Current Location</Text>
            {locating ? (
              <Text className="text-gray-600">Fetching location...</Text>
            ) : coords ? (
              <Text className="text-gray-600">
                Lat: {coords.latitude.toFixed(6)}, Long: {coords.longitude.toFixed(6)}
              </Text>
            ) : (
              <Text className="text-red-500">Unable to get location</Text>
            )}
          </View>

          {/* Network Selection */}
          <View>
            <Text className="text-lg font-semibold text-gray-700 mb-2">Network</Text>
            <View className="flex-row flex-wrap mb-6">
              {NETWORKS.map((item) => (
                <PickerButton
                  key={item}
                  item={item}
                  selected={network === item}
                  onPress={() => setNetwork(item)}
                  accessibilityLabel={`Select ${item} network`}
                />
              ))}
            </View>
          </View>

          {/* Signal Strength Selection */}
          <View>
            <Text className="text-lg font-semibold text-gray-700 mb-2">Signal Strength</Text>
            <View className="flex-row flex-wrap mb-6">
              {STRENGTHS.map((item) => (
                <PickerButton
                  key={item}
                  item={item}
                  selected={strength === item}
                  onPress={() => setStrength(item)}
                  color={strengthColor[item]}
                  accessibilityLabel={`Select ${item} signal strength`}
                />
              ))}
            </View>
          </View>

          {/* Note Input */}
          <View>
            <Text className="text-lg font-semibold text-gray-700 mb-2">Notes (Optional)</Text>
            <TextInput
              value={note}
              onChangeText={handleNoteChange}
              placeholder="e.g., Near UNILAG gate, network drops often…"
              placeholderTextColor="#6B7280"
              className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm"
              multiline
              maxLength={MAX_NOTE_LENGTH}
              accessibilityLabel="Description of network report"
              style={styles.input}
            />
            <Text className="text-gray-500 text-sm mt-1">
              {note.length}/{MAX_NOTE_LENGTH} characters
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving || locating}
            accessibilityRole="button"
            accessibilityLabel="Save network report"
            className={`bg-blue-600 rounded-xl py-4 shadow-lg mt-8 ${saving || locating ? 'opacity-70' : ''}`}
          >
            {locating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {saving ? 'Saving…' : !coords ? 'Fetching Location…' : 'Save Report'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Retry Location Button */}
          {!locating && !coords && (
            <TouchableOpacity
              onPress={requestLocation}
              accessibilityRole="button"
              accessibilityLabel="Retry fetching location"
              className="bg-gray-500 rounded-xl py-4 mt-4"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Retry Location
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});