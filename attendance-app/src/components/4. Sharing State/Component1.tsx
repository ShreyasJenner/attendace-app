import { View, Text, Button } from 'react-native'
import React from 'react'

interface CountInterface {
    count: number,
    onClickHandler: () => void
}

const Component1 = ({count, onClickHandler}: CountInterface) => {
  return (
    <View>
        <Text>Count 1: {count}</Text>
        <Button title='Increment Count 1' onPress={onClickHandler} />
    </View>
  )
}

export default Component1