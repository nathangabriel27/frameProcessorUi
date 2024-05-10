import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../../src/Screens/Home';
import Reanimated from '../../src/Screens/Reanimated';
import CameraScreen from '../../src/Screens/CameraScreen';
import OCRScreen from '../Screens/OCRScreen';

const Stack = createStackNavigator();

function Routes() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}  />
        <Stack.Screen name="Reanimated" component={Reanimated} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name='OCRSceen' component={OCRScreen} />
      </Stack.Navigator>
  );
}

export default Routes;
