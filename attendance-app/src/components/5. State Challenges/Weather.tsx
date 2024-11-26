import { View, Text, FlatList, TextInput, Button } from 'react-native'
import React, { useState } from 'react'

const Weather = () => {
    const [weather, setWeather] = useState([
        {
            name: 'Berlin',
            temp: 20,
            state: 'Clear'
        },
        {
            name: 'Cambodia',
            temp: 10,
            state: 'Cold'
        },
        {
            name: 'Germany',
            temp: 25,
            state: 'Sunny'
        }
    ])

    const [cityweather, setCityWeather] = useState('');

    const [result, setResult] = useState({temp: 0, state: ''})

    const getWeather = () => {
        let flag = true;
        weather.forEach(item => {
            if(item.name === cityweather) {
                setResult({...result, temp: item.temp, state: item.state})
                flag = false;
            }
        })

        if(flag) {setResult({...result, temp: 0, state: 'City not Found'})}
    }
    
    

  return (
    <View>
      <Text>Weather</Text>

      <TextInput onChangeText={setCityWeather} 
      value={cityweather} 
      placeholder='Enter City Name'  />

      {cityweather === '' ? null : <Text>{result.temp} {result.state}</Text>}

      <Button title='Get City Weather' onPress={getWeather} />
    </View>
  )
}

export default Weather