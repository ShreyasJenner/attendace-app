import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const About = () => {
  return (
    <View>
      <Text>About Screen</Text>
      <Link href='/users/1'>Dynamic Users 1</Link>
      <Link href='/users/12'>Dynamic Users 12</Link>
    </View>
  )
}

export default About