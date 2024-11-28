import { View, Text, FlatList } from 'react-native'
import React from 'react'
import useFetch from '@/src/Hooks/useFetch'

const WithHook = () => {
    const [data] = useFetch('https://jsonplaceholder.typicode.com/todos');

  return (
    <View>
        <Text>With Hook</Text>
        <FlatList 
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <Text>{item.title}</Text>}/>
    </View>
  )
}

export default WithHook