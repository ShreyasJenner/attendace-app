import { View, Text } from 'react-native'
import WithoutState from '../components/1. Basic Counter/WithoutState'
import WithState from '../components/1. Basic Counter/WithState'
import UpdateArray from '../components/2. Updating Arrays/UpdateArray'
import UpdateObject from '../components/3. Update Objects/UpdateObject'
import Component1 from '../components/4. Sharing State/Component1'
import Component2 from '../components/4. Sharing State/Component2'
import SharingState from '../components/4. Sharing State/SharingState'
import Toggle from '../components/5. State Challenges/Toggle'
import Weather from '../components/5. State Challenges/Weather'
import ColorPicker from '../components/5. State Challenges/ColorPicker'
import ToDo from '../components/5. State Challenges/ToDo'
import Effect from '../components/6. Use Effect/Effect'
import DataFetching from '../components/6. Use Effect/DataFetching'
import FoodList from '../components/7. Use Effect Challenges/FoodList'
import RandomUser from '../components/7. Use Effect Challenges/RandomUser'
import Counter from '../components/8. Use Reducer/Counter'
import Todo from '../components/8. Use Reducer/Todo'
import ProfileManager from '../components/8. Use Reducer/Profiler'
import ComponentA from '../components/9. Prop Drilling/ComponentA'
import { UserProvider } from '../Context/UserContext'
import { NumberContext, NumberProvider } from '../Context/NumberContext'
import NumberA from '../components/10. Context Challenge/NumberA'
import WithoutHook from '../components/11. Custom Hook/WithoutHook'
import WithHook from '../components/11. Custom Hook/WithHook'
import FormHook from '../components/11. Custom Hook/FormHook'


const Index = () => {

  const name = "Shreyas";
  
  return (
    <View>
      {/* <WithoutState /> */}
      {/* <WithState /> */}
      {/* <UpdateArray /> */}
      {/* <UpdateObject /> */}
      {/* <Component1 /> */}
      {/* <Component2 /> */}
      {/* <SharingState /> */}
      {/* <Toggle /> */}
      {/* <Weather /> */}
      {/* <ColorPicker /> */}
      {/* <ToDo /> */}
      {/* <Effect /> */}
      {/* <DataFetching /> */}
      {/* <FoodList /> */}
      {/* <RandomUser /> */}
      {/* <Counter /> */}
      {/* <Todo /> */}
      {/* <ProfileManager /> */}
      
      {/* <UserProvider>
        <ComponentA />
      </UserProvider> */}

      {/* <NumberProvider>
        <NumberA />
      </NumberProvider> */}

      {/* <WithoutHook /> */}
      {/* <WithHook /> */}
      {/* <FormHook /> */}

    </View>
  )
}

export default Index