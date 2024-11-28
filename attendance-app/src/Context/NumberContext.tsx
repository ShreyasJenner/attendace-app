import { Children, createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Button, View } from "react-native";

interface Number {
    id: number,
    value: number
}

interface RandomNumber {
    no: number,
    setNo: Dispatch<SetStateAction<number>>,
    list: Number[]
}

const NumberContext = createContext<RandomNumber | undefined>(undefined);

const NumberProvider = ({children}: {children: ReactNode}) => {
    const [no, setNo] = useState(0);
    const [index, setIndex] = useState(0);
    const [list, setList] = useState<Number[]>([]);

    const randomNumber = () => {
        setNo(Math.floor(Math.random()*100));
        setList([...list, {id: index , value: no}]);
        setIndex(index+1);
    }

    return (
        <View>
            <NumberContext.Provider value={{ no, setNo, list}}>
            {children}
            </NumberContext.Provider>

            <Button title="Add Random Number" onPress={randomNumber} />
        </View>
        
        
    )
};

export {NumberContext, NumberProvider}