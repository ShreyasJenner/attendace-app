import { View, Text } from 'react-native'
import React from 'react'


const ValidPass = () => <Text>Valid Password</Text>;


const InvalidPass = () => <Text>Invalid Password</Text>;

const Password = ({isValid}) => {
    return isValid ? <ValidPass /> : <InvalidPass />
}

const Ternary = () => {
  return (
    <View>
        <Password isValid={false} />
    </View>
  )
}

export default Ternary