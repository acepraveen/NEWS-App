// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import NewsScreen from './src/screens/NewsScreen';
import FullStory from './src/screens/FullStory';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='NewsScreen'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="NewsScreen" component={NewsScreen} />
        <Stack.Screen name="FullStory" component={FullStory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;