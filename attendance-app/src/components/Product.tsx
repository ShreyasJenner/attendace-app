import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

interface prodProp {
  name: string;
  image: string;
  price: number;
  descr: string;
  feature: boolean;
}

const Product = ({name, image, price, descr, feature}: prodProp) => {
  return (
    <View style={styles.containerStyle}>
      <Image style={styles.imageStyle} source={{uri: image}} />
      <Text style={styles.textStyle}>Name: {name}</Text>
      <Text style={styles.textStyle}>Price: {price}</Text>
      <Text style={styles.textStyle}>Description: {descr}</Text>
      {feature && <Text>Featured</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: "#000",
    backgroundColor: "#fff",
    elevation: 5,
    marginBottom: 10,
    borderRadius: 10
  },
  textStyle: {
    fontSize: 20,
  },
  imageStyle: {
    width: 50,
    height: 50,
    padding: 5
  }
})

export default Product