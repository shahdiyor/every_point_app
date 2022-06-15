import React, { useEffect, useState, Component } from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity, Text, Image, Alert, Platform, PermissionsAndroid, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import Svg, { Ellipse } from "react-native-svg";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";



//222222
import ListView from 'deprecated-react-native-listview';
import Beacons from 'react-native-beacons-manager';
//222222

const LOCATION_TASK_NAME = "background-location-task";


var idd;/////////////////// josko tak nenado no chto delat


export default class reactNativeBeaconExample extends Component {


  constructor(props) {
    super(props);
    // Create our dataSource which will be displayed in the ListView
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }
    );

    this.state = {
      // region information
      uuidRef: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
      clientID: Math.floor(Math.random() * 1000),
      // React Native ListView datasource initialization
      dataSource: ds.cloneWithRows([]),
    };
  };


  componentWillMount() {
    //
    // ONLY non component state aware here in componentWillMount
    //

    // ANDROID SETUP
    if (Platform.OS === 'android') {

      try {
        const granted = PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This example app needs to access your location in order to use bluetooth beacons.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
          // permission denied
        }
      } catch (err) {
        console.warn(err);
      }

      Beacons.detectIBeacons();
      Beacons.setForegroundScanPeriod(500);
      Beacons.setRssiFilter(Beacons.ARMA_RSSI_FILTER, 0.2);
      Beacons.setRssiFilter(Beacons.RUNNING_AVG_RSSI_FILTER, 5000);

      const uuid = this.state.uuidRef;
      Beacons
        .startRangingBeaconsInRegion(
          'REGION1',
          uuid
        )
        .then(
          () => console.log('Beacons ranging started succesfully')
        )
        .catch(
          error => console.log(`Beacons ranging not started, error: ${error}`)
        );
    }

    else { // IOS SETUP

      // Request for authorization while the app is open
      Beacons.requestWhenInUseAuthorization();
      // Define a region
      const region = {
        identifier: 'REGION1',
        uuid: this.state.uuidRef
      };
      // Range for beacons inside the region
      Beacons.startRangingBeaconsInRegion(region);
      // Beacons.startUpdatingLocation();
    }
  }

  componentDidMount() {

    var idSer = '1';
    function UpData(url, roomNum, idSer) {
      fetch(url + idSer
        , {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: 1,
            room: roomNum
          })
        }).then(res => res.json())
        .then(res => console.log(res));
    };
    //
    // component state aware here - attach events
    //

    // Ranging:
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        console.log('----------------------------------------------------------');
        console.log(data.beacons);
        if (data.beacons.length === 1) {
          console.log("_______________________________________________________________");
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data.beacons)
          });

          let distances = [];
          for (var i = 0; i < data.beacons.length; i++) {
            let beacon_distance = Platform.OS === 'ios' ? data.beacons[i].accuracy : data.beacons[i].distance;
            let cell = {
              beaconId: data.beacons[i].major,
              distance: beacon_distance
            }
            distances[i] = cell;
          }

          let payload = {
            Uid: this.state.clientID,
            distance: distances
          };
          console.log("Start");
          //var idd;
          if (distances[0].beaconId == 1) { idd = 301 }
          else if (distances[0].beaconId == 2) { idd = 302 }
          else if (distances[0].beaconId == 3) { idd = 303 }
          else if (distances[0].beaconId == 4) { idd = 304 }
          else if (distances[0].beaconId == 5) { idd = 305 }
          else if (distances[0].beaconId == 6) { idd = 306 }
          else if (distances[0].beaconId == 7) { idd = 307 }
          else { idd = distances[0].beaconId }
          UpData('https://628c8a38a3fd714fd034114b.mockapi.io/room/', idd, "1");
          console.log("ОтправленоWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
          console.log(distances[0].beaconId);
          console.log('eee')

        }
      }
    );
  }

  componentWillUnMount() {
    this.beaconsDidRange = null;
  };



  render() {
    const { dataSource } = this.state;




    const logout = async () => {
      AsyncStorage.removeItem("token").then(() => {
        props.navigation.replace("login");
      });
    };


    function Home() {
      return (
        <View style={styles.container}>
          <Text style={{ marginBottom: 10, fontSize: 20, color: '#8062f8', fontWeight: '900', marginLeft: 20 }}>Информация о студенте</Text>
          <View style={styles.data}>
            <View>
              <Text style={{ fontWeight: '600', fontSize: 15, width: '75%' }}>FIO</Text>
              <Text style={{ fontSize: 13, color: '#7A7A7A' }}>POST</Text>
              <Text style={{ fontSize: 13, color: '#7A7A7A' }}>Группа: 9ПКС-1.18</Text>
              <Text style={{ fontSize: 13, color: '#7A7A7A' }}>Куратор: Александра Андреевна</Text>
              <Text style={{ fontSize: 13, color: '#7A7A7A' }}><Text style={{ color: '#5BC957' }}>✔</Text>Вакцинирован: Спутник-Лайт</Text>
            </View>
            <View style={styles.photo_view}>
              <Image
                style={styles.tinyLogo}
                source={require('../src/img/user.png')}
              />
            </View>
          </View>


          <Text style={{ marginBottom: 10, fontSize: 20, color: '#8062f8', fontWeight: '900', marginLeft: 20 }}>Состояние</Text>
          <View style={styles.data_mode}>
            <View style={styles.mode1}>
              <View style={styles.mode}>
                <Text style={styles.mode_txt}>Подключен к системе </Text>
              </View>
              <View style={styles.mode}>
                <Text style={styles.mode_txt}><Text style={{ color: '#5BC957', fontSize: 30 }}>✔</Text></Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btn}
          //onPress={() => this.props.navigation.replace("login")} // дофига чо пробовал хз как выйти, переводить компонент в функциональный не варик из-за работы биконов
          >
            <Text style={{ color: 'white' }}>Отключиться</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emergency_btn}
            onPress={Alert1}
          >
            <Text style={{ color: 'red', fontWeight: '700', textDecorationLine: 'underline' }}>Экстренный вызов</Text>
          </TouchableOpacity>
        </View>
      );
    }


    function ConntrolCenter() {
      return (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
          <View>


            <View style={styles.data1}>
              <View>
                <Text style={{ fontSize: 16 }}> Вы находитесь в {idd} аудиитории. </Text>
              </View>
              <View style={{ justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 13, color: '#7A7A7A', textAlign: "right", marginTop: 10 }}> Сейчас</Text>
              </View>
            </View>

            <View style={styles.data1}>
              <View>
                <Text style={{ fontSize: 16 }}> На сегодня занятия перенесенны в Онлайн. </Text>
              </View>
              <View style={{ justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 13, color: '#7A7A7A', textAlign: "right", marginTop: 10 }}> 17.06.2022</Text>
              </View>
            </View>

            <View style={styles.data1}>
              <View>
                <Text style={{ fontSize: 16 }}> В понедельник 12.06 Государственный Праздник - День России 🇷🇺, соответсвенно занятий не будет.</Text>
              </View>
              <View style={{ justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 13, color: '#7A7A7A', textAlign: "right", marginTop: 10 }}> 10.06.2022</Text>
              </View>
            </View>

          </View>


        </View>
      );
    }

    const Tab = createBottomTabNavigator();





    function Alert1() {
      Alert.alert('В процессе разработки...')
    }

    return (
      // <View style={styles.container}>
      //   <Text style={styles.headline}>
      //     <Text style={styles.headline}>
      //       УСПЕХ!
      //     </Text>
      //     All beacons in the area
      //   </Text>
      //   <ListView
      //     dataSource={dataSource}
      //     enableEmptySections={true}
      //     renderRow={this.renderRow}
      //   />
      // </View>

      <NavigationContainer independent='true'>
        <Tab.Navigator>
          <Tab.Screen name="Главная" component={Home} />
          <Tab.Screen name="Центр уведомлений" component={ConntrolCenter} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }


  renderRow = rowData => {
    var beacon_distance = Platform.OS === 'ios' ? rowData.accuracy : rowData.distance;
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>
          UUID: {rowData.uuid ? rowData.uuid : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Major: {rowData.major}
        </Text>
        <Text style={styles.smallText}>
          Minor: {rowData.minor}
        </Text>
        <Text>
          RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
        </Text>
        <Text>
          Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
        </Text>
        <Text>
          Distance: {beacon_distance ? beacon_distance.toFixed(2) : 'NA'} m
        </Text>
      </View>
    );
  }
}



