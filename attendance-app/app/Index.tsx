import React, { useEffect, useState } from 'react';
import MainDisplay from './Home';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MarkAttendance from './MarkAttendance';



const Index = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MainDisplay} />
      <Tab.Screen name="Mark Attendance" component={MarkAttendance} />
    </Tab.Navigator>
  )
}

export default Index;
