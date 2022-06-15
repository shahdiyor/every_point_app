import React,{useEffect,useState} from 'react';
import { StyleSheet, View, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./screens/LoginScreen";
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();

export default function App() {

  const [isLoggedin, setLogged] = useState(null)

  async function tk(){
    const token = await AsyncStorage.getItem('token')
    if(token){
      setLogged(true)
    }else{
      setLogged(false)
    }
  }
  useEffect(()=>{ tk() })

  return (
    <NavigationContainer independent='true'>
      <Stack.Navigator>
        <Stack.Screen name="loading" component={LoadingScreen}  />
        <Stack.Screen name="home" component={HomeScreen}  headerMode="screen" options={{ headerShown: false }}/>  
        <Stack.Screen name="login" component={LoginScreen} options={{title: 'Авторизация'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}