// export default 
function HomeScreen(props) {










  function Home() {
    return (
      <View style={styles.container}>
        <Text style={{ marginBottom: 10, fontSize: 20, color: '#8062f8', fontWeight: '900', marginLeft: 20 }}>Информация о студенте</Text>
        <View style={styles.data}>
          <View>
            <Text style={{ fontWeight: '600', fontSize: 15, width: '75%' }}>{fio}</Text>
            <Text style={{ fontSize: 13, color: '#7A7A7A' }}>{post}</Text>
            <Text style={{ fontSize: 13, color: '#7A7A7A' }}>Группа: 9ПКС-1.18</Text>
            <Text style={{ fontSize: 13, color: '#7A7A7A' }}>Куратор: Александра Андреевна</Text>
            <Text style={{ fontSize: 13, color: '#7A7A7A' }}><Text style={{ color: '#5BC957' }}>✔</Text>Вакцинирован: Спутник-Лайт</Text>
          </View>
          <View style={styles.photo_view}>
            <Image
              style={styles.tinyLogo}
              source={require('../src/img/user.png')}
            />
          </View>
        </View>


        <Text style={{ marginBottom: 10, fontSize: 20, color: '#8062f8', fontWeight: '900', marginLeft: 20 }}>Состояние</Text>
        <View style={styles.data_mode}>
          <View style={styles.mode1}>
            <View style={styles.mode}>
              <Text style={styles.mode_txt}>Подключен к системе </Text>
            </View>
            <View style={styles.mode}>
              <Text style={styles.mode_txt}><Text style={{ color: '#5BC957', fontSize: 30 }}>✔</Text></Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => props.navigation.replace("login")}
        >
          <Text style={{ color: 'white' }}>Отключиться</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emergency_btn}
          onPress={Alert1}
        >
          <Text style={{ color: 'red', fontWeight: '700', textDecorationLine: 'underline' }}>Экстренный вызов</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function ConntrolCenter() {
    return (
      <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
        <View>

          <View style={styles.data1}>
            <View>
              <Text style={{ fontSize: 16 }}> На сегодня занятия перенесенны в Онлайн. </Text>
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 13, color: '#7A7A7A', textAlign: "right", marginTop: 10 }}> 17.06.2022</Text>
            </View>
          </View>

          <View style={styles.data1}>
            <View>
              <Text style={{ fontSize: 16 }}> В понедельник 12.06 Государственный Праздник - День России 🇷🇺, соответсвенно занятий не будет.</Text>
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 13, color: '#7A7A7A', textAlign: "right", marginTop: 10 }}> 10.06.2022</Text>
            </View>
          </View>

        </View>


      </View>
    );
  }

  const Tab = createBottomTabNavigator();

  return (

    <NavigationContainer independent='true'>
      <Tab.Navigator>
        <Tab.Screen name="Главная" component={Home} />
        <Tab.Screen name="Центр уведомлений" component={ConntrolCenter} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1
  },
  data1: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 20,
    flexDirection: 'column'
  },
  data: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  post: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  photo_view: {
    //backgroundColor: '#484848',
    width: 100,
    height: 100,
    right: 2,
    borderRadius: 20,
  },
  btn: {
    margin: 18,
    marginTop: 0,
    alignSelf: 'stretch',
    backgroundColor: '#8062f8',
    padding: 13,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
    borderRadius: 10,
    color: 'white'
  },
  mode1: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#8062f8',
    //width: '94%',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'center',
    margin: 10,
  },
  mode: {
    backgroundColor: '#8062f8',
    //width: '94%',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 2
  },
  mode_txt: {
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
  },
  data_mode: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    padding: 10,

  },
  emergency_btn: {
    alignItems: 'center',
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
});

//1111111111111 
AppRegistry.registerComponent(
  'reactNativeBeaconExample',
  () => reactNativeBeaconExample
);
//1111111111111