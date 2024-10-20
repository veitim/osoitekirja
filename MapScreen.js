import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { Button, Icon } from '@rneui/themed';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function MapScreen({route, navigation}) {

    const apikey = process.env.EXPO_PUBLIC_API_KEY;

    const {data} = route.params;
    const [location, setLocation] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    });
    const [adr, setAdr] = useState('')

    useEffect(() => { getLocation() }, []);

    const getLocation = () => {
        fetch(`https://geocode.maps.co/search?q=${data.address}&api_key=${apikey}`)
        .then(response => {
          if (!response.ok)
            throw new Error("Error in fetch:" + response.statusText);
          return response.json()
        })
        .then(data => {
          loc = data[0].display_name.split(", ")
          setAdr(loc[2] + " " + loc[1] + " " + loc[6] + " " + loc[11])
          setLocation({...location, latitude: Number(data[0].lat), longitude: Number(data[0].lon)})
        })
        .catch(err => console.error(err));
      }

    return (
        <View>
          <MapView
            style={{ width: '100%', height: '94%'}} 
            region={location}
          >
            <Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                    }}
            />
          </MapView>
          <Button 
            radius={"sm"} 
            type="solid"
            onPress={() => navigation.navigate('MyPlaces', {data:{adr}})}
          >
            <Icon name="save" color="white" />
            Save Location
          </Button>
          <StatusBar style="auto" />
        </View>
      );
}
