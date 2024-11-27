import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native'
import React, { useReducer, useState } from 'react'

interface ProfileList {
    id: number,
    name: string, 
    age: string
}

interface State {
    profile_list: ProfileList[]
}

interface AddUser {
    type: 'add',
    id: number,
    name: string,
    age: string
}

interface RemoveUser {
    type: 'remove'
    id: number,
}

interface EditUser {
    type: 'edit',
    id: number,
    name: string,
    age: string
}

type Action = AddUser | RemoveUser | EditUser

const initialState = {profile_list: []};

function reducer(state: State, action: Action) {
    switch(action.type) {
        case 'add':
            return {
                profile_list: [
                    ...state.profile_list, 
                    {id: action.id, name: action.name, age: action.age}
                ]
            }

        case 'remove':
            return {
                profile_list: state.profile_list.filter((user) => user.id !== action.id)
            }

        case 'edit':
            return {
                profile_list: state.profile_list.map((user) => 
                    user.id === action.id ? {...user, name: action.name, age: action.age} : user)
            }

        default:
            return state
    }
}

const ProfileManager = () => {
    // reducer for profile list
    const [state, dispatch] = useReducer(reducer, initialState);

    // name use state
    const [name, setName] = useState('');

    // age use state
    const [age, setAge] = useState('');

    // index use state
    const [index, setIndex] = useState(0);

    // function to convert age to numbers
    const handleAge = (age: string) => {
        const numericValue = age.replace(/[^0-9]/g, "");
        setAge(numericValue);
    }


    // add user profile
    const addProfile = () => {
        if(name !== '' && age != '') {
            dispatch({
                type: 'add',
                id: index,
                name: name,
                age: age
            })
            setName('')
            setAge('')
            setIndex(index+1);
        }
    }

    // remove user profile
    const removeProfile = (id: number) => {
        dispatch({type: 'remove', id: id})
    }

    // edit user profile
    const editProfile = (id: number) => {
        if(name !== '' && age != '') {
            dispatch({
                type: 'edit',
                id: id,
                name: name,
                age: age
            })
            setName('')
            setAge('')
        }
    }

  return (
    <View>
      <Text>Profile Manager</Text>

      // name text input field
      <TextInput placeholder='Enter Name' value={name} onChangeText={setName} />

      // age text input field
      <TextInput placeholder='Enter Age' value={age} onChangeText={handleAge} keyboardType='numeric' />

      // button to add user
      <Button title='Add User' onPress={addProfile} />

      // flatlist to see profiles
      <FlatList 
      data={state.profile_list}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (
        <View>
            <Text>{item.name}, {item.age} years old </Text>

            <TouchableOpacity onPress={() => editProfile(item.id,)} >
                <Text>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => removeProfile(item.id)}>
                <Text>Remove</Text>
            </TouchableOpacity>
        </View>
      )} />
    </View>
  )
}

export default ProfileManager