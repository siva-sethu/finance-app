import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Maps({ route, navigation }) {
  const { latitude: initialLatitude, longitude: initialLongitude, name, description } = route.params;

  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(initialLatitude);
  const [longitude, setLongitude] = useState(initialLongitude);
  const [selectedLocation, setSelectedLocation] = useState({ latitude: initialLatitude, longitude: initialLongitude });

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(false);
        } else {
          Alert.alert('Permission Denied', 'Location permission is required.');
          setLoading(false);
        }
      } catch (err) {
        console.warn(err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setLatitude(coordinate.latitude);
    setLongitude(coordinate.longitude);
    setSelectedLocation(coordinate);
  };

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    // setLatitude(latitude);
    // setLongitude(longitude);
    setSelectedLocation({ latitude, longitude });
  };

  const handleSaveLocation = () => {
    navigation.navigate('Home', {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress} // Update location on map press
          >
            <Marker
              coordinate={selectedLocation}
              title={name}
              description={description}
              draggable
              onDragEnd={handleMarkerDragEnd} // Update location on marker drag
            />
          </MapView>

          <View style={styles.placeDetails}>
            <Text style={styles.placeTitle}>{name}</Text>
            <Text style={styles.placeDescription}>{description}</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
            <Text style={styles.saveButtonText}>Set as Current Location</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  placeDetails: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 8,
    width: '80%',
  },
  placeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeDescription: {
    color: 'white',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 12,
    width: '80%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: '10%',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
