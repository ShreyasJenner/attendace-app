import { View, Text, Button } from 'react-native'
import React from 'react'

interface CountInterface {
    milk: any,
    onClickHandler: () => void
}


const Component2 = ({milk, onClickHandler}: CountInterface) => {
  return (
    <View>
      <Text>Count 2: {milk}</Text>
      <Button title='Increment Count 2' onPress={onClickHandler} />
    </View>
  )
}

export default Component2