import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { UserContext } from '@/src/Context/UserContext'

const ComponentC = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('Component D must be used within UserProvider');
  }

  const {user, setUser} = context;

  return (
    <View>
      <Text>Component C</Text>
      <Text>{user}</Text>
    </View>
  )
}

export default ComponentC