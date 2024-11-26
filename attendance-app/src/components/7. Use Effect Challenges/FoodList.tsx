import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

interface Food {
    strMeal: string,
    strMealThumb: string,
    idMeal: string
}

const FoodList = () => {
    const [data, setData] = useState<Food[]>([]);

    useEffect(() => {
        const url = 'https://themealdb.com/api/json/v1/1/filter.php?c=seafood';
        const fetchData = async () => {
            const res = await (await fetch(url)).json();
            setData(res.meals);
        }

        try {
            fetchData()
        } catch(err) {
            console.error(err)
        }
    }, []);

    // console.log(data);

  return (
    <View>
      <Text>Food List</Text>
      <FlatList 
      keyExtractor={item => item.idMeal}
      data={data}
      renderItem={({item}) => (
        <View style={styles.containerStyle}>
            <Image style={styles.imageStyle} source={{uri: item.strMealThumb}} />
            <Text style={styles.textStyle}>{item.strMeal}</Text>
        </View>
      )} />
    </View>
  )
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        padding: 10
    },
    textStyle: {
        fontSize: 15
    },
    imageStyle: {
        width: 150,
        height: 150,
        borderRadius: 10
    }
})

export default FoodList