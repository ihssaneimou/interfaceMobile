import {  Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Device from 'expo-device';
import base64 from 'base-64';
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import * as FileSystem from 'expo-file-system';

const username = 'admin';
const password = 'admin';
const encodedCredentials = base64.encode(`${username}:${password}`);
export default function DemandeAccepter({route}) {

const image = require('./demandeAccepte.jpeg');
const navigation=useNavigation();
const [deviceId, setDeviceId] = useState('');
const [etudiants, setEtudiants] = useState([]);
const ipAdress = route.params.ipAdress;

const [imageUri, setImageUri] = useState(null);
const [key, setKey] = useState(0);  // State to force re-render


const saveImage = async (base64String,imagePath) => {
    console.log('Saving image...');
    try {
        await FileSystem.writeAsStringAsync(imagePath, base64String, {
            encoding: FileSystem.EncodingType.Base64,
        });
        console.log('Image saved successfully at:', imagePath);
        return true;
    } catch (error) {
        console.error('Failed to save image:', error);
        return false;
    }
};

const loadImage = async () => {
    console.log('Loading image from filesystem...');
    try {
        const fileInfo = await FileSystem.getInfoAsync(imagePath);
        if (fileInfo.exists) {
            console.log('Image loaded from:', imagePath);
            setImageUri(imagePath + '?' + new Date().getTime()); // Adding a timestamp to the URI to avoid caching issues
            setKey(prevKey => prevKey + 1); // Increment key to force re-render
        } else {
            console.log('No image found at the path');
        }
    } catch (error) {
        console.error('Failed to load image:', error);
    }
};

const fetchAndStoreImage = async () => {
    console.log('Fetching image from API...');
    try {
      etudiants.map(async(e)=>{
        const response = await axios.post(`http://${ipAdress}:8000/api/tablette/getPhoto/${e.codeApogee}`);
        let imageData = response.data.image;
        console.log('Image data received:', imageData);
        if (imageData.startsWith('data:image/jpeg;base64,')) {
            imageData = imageData.replace('data:image/jpeg;base64,', '');
        }
        const imagePath = `${FileSystem.documentDirectory}${e.codeApogee}.jpg`;
        const saveSuccessful = await saveImage(imageData,imagePath);
        if (saveSuccessful) {
            //loadImage();
            console.log('saveSuccessful')
        }

      })
    } catch (error) {
        console.error('Error fetching and storing image:', error);
    }
};

// useEffect(() => {
//     loadImage();
// }, []);

useEffect(() => {
  const fetchDeviceId = () => {
    setDeviceId(Device.osBuildId);
  };
  fetchDeviceId();
}, []);

// useEffect(() => {
//   if (deviceId) {  
//      getPV();
//   }
// }, [deviceId]); 
const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear(); // Gets the full year (4 digits)
    const month = date.getMonth() + 1; // Gets the month (0-11, +1 to make it 1-12)
    const day = date.getDate(); // Gets the day of the month (1-31)
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; // Formats to YYYY-MM-DD
  };
  const getAmOrPm = () => {
    const date = new Date();
    const hours = date.getHours(); // Gets the hour of the day (0-23)
    return hours < 12 ? 'AM' : 'PM'; // Checks if the hour is less than 12 for AM, otherwise PM
  };
  
  
  useEffect(()=>{
      console.log(getCurrentDate());
      console.log(getAmOrPm());
      checkDocuments();
  })
const getPV= async () => {
    const data = {
      "device_id": deviceId,
      "date": getCurrentDate(),
      "demi_journee": getAmOrPm(),
    };
    try {
      const response = await axios.post(`http://${ipAdress}:8000/api/tablette/getPV`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      if(response.data.PV){
        console.log('surveillants');
        response.data.PV.surveillants.map((e)=>{
          console.log(e);
        })
        console.log('local');
        response.data.PV.local.map((e)=>{
          console.log(e);
        })
        console.log('reserviste');
        response.data.PV.reserviste.map((e)=>{
          console.log(e);
        })
        console.log('etudiantsS1');
        response.data.PV.etudiantsS1.map((e)=>{
          console.log(e);
        })
        console.log('etudiantsS2');
        response.data.PV.etudiantsS2.map((e)=>{
          console.log(e);
        })
        const students=[...response.data.PV.etudiantsS1, ...response.data.PV.etudiantsS2];
        setEtudiants(students);
        console.log('session');
        response.data.PV.session.map((e)=>{
          console.log(e);
        })
      }else{
        console.log(response.data);
      }
      
      await fetchAndStoreImage();
    } catch (error) {
      console.log(error);
    }
  }
  const checkDocuments = async () => {
    try {
      const response1 = await axios.get(`http://${ipAdress}:5984/etudiantsun/_all_docs?limit=1`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      const response2 = await axios.get(`http://${ipAdress}:5984/etudiantsdeux/_all_docs?limit=1`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      const response3 = await axios.get(`http://${ipAdress}:5984/surveillants/_all_docs?limit=1`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      const response4 = await axios.get(`http://${ipAdress}:5984/reserviste/_all_docs?limit=1`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      return (response1.data.total_rows > 0) || (response2.data.total_rows > 0)|| (response3.data.total_rows > 0) ||(response4.data.total_rows > 0) ;
    } catch (error) {
      console.error('Error checking documents:', error);
    }
  };
  


  return (
    <View style={styles.container}>
<Image source={image} style={styles.image}/>

      <Text style={styles.text}>vous êtes connecté </Text>
       
      <TouchableOpacity 

        style={styles.button}
        onPress={getPV}
       >
        <Text style={styles.buttonText} >Installer le PV</Text>
       </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    fontSize:30,
    marginTop:50,
    fontWeight:'bold',
  },
  image:{
    height:200,
    width:300,
    marginBottom: 50
  },
  button: {
    marginTop: 50,
    padding: 10,
    width: 300,
    backgroundColor:'#194a7a',
    borderRadius: 20,
  },
  buttonText:{
    color:'#fff',
    alignSelf:'center',
    fontWeight:'bold',
    fontSize:18,
  },
  text2:{
    fontSize:25,
    marginTop:30,
    fontWeight:'500',
    color:'#006e4f'
  }
});
