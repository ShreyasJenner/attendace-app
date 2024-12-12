import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MarkAttendance from './MarkAttendance';
import Home from './Home';
import { DetailsProvider } from '@/Context/DetailsContext';
import Timestamps from './Timestamps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Index = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DetailsProvider>
        <Tab.Navigator screenOptions={{lazy: true}}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Mark Attendance" component={MarkAttendance} />
          <Tab.Screen name="Timestamps" component={Timestamps} />
        </Tab.Navigator>
      </DetailsProvider>
    </GestureHandlerRootView>
  );
};

export default Index;
