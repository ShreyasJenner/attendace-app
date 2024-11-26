import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'

const Toggle = () => {
    const [swit, setSwit] = useState(true);



  return (
    <View>
      <Text>{swit ? 'On' : 'Off'}</Text>
      <Button title='Toggle' onPress={() => setSwit(!swit)} />
    </View>
  )
}

export default Toggle