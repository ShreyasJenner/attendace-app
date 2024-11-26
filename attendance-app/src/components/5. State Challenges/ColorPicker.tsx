import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const ColorPicker = () => {
    const colors = ['red', 'black', 'green', 'yellow'];
    const [color, setColor] = useState('white');

  return (
    <View style={{backgroundColor: color, alignItems: 'center'}}>
      {colors.map(color => (
        <TouchableOpacity 
        style={[styles.buttonStyle, {backgroundColor: color}]}
        onPress={()=> setColor(color)}></TouchableOpacity>
      ) )}
    </View>
  )
}

const styles = StyleSheet.create({
    buttonStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 30
    }
})

export default ColorPicker