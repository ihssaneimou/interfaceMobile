import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Rapp, Scanner, Signature ,Acceuil,Etudiants} from './navigation/indexe';
import {Entypo , MaterialCommunityIcons,FontAwesome5 ,FontAwesome ,Fontisto} from '@expo/vector-icons';
import { View,Text,StyleSheet,Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const Tab = createBottomTabNavigator();
const screenOptions={
    tabBarShowLabel:false,
    headerShown:false,
       tabBarStyle:{
           position:'absolute',
           height:60,
           bottom:0,
           right:0,
           left:0,
           elevation:0,
           borderBottomLeftRadius:16,
           background:'#fff',
           borderTopWidth:1,
       }
}

export default function Seance2() {
    const navigation=useNavigation();
  return (<View style={styles.page}>
    <View style={styles.container}>
            <View style={styles.button} ><Button title='Seance 1' onPress={()=>navigation.navigate("Seance1")} /></View>
            <View style={styles.button}><Button title='Seance 2' onPress={()=>navigation.navigate("Seance2")} /></View>
     </View>
        <Tab.Navigator screenOptions={screenOptions} initialRouteName='Acceuil' >
         <Tab.Screen name='Rapport' component={Rapp} options={{
            tabBarIcon:({focused})=>{
                return(
                    
                    <View style={{alignItems:"center" ,justifyContent:"center" }} >
                    <FontAwesome name="file-text-o" size={24} color="black" />               
                    <Text>Rapp</Text>
                </View>
                )
            }
        }}/>
        <Tab.Screen name='Scanner' component={Scanner} options={{
            tabBarIcon:({focused})=>{
              return(

                <View style={{alignItems:"center" ,justifyContent:"center" }} >
                    <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
                    <Text>Scanner</Text>
                </View>
                )
            }
        }}/>
        <Tab.Screen name='Acceuil'
       component={Acceuil}
       options={{
           tabBarIcon:({focused})=>{
             return(

               <View style={{alignItems:"center" ,justifyContent:"center" }} >
                   <Entypo name='home' size={24} color="black" />
                   <Text>Acceuil</Text>
               </View>
               )
           }
       }}
        />
             <Tab.Screen name='Etudiants' component={Etudiants} options={{
                  tabBarIcon:({focused})=>{
                      return(
                          
                          <View style={{alignItems:"center" ,justifyContent:"center" }} >
                        <Fontisto name="persons" size={24} color="black" />
                         <Text>Etudiants</Text>
                     </View>
                     )
                 }
             }} />
         <Tab.Screen name='Signature' component={Signature} options={{
            tabBarIcon:({focused})=>{
              return(

                <View style={{alignItems:"center" ,justifyContent:"center" }} >
                    <FontAwesome5 name="signature" size={24} color="black" />
                    <Text>Signature</Text>
                </View>
                )
            }
        }}/>
         
      

     </Tab.Navigator> 
   
    </View>
  );
}

const styles=StyleSheet.create({
    page:{
        flex:1,
        backgroundColor:'#fff'
    },
    button:{
        flex:2
    },
    container:{
        flexDirection:'row'
    }
})