import { View, Text, Button } from 'react-native'
import { useState } from 'react'

const WithState = () => {
     const [count, setCount] = useState(1);
     console.log(count);

  return (
    <View>
      <Text>Counter: {count}</Text>
      <Button title='Increase Count' onPress={() => setCount(count * 2)} />

      <Button title='Decrease Count' onPress={() => setCount(count / 2)} />
    </View>
  )
}

export default WithState