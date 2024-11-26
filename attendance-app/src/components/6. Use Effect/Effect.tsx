import { View, Text, Button } from 'react-native'
import React, { useState, useEffect } from 'react'

const Effect = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.warn("Use Effect activated");
    }, [])

  return (
    <View>
      <Text>{count}</Text>

      <Button title='Increment' onPress={() => setCount(count+1)}/>
    </View>
  )
}

export default Effect