import { View, Text, FlatList } from 'react-native'
import React, { useContext } from 'react'
import NumberC from './NumberC'
import { NumberContext } from '@/src/Context/NumberContext'

const NumberB = () => {
  const context = useContext(NumberContext);
  if(!context) {
    throw new Error('Error getting context for NumberB')
  }

  const {list} = context;

  return (
    <View>
        <FlatList 
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <Text>{item.value}</Text>
          </View>
        )}/>

        <NumberC />
    </View>
  )
}

export default NumberB