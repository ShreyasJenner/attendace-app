import { View, Text, FlatList } from 'react-native'
import React, { useState } from 'react'
import Component1 from './Component1';
import Component2 from './Component2';

const SharingState = () => {
    const [count, setCount] = useState(5);
    const [milk, setMilk] = useState(['milk', 'inside', 'a', 'bag', 'of', 'milk']);

  return (
    <View>
        <Component1 count={count} onClickHandler={() => setCount(count+1)}/>
        <Component2 
        milk={<FlatList 
            keyExtractor={(item, index) => index.toString()} 
            data={milk} 
            renderItem={({item}) => <Text>{item}</Text>}/>} 
        onClickHandler={() => setMilk([...milk, 'milk'])} />
    </View>
  )
}

export default SharingState