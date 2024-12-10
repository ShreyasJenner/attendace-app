import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MarkAttendance from './MarkAttendance';
import Home from './Home';
import { DetailsProvider } from '@/Context/DetailsContext';



const Index = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <DetailsProvider>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Mark Attendance" component={MarkAttendance} />
      </Tab.Navigator>
    </DetailsProvider>
  )
}

export default Index;
