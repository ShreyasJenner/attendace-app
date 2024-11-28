import { View, Text, Button } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useCounter } from '../store/store'

const Index = () => {
  const count = useCounter(state => state.count);
  const increment = useCounter(state => state.increment);
  const decrement = useCounter(state => state.decrement);

  return (
    <View>
      <Text>Index Screen</Text>
      <Text>{count}</Text>
      <Button title='Increment' onPress={increment} />
      <Button title='Decrement' onPress={decrement} />
      <Link href='./Home'>Home Screen</Link>
      <Link href='./About'>About Screen</Link>
      <Link href='./Contact'>Contact Screen</Link>
      <Link href='/_sitemap'>Sitemap</Link>
    </View>
  )
}

export default Index