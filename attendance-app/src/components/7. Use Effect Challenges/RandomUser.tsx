import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

/*
interface UserData {
    results: [
        {
            gender:string,
            name: 
            {
                title: string,
                first: string,
                last: string
            },
            location: 
            {
                street: 
                {
                    number: number,
                    name: string
                },
                city: string,
                state: string,
                country: string,
                postcode: number,
                coordinates: 
                {
                    latitude:string,
                    longitude:string
                },
                timezone: 
                {
                    offset:string,
                    description:string
                }
            },
            email:string,
            login:
            {
                uuid: string,
                username: string,
                password: string,
                salt: string,
                md5: string,
                sha1: string,
                sha256: string
            },
            dob: 
            {
                date: string,
                age: number
            },
            registered:
            {
                date: string,
                age: number
            },
            phone: string,
            cell: string,
            id: 
            {
                name:string,
                value: string
            },
            picture:
            {
                large: string,
                medium: string,
                thumbnail: string
            },
            nat: string
        }
    ],
    info: 
    {
        seed: string,
        results: number,
        page: number,
        version: string
    }
}*/

interface UserData {
        gender:string,
        name: 
        {
            title: string,
            first: string,
            last: string
        },
        location: 
        {
            street: 
            {
                number: number,
                name: string
            },
            city: string,
            state: string,
            country: string,
            postcode: number,
            coordinates: 
            {
                latitude:string,
                longitude:string
            },
            timezone: 
            {
                offset:string,
                description:string
            }
        },
        email:string,
        login:
        {
            uuid: string,
            username: string,
            password: string,
            salt: string,
            md5: string,
            sha1: string,
            sha256: string
        },
        dob: 
        {
            date: string,
            age: number
        },
        registered:
        {
            date: string,
            age: number
        },
        phone: string,
        cell: string,
        id: 
        {
            name:string,
            value: string
        },
        picture:
        {
            large: string,
            medium: string,
            thumbnail: string
        },
        nat: string
}

const RandomUser = () => {
    const [user, setUser] = useState<UserData[]>([]);

    useEffect(() => {
        const uri = 'https://randomuser.me/api/?results=3';
        const fetchData = async () => {
            const res = await (await fetch(uri)).json();
            setUser([...user, res.results[0]]);
        }

        try {
            fetchData();
        } catch(err) {
            console.error(err);
        }
    })

    console.log(user[0]);

  return (
    <View>
      <Text>Random User</Text>

      <FlatList 
      keyExtractor={(item) => item.id.value}
      data={user}
      renderItem={({item}) => (
        <View style={styles.containerStyle}>
            <Image style={styles.imageStyle} source={{uri: item.picture.medium}} />
            <Text>Name: {item.name.title} {item.name.first} {item.name.last}</Text>
            <Text>Email: {item.email}</Text>
        </View>
      )}/>
    </View>
  )
}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: "row"
    },
    imageStyle: {
        width: 150,
        height: 150
    },
    textStyle: {
        fontSize: 20
    }
})

export default RandomUser