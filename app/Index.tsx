import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MarkAttendance from './MarkAttendance';
import Home from './Home';
import { DetailsProvider } from '@/Context/DetailsContext';
import Timestamps from './Timestamps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CourseModification from './CourseModification';
import { Dimensions } from 'react-native';

const Index = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DetailsProvider>
        <Tab.Navigator initialLayout={{width: Dimensions.get('window').width}} screenOptions={{lazy: true}}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Mark Attendance" component={MarkAttendance} />
          <Tab.Screen name="Modify Timestamp" component={Timestamps} />
          <Tab.Screen name="Modify Courses" component={CourseModification} />
        </Tab.Navigator>
      </DetailsProvider>
    </GestureHandlerRootView>
  );
};

export default Index;
