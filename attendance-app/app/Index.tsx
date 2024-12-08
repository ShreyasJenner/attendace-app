import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MarkAttendance from './MarkAttendance';
import Home from './Home';



const Index = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Mark Attendance" component={MarkAttendance} />
    </Tab.Navigator>
  )
}

export default Index;
