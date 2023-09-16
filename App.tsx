import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SpeedToText from './src/SpeedToText';
import TextToSpeed from './src/TextToSpeed';
const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="SpeedToText" component={SpeedToText} />
        <Tab.Screen name="TextToSpeed" component={TextToSpeed} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
