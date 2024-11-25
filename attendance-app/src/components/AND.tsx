import { View, Text, FlatList } from 'react-native'
import React from 'react'

const AND = () => {
    const prod = ['milk', 'eggs', 'cheese'];

  return (
    <View>
        <Text>Cart</Text>

        {prod.length > 0 && (<Text>No of items: {prod.length}</Text>)}

        <FlatList 
        keyExtractor={(item,index) => index.toString()}
        data={prod}
        renderItem={({item}) => <Text>{item}</Text>}
        />
    </View>
  )
}

export default AND