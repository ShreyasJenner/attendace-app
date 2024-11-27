import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native'
import React, { useReducer, useState } from 'react'

interface task {
    id: number,
    value: string
}

interface State {
    todos: task[]
}

interface AddTodo {
    type: 'add',
    id: number,
    value: string
}

interface RemoveTodo {
    type: 'remove',
    id: number
}

type Action = AddTodo | RemoveTodo;

const initialState = {todos: []};

function reducer(state:State, action: Action): State {
    switch(action.type) {
        case 'add':
            return {
                todos: [
                    ...state.todos, 
                    {id: action.id, value: action.value}
                ]
            };

        case 'remove':
            return {
                todos: state.todos.filter((todo) => todo.id !== action.id)
            }

        default:
            return state;
    }
}

const Todo = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);


    const addTask = () => {
        if(text !== '') {
            dispatch({
                type: 'add',
                id: index,
                value: text
            })
            setText('');
            setIndex(index+1);
        }
    }

    const removeTask = (id: number) => {
        dispatch({type: 'remove', id: id})
    }

  return (
    <View>
      <Text>Todo List</Text>

      <TextInput placeholder='Enter a ToDo'
      value={text}
      onChangeText={setText} />

      <Button title='Add Task' onPress={addTask} />

      <FlatList 
        data={state.todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
        <View>
            <Text>{item.id} {item.value}</Text>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
                <Text>Remove</Text>
            </TouchableOpacity> 
        </View>
      )}
      />

    </View>
  )
}

export default Todo