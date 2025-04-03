import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapsScreen = ({ route }) => {
  const { latitude, longitude, name, description } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title={name} description={description} />
      </MapView>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.placeName}>{name}</Text>
        <Text style={styles.placeDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  detailsContainer: {
    padding: 10,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
  },
  placeName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeDescription: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default MapsScreen;
