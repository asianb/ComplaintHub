import React from 'react'
import {StyleSheet,Image, Text, View } from 'react-native'
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold
}from '@expo-google-fonts/montserrat'

import{TouchableOpacity} from 'react-native-gestrue-handler'
import { text } from 'express'

const Home = (props) => {
    let[fontsLoaded]=useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
        Montserrat_700Bold
    })
    return(
        <View style= {styles.container}>
            <Image source={require('../img/audi-a7')} style= {styles.img}/>
            <Text style={styles.title}>Maxx Scooter</Text>
            <Text> with an update car and adjaks djadjk jadjkahf jafeh</Text>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => props.navigation.navigate("Detail")}>
                <Text>style={styles.text} Next</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Detail 
const styles= StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#121212"
    },
    img:{
        height:"50%",
        width:"120%",
        resizeMode:"contain",
    },
    title:{
        color:'#FFF',
        fontFamily:"Montserrat_700Bold",
        fontStyle:30,
        marginTop:20
    },
    detail:{
        color:"#FFF",
        fontFamily:"Montserrat_400Regular",
        fontSize:18,
        textAlign:"center",
        paddingHorizontal:20,
        marginTop:30,
    },
    btn:{
        marginTop:80,
        backgroundColor:"#E2443B",
        paddingHorizontal:140,
        paddingVertical:10,
        borderRadius:30
    },
    text:{
        fontFamily:"Montserrat_600SemiBold",
        fontSize:30,
        color:"#FFF"

    },

});