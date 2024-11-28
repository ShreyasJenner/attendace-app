import { View, Text, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import useForm from '@/src/Hooks/useForm';

const FormHook = () => {
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');

  return (
    <View>
      <Text>Form Hook</Text>
      <TextInput value={name} onChangeText={setName} placeholder='Enter name'/>
      <TextInput value={mail} onChangeText={setMail} placeholder='Enter mail'/>

      <Button title='Sumbit' onPress={() => useForm(name, mail)} />
    </View>
  )
}

export default FormHook