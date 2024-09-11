import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../../src/Screens/Home';
import Reanimated from '../../src/Screens/Reanimated';
import CameraScreen from '../../src/Screens/CameraScreen';
import OCRScreen from '../Screens/OCRScreen';
import CameraScreenModelObject from '../Screens/CameraScreenModelObject';
import CameraAnimais from '../Screens/CameraAnimais';
import CameraTestScreen from '../Screens/CameraTestScreen';
import CameraIANando from '../Screens/CameraIANando';
import NativeAndroid from '../Screens/NativeAndroid';
import NativeIOS from '../Screens/NativeIOS';
import TestComponent from '../Screens/TestComponent';
import CameraPlugin from '../Screens/CameraPlugin';
import CameraCrop from '../Screens/CameraCrop';

const Stack = createStackNavigator();

function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Reanimated" component={Reanimated} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name='OCRScreen' component={OCRScreen} />
      <Stack.Screen name='CameraScreenModelObject' component={CameraScreenModelObject} />
      <Stack.Screen name='CameraAnimais' component={CameraAnimais} />
      <Stack.Screen name='CameraTestScreen' component={CameraTestScreen} />
      <Stack.Screen name='CameraIANando' component={CameraIANando} />
      <Stack.Screen name='NativeAndroid' component={NativeAndroid} />
      <Stack.Screen name='NativeIOS' component={NativeIOS} />
      <Stack.Screen name='TestComponent' component={TestComponent} />
      <Stack.Screen name='CameraPlugin' component={CameraPlugin} />
      <Stack.Screen name='CameraCrop' component={CameraCrop} />

    </Stack.Navigator>
  );
}

export default Routes;
