import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'

interface todo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

const DataFetching = () => {
    const [data, setData] = useState<todo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/todos/');
            const result = await res.json();
            setData(result);
        };

        try {
            fetchData();
        } catch(err) {
            console.error(err);
        }

    }, []);

    // console.log(data);


  return (
    <View>
      <Text>Data Fetching</Text>
      <FlatList  
      keyExtractor={(item) => item.id.toString()}
      data={data}
      renderItem={({item}) => (
        <View>
            <Text>{item.id}</Text>
            <Text>{item.title}</Text>
            <Text>{item.completed.toString()}</Text>
        </View>
      )}/>
    </View>
  )
}

export default DataFetching