import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../../src/Screens/Home';
import Details from '../../src/Screens/Details';
import CameraScreen from '../../src/Screens/CameraScreen';

const Stack = createStackNavigator();

function Routes() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}  />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
  );
}

export default Routes;
