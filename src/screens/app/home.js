import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, PermissionsAndroid, Platform, Alert, TouchableOpacity, Modal, Image } from 'react-native';
import Geolocation from '@react-native-community/geolocation'; 
import { Routes } from '../../navigation';

const nearbyPlaces = [
  {
    id: 1,
    name: 'Shop 1',
    latitude: 8.1771,
    longitude: 77.4340,
    description: 'This is a popular shop where you can find a variety of electronics, home appliances, and accessories. They are known for their great customer service and frequent sales events.',
    imageUrl: 'https://images.pexels.com/photos/135620/pexels-photo-135620.jpg', 
  },
  {
    id: 2,
    name: 'Shop 2',
    latitude: 8.1782,
    longitude: 77.4352,
    description: 'A local shop offering a range of everyday items like groceries, snacks, and household goods. It’s a great place to stop by for quick essentials.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUpp6AVCubklwHJOR7GbsyJss1WU5_Guge7A&s', 
  },
  {
    id: 3,
    name: 'School 1',
    latitude: 8.1793,
    longitude: 77.4365,
    description: 'A primary school known for its nurturing environment and emphasis on academic excellence. It has state-of-the-art facilities and a dedicated staff focused on the holistic development of children.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStvKmx9iedtcTwHxAgv5YkSdDZbggELY0pfw&s', 
  },
  {
    id: 4,
    name: 'Shop 3',
    latitude: 8.1804,
    longitude: 77.4378,
    description: 'A well-stocked grocery store offering fresh produce, organic options, and a wide range of household products. It’s perfect for your weekly grocery runs.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHu55qoCgPTau60FsS8I6IBbjMWF1ixU6B5g&s', 
  },
  {
    id: 5,
    name: 'School 2',
    latitude: 8.1815,
    longitude: 77.4390,
    description: 'A secondary school that provides a rigorous academic curriculum with a focus on science, technology, and arts. It has modern classrooms and extracurricular activities to encourage student growth.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-wrBGU3jQVcqCoNzMy8d6zEpj2h3fwI1TJg&s', 
  },
];

const Home = ({ navigation ,route}) => {
  const [location, setLocation] = useState({
    latitude: route.params?.latitude || null,
    longitude: route.params?.longitude || null,
    error: null,
  });

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    
    // This useEffect ensures that when the location changes, it updates the state
    if (route.params?.latitude && route.params?.longitude) {
      setLocation({
        latitude: route.params.latitude,
        longitude: route.params.longitude,
        error: null,
      });
    }
  }, [route.params]);

  const requestLocationPermission = async () => {
    console.log('Requesting location permission...');
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
        console.log('Location permission denied.');
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return false;
      } else {
        console.log('Location permission granted.');
        return true;
      }
    } else {
      console.log('iOS: Location permission granted automatically.');
      return true;
    }
  };

  const getLocation = async () => {
    const permissionGranted = await requestLocationPermission();
    if (permissionGranted) {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
      }

      console.log('Getting current location...');
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location fetched:', { latitude, longitude });
          setLocation({ latitude, longitude, error: null });
        },
        (error) => {
          console.log('Geolocation error: ', error);
          setLocation({ latitude: null, longitude: null, error: error.message });
          Alert.alert('Error', 'Failed to fetch location. Please try again later.');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }
  };

  const viewMap = (place) => {
    navigation.navigate(Routes.DATA, {
      latitude: place.latitude,
      longitude: place.longitude,
      name: place.name,
      description:place.description,
    });
  };

  const renderPlace = ({ item }) => (
    <View style={styles.placeItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.placeImage} />
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.placeDescription}>{item.description}</Text>

     
      <TouchableOpacity
        style={styles.viewMapButton}
        onPress={() => viewMap(item)}
      >
        <Text style={styles.viewMapButtonText}>View Map</Text>
      </TouchableOpacity>
    </View>
  );

  const handleLogout = () => {
    setModalVisible(true);
  };

  const confirmLogout = () => {
    setModalVisible(false);
    Alert.alert('Logged out successfully');
    navigation.navigate(Routes.OUTSIDE_STACK, { screen: Routes.LOGIN });
  };

  const cancelLogout = () => {
    setModalVisible(false);
  };

  const updateCurrentLocation = () => {
    console.log('Updating location...');
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Updated location:', { latitude, longitude });
        setLocation({ latitude, longitude, error: null });
  
       
        navigation.navigate(Routes.MAPS, {
          latitude,
          longitude,
          name: 'Your Current Location',  
          description: 'This is my current location.',
        });
      },
      (error) => {
        console.error('Geolocation error: ', error);
        setLocation({ latitude: null, longitude: null, error: error.message });
      },
     
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Places</Text>

      {location.error ? (
        <Text style={styles.error}>Error: {location.error}</Text>
      ) : location.latitude && location.longitude ? (
        <Text style={styles.location}>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : null}

      <TouchableOpacity style={styles.currentLocationButton} onPress={updateCurrentLocation}>
        <Text style={styles.currentLocationButtonText}>Current Location</Text>
      </TouchableOpacity>

      <FlatList
        data={nearbyPlaces}
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
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeDescription: {
    fontSize: 14,
    color: 'gray',
  },
  viewMapButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  viewMapButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  currentLocationButton: {
    backgroundColor: 'green',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  currentLocationButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: 'green',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
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
