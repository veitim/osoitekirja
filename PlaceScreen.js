import { useState, useEffect } from 'react';
import { Input, ListItem, Text, Button, Icon } from '@rneui/themed';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

export default function PlaceScreen({navigation, route}) {

    const { adr } = route.params?.data || {};

    if (adr) {
        console.log(adr);
        saveItem();
    }

    const [address, setAddress] = useState(adr || '');
    const [places, setPlaces] = useState([]);
    console.log(places);

    const db = SQLite.useSQLiteContext();

    useEffect(() => { updateList() }, []);

    const saveItem = async () => {
        try {
          await db.runAsync('INSERT INTO place VALUES (?, ?)', null, adr);
          // Todo: update the course list
          updateList();
        } catch (error) {
          console.error('Could not add item', error);
        }
    };

    const updateList = async () => {
        try {
          const list = await db.getAllAsync('SELECT * from place');
          setPlaces(list);
        } catch (error) {
          console.error('Could not get items', error);
        }
    }
    
      const deleteItem = async (id) => {
        console.log('deleteItem')
        try {
          await db.runAsync('DELETE FROM place WHERE id=?', id);
          await updateList();
        }
        catch (error) {
          console.error('Could not delete item', error);
        }
    }

    return (
        <View>
            <Text>PLACEFINDER</Text>
            <Input 
                placeholder='Type in address' 
                onChangeText={address => setAddress(address)}
                value={address} 
            />
            <Button 
                onPress={() => 
                    navigation.navigate('MapScreen', {data:{address}})} 
                    radius={"sm"} 
                    type="solid">
                SHOW ON MAP
            </Button>
            <View style={{flex:1, alignItems: 'center', justifyContent: 'center',}}>
            <FlatList
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) =>
            <View>
                <Text>
                    {item.address}
                    <Text style={{ color: '#0000ff' }} 
                        onPress={() => deleteItem(item.id)}>   Bought
                    </Text>
                </Text>
            </View>}
            data={places}
            />
            </View>
        </View>
    );
};