import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: 0 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: true,
        tabBarPosition: 'top',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerStyle: {
            height: 50,
            backgroundColor: 'white'
          }
        }}
      />
      <Tabs.Screen
        name="markattendance"
        options={{
          title: 'Mark Attendance',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerStyle: {
            height: 50,
            backgroundColor: 'white'
          }
        }}
      />
      <Tabs.Screen
        name="timestamps"
        options={{
          title: 'Timestamps',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerStyle: {
            height: 50,
            backgroundColor: 'white'
          }
        }}
      />
      <Tabs.Screen
        name="coursemodification"
        options={{
          title: 'Course Modification',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerStyle: {
            height: 50,
            backgroundColor: 'white'
          }
        }}
      />
    </Tabs>
  );
}
