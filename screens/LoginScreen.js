
import React, { useState } from 'react';
import { StyleSheet, Text, View, 
         TouchableOpacity, KeyboardAvoidingView, 
         Alert } from 'react-native';
import {  TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';

StatusBar.setBarStyle('dark-content', true);

export default function LoginScreen(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setError] = useState();


  sendCred = (props) => {
    // "bcrypt": "^5.0.1",
    console.log(email, password);
    try {
      fetch("http://84.17.43.231:3000/signin", { //тута менять если надо   http://192.168.1.73:3000/signin  84.17.43.231
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": email,
          "password": password
        })
      }).then(res => res.json())
      .then(async (data) => {
        console.log(data);
        if (data.error) {
          setError(data.error);
        }
        try {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('fio',data.fio);
          await AsyncStorage.setItem('post',data.post);
          //await AsyncStorage.setItem('color',data.color);
          console.log( await AsyncStorage.getItem("fio"));
          props.navigation.replace("home");

        } catch (e) {
          // saving error
          console.log("Error Async Storage", e);
        }
      });
    } catch (r) { alert(e); }

  };

  return (
    <View style={{height:'100%', backgroundColor: 'white' }}>
      <View style={{ marginTop: 40, backgroundColor: 'white' }}>
        <KeyboardAvoidingView behavior="position">
          <Text style={{ fontSize: 35, textAlign: 'center', color: "#8062f8", fontWeight:'800'}}>Каждая🎯Точка</Text>

          <TextInput
            label="Номер телефона"
            mode="outlined"
            theme={{ colors: { primary: "#8062f8" } }}
            style={{ marginLeft: 18, marginRight: 18, marginTop: 18, borderRadius: 40 }}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            label="Пароль"
            mode="outlined"
            secureTextEntry={true}
            theme={{ colors: { primary: "#8062f8" } }}
            style={{ marginLeft: 18, marginRight: 18, marginTop: 18 }}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.btn}
            //onPress={() => sendCred(props)}  
            onPress={() => props.navigation.replace("home")}
            >
            <Text style={{color:'white'}}>Вход</Text>
          </TouchableOpacity>
          {err ?
            <Text style={{ fontSize: 16, color: "red", textAlign: 'center' }}>{err}</Text> : <Text></Text>}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40
  },
  header: {
    fontSize: 24,
    marginBottom: 60,
    color: '#000',
    fontWeight: 'bold'
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#f5f5f5',
    borderRadius: 15,
    textAlign: 'center'
  },
  btn: {
    margin: 18,
    alignSelf: 'stretch',
    backgroundColor: '#8062f8',
    padding: 13,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
    borderRadius: 10,
    color:'white'
  }
});