import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Home from '../Screens/Home/Home';
import ChatScreen from '../Screens/Chat/ChatScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#3E7C78',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
export default MainNavigator;
