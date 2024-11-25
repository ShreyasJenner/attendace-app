import { View, Text } from 'react-native'
import React from 'react'


const ValidPass = () => <Text>Valid Password</Text>;


const InvalidPass = () => <Text>Invalid Password</Text>;

const Password = ({isValid}) => {
    if(isValid === true) {
        return <ValidPass />;
    } else {
        return <InvalidPass />;
    }
}

const Conditional = () => {
  return (
    <View>
        <Password isValid={true} />
    </View>
  )
}

export default Conditional