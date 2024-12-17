import React from 'react';
import {Text,View,Image,TextInput} from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';

export default class Login extends React.Component{
    render(){
        return(
            <view style={{background:"#FFF",height:"100%"}}>
                <Image source={require('../images/image.jpg')}
                style={{width:"100%",height:"43%"}}/>
                <Text
                 style={{
                    fontSize:30,
                    fontFamily:"SemiBold",
                    alignSelf:"center",
                    }}>
                    Login</Text>
                    <Text
                    style={{
                        fontFamily:"Medium",
                        marginHorizontal:50,
                        alignSelf:"center",
                        opacity:0.4
                    }}>
                        HI ALL
                    </Text>
                    <view style={{
                        flexDirection:"row",
                        alignItems:"center",
                        marginHorizontal:55,
                        borderWidth:2,
                        marginTop:50,
                        paddingHorizontal:10,
                        borderColor:"#00716F",
                        borderRadius:23,
                        paddingVertical:2
                    }}>
                        <Icon name="mail" color="#00716F" size={24}></Icon>
                        <TextInput 
                            style={{paddingHorizontal:10}}/>

                    </view>

                    <view style={{
                        flexDirection:"row",
                        alignItems:"center",
                        marginHorizontal:55,
                        borderWidth:2,
                        marginTop:15,
                        paddingHorizontal:10,
                        borderColor:"#00716F",
                        borderRadius:23,
                        paddingVertical:2
                    }}>
                        <Icon name="mail" color="#00716F" size={24}></Icon>
                        <TextInput 
                            style={{paddingHorizontal:10}}/>

                    </view>
                    <view style={{
                        marginHorizontal:55,
                        alignItems:"center",
                        justifyContent:"center",
                        marginTop:30,
                        backgroundColor:"#00716F",
                        paddingVertical:8,
                        borderRadius:23,



                    }}>
                        <Text style={{
                            color:"white",
                            fontFamily:"SemBold",
                        }}>
                            Already a member</Text>
                    </view>
            </view>
        )
    }
}