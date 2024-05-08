import * as React from 'react';

import Home from '../src/Home';
import Details from '../src/Details';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function Routes() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}  />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
  );
}

export default Routes;
