import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, PermissionsAndroid, Platform, Alert, TouchableOpacity, Modal, Button } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Routes } from '../../navigation';

const nearbyPlaces = [
  { id: 1, name: 'Shop 1', latitude: 8.1771, longitude: 77.4340, description: 'This is a popular shop.' },
  { id: 2, name: 'Shop 2', latitude: 8.1782, longitude: 77.4352, description: 'This is a local shop.' },
  { id: 3, name: 'School 1', latitude: 8.1793, longitude: 77.4365, description: 'A primary school.' },
  { id: 4, name: 'Shop 3', latitude: 8.1804, longitude: 77.4378, description: 'A grocery store.' },
  { id: 5, name: 'School 2', latitude: 8.1815, longitude: 77.4390, description: 'A secondary school.' },
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Home = ({ navigation }) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  const [placesWithDistance, setPlacesWithDistance] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const getLocation = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        if (Platform.OS === 'ios') {
          Geolocation.requestAuthorization('whenInUse');
        }

        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude, error: null });

            const placesWithDistance = nearbyPlaces.map((place) => {
              const distance = calculateDistance(
                latitude,
                longitude,
                place.latitude,
                place.longitude
              );
              return { ...place, distance };
            });
            setPlacesWithDistance(placesWithDistance);
          },
          (error) => {
            setLocation({ latitude: null, longitude: null, error: error.message });
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      }
    };

    getLocation();
  }, []);

  const renderPlace = ({ item }) => (
    <View style={styles.placeItem}>
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.placeDescription}>{item.description}</Text>
      <Text style={styles.placeDistance}>Distance: {item.distance.toFixed(2)} km</Text>
    </View>
  );

  const handleLogout = () => {
    setModalVisible(true);
  };

  const confirmLogout = () => {
    setModalVisible(false);
    Alert.alert('Logged out successfully');
    navigation.navigate(Routes.OUTSIDE_STACK,{Screen:Routes.LOGIN});
  };

  const cancelLogout = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>

      {location.error ? (
        <Text style={styles.error}>Error: {location.error}</Text>
      ) : location.latitude && location.longitude ? (
        <Text style={styles.location}>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.loading}>Loading location...</Text>
      )}

      <FlatList
        data={placesWithDistance}
        renderItem={renderPlace}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

     
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonYes} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonNo} onPress={cancelLogout}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  location: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  placeListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  placeItem: {
    padding: 12,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeDescription: {
    fontSize: 14,
    color: 'gray',
  },
  placeDistance: {
    fontSize: 14,
    color: 'green',
  },
  logoutButton: {
    backgroundColor: 'green',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    width:'50%',
    left:100,
    bottom:70
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 15,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButtonYes: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
  },
  modalButtonNo: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Home;
