import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native'
import React, { useState } from 'react'

const ToDo = () => {
    const [tasks, setTasks] = useState<string[]>([]);
    const [text, setText] = useState('');

    const addTask = () => {
        if(text !== '') {
            setTasks([...tasks, text]);
            setText('');
        }
    }

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>To Do</Text>

      <TextInput placeholder='Enter task' value={text} onChangeText={setText} />

      <Button title='Enter Task' onPress={addTask}/>

      <Text style={styles.textStyle}>Task List</Text>

      <FlatList 
        keyExtractor={(item, index) => index.toString()} 
        data={tasks}
        renderItem={({item}) => <Text>{item}</Text>}/>
    </View>
  )
}

const styles = StyleSheet.create({
    containerStyle: {
        alignItems: "center"
    },
    textStyle: {
        fontSize: 20,
        marginTop: 5
    }
})

export default ToDo