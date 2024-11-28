import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { NumberContext } from '@/src/Context/NumberContext'

const NumberC = () => {
    const context = useContext(NumberContext);
    if(!context) {
        throw new Error('Error getting number context');
    }

    const {no} = context;

  return (
    <View>
      <Text>{no}</Text>
    </View>
  )
}

export default NumberC