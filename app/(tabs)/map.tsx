import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { databases, DB_ID, REPORTS_COL_ID } from "@/lib/appwrite";

interface Report {
  $id: string;
  userId: string;
  network: string;
  strength: "Strong" | "Weak" | "Deadzone";
  note: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

const strengthColor: Record<Report["strength"], string> = {
  Strong: "#16A34A", // Green-600
  Weak: "#EAB308", // Yellow-500
  Deadzone: "#4B5563", // Gray-600
};

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [locating, setLocating] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);

  const requestLocation = useCallback(async () => {
    try {
      setLocating(true);
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services to view the map."
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Denied",
          "Please grant location permissions to view the map."
        );
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch (e: any) {
      console.error("Location error:", e);
      Alert.alert(
        "Location Error",
        `Unable to get location: ${e.message || "Unknown error"}.`
      );
    } finally {
      setLocating(false);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      setLoadingReports(true);
      const response = await databases.listDocuments(DB_ID, REPORTS_COL_ID);
      setReports(response.documents as Report[]);
    } catch (e: any) {
      console.error("Fetch reports error:", e);
      Alert.alert("Error", "Failed to load reports. Please try again.");
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
    fetchReports();
  }, [requestLocation, fetchReports]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-200">
        <Text className="text-3xl font-extrabold text-gray-900 text-center">
          ZoneX Network Map
        </Text>
      </View>

      {locating || !userLocation ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-600 mt-3 text-base">
            Fetching your location...
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation
            showsCompass
            accessibilityLabel="Network signal map"
          >
            {reports.map((report) => (
              <Marker
                key={report.$id}
                coordinate={{
                  latitude: report.latitude,
                  longitude: report.longitude,
                }}
                pinColor={strengthColor[report.strength]}
              >
                <Callout tooltip>
                  <View className="bg-white rounded-2xl shadow-lg p-3 w-48">
                    <Text className="mb-1 text-gray-900">
                      Network Name: {report.network}
                    </Text>
                    <Text className="text-gray-800">
                       Strength:{" "}
                      <Text style={{ color: strengthColor[report.strength] }}>
                        {report.strength}
                      </Text>
                    </Text>
                    {report.note && (
                      <Text className="text-gray-700 mt-1">Description: {report.note}</Text>
                    )}
                    <Text className="text-gray-500 text-xs mt-2">
                      {new Date(report.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {/* Floating Refresh Button */}
          <TouchableOpacity
            onPress={fetchReports}
            disabled={loadingReports}
            className={`absolute bottom-6 right-6 bg-blue-600 rounded-full px-5 py-4 shadow-xl ${
              loadingReports ? "opacity-70" : ""
            }`}
            accessibilityRole="button"
            accessibilityLabel="Refresh reports"
          >
            <Text className="text-white font-bold text-base">
              {loadingReports ? "..." : "↻"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
