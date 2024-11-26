import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'

const UpdateObject = () => {
    const [games, setGames] = useState({
        title: 'Persona',
        rating: 7
    });

    const handleClick = () => {
        setGames({...games, title: 'Atlier 5', rating: 10});
    }

  return (
    <View>
      <Text>Title: {games.title}</Text>
      <Text>Rating: {games.rating}</Text>

      <Button title='Change Game' onPress={handleClick}/>
    </View>
  )
}

export default UpdateObject