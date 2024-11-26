import { View, Text, FlatList, Button } from 'react-native'
import React, { useState } from 'react'


const UpdateArray = () => {
    const [milk, setMilk] = useState(['milk', 'tea']);

    const addOne = () => setMilk([...milk, 'bag'])
    const removeOne = () => setMilk(milk.filter(item => item !== 'bag'));
    const updateBag = () => setMilk(milk.map(item => item === 'bag' ? 
        'Milk inside a bag of milk inside a bag of milk' : item ));

  return (
    <View>
        <FlatList 
            keyExtractor={(item, index) => index.toString()}
            data={milk}
            renderItem={({item}) => <Text>{item}</Text>}
        />


        <Button title='Add one' onPress={addOne} />
        <Button title='Remove bag' onPress={removeOne} />
        <Button title='Update bag' onPress={updateBag} />
    </View>
  )
}

export default UpdateArray