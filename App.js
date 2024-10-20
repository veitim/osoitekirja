import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import MapScreen from './MapScreen';
import PlaceScreen from './PlaceScreen';

export default function App() {
  const Stack = createNativeStackNavigator();
  const db = SQLite.openDatabaseSync('placedb');

  const initialize = async (db) => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS place (id INTEGER PRIMARY KEY NOT NULL, address TEXT);`
        );
      // Todo: update the course list
    } catch (error) {
      console.error('Could not open database', error);
    }
  }

  return (
    <SQLiteProvider
      databaseName='placedb.db'
      onInit={initialize}
      onError={error => console.error('Could not open database', error)}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="MyPlaces" component={PlaceScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
