import { StyleSheet, Text, View, ScrollView,Image, TouchableOpacity,ToastAndroid,ActivityIndicator} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, {useState, useEffect} from 'react'

export default function App() {

  const MAX_USR=80;
  const MAX_LD=10;

  const [data,setData]=useState([]);
  const [cnt,setCnt]=useState(-1)

  const [visibility,setVis]=useState(true)
  const [active,setActive]=useState(false)
  const [isPasswordVisible,setIsPasswordVisible]=useState(false)

  const [id,setId]= useState();
  const [uid,setUId]= useState();
  const [pass,setPass]= useState();
  const [hpass,sethPass]= useState();
  const [fn,setFn]= useState();
  const [ln,setLn]= useState();
  const [usr,setUsr]= useState();
  const [em,setEm]= useState();
  const [avt,setAvt]= useState();

  useEffect(()=>{
    if(isPasswordVisible)sethPass(pass)
    else sethPass('•'.repeat(8))
  },[isPasswordVisible])

  useEffect(()=>{
    if(cnt<MAX_USR){
      if(cnt>=0){
        setIsPasswordVisible(false)
        setId(data[cnt][0])
        setUId(data[cnt][1])
        setPass(data[cnt][2])
        setFn(data[cnt][3])
        setLn(data[cnt][4])
        setUsr(data[cnt][5])
        setEm(data[cnt][6])
        setAvt(data[cnt][7])
      }
    }
  },[cnt])

  const get=()=>{
    setVis(visibility=>!visibility)
    fetch(`https://random-data-api.com/api/users/random_user?size=${MAX_LD}`)
    .then(response => response.json())
    .then(resdata=>{
      setData(data.concat(resdata.map(item => [
          item.id,
          item.uid,
          item.password,
          item.first_name,
          item.last_name,
          item.username,
          item.email,
          item.avatar,
      ])));
      setCnt(cnt=>cnt+1)
      setVis(visibility=>!visibility)
    })
    .catch(error=>{
      console.error(error)
      if(!active){
        setActive(true)
        ToastAndroid.show("Could not Load data",ToastAndroid.SHORT)
        const timeoutId = setTimeout(() => {
          setActive(false);
        }, 2500);
        return () => clearTimeout(timeoutId);
      }
    })
  }

  const load = (w) =>{
    if(w==1){
      if(cnt<data.length-1) setCnt(cnt=>cnt+1)
      else if(data.length<MAX_USR) get()
      else {
        if(!active){
          setActive(true)
          ToastAndroid.show("Already Viewing The Last User",ToastAndroid.SHORT)
          const timeoutId = setTimeout(() => {
            setActive(false);
          }, 2500);
          return () => clearTimeout(timeoutId);
        }
      }
    }else{
      if(cnt>0)setCnt(cnt=>cnt-1)
      else {
        if(!active){
          setActive(true)
          ToastAndroid.show("Already Viewing The First User",ToastAndroid.SHORT)
          const timeoutId = setTimeout(() => {
            setActive(false);
          }, 2500);
          return () => clearTimeout(timeoutId);
        }
      }
    }
  }

  useEffect(() => {
    load(1)
  }, []);

  return (
    // <SafeAreaView>
      <View style={styles.container}>
        {!visibility && <View style={styles.container}><ActivityIndicator size="large" /></View>}

        {visibility && <View>
            <View style={styles.avatarP}><Image style={styles.avatar} source={{uri:avt}}></Image></View>
            <Text style={styles.name}>{fn} {ln}</Text>
        </View>}

        {visibility && <ScrollView style={styles.sv}>
          <Text style={styles.txt}><Text style={{fontWeight:'bold'}}>First Name :</Text> {fn}</Text>
          <Text style={styles.txt}><Text style={{fontWeight:'bold'}}>Last Name :</Text> {ln}</Text>
          <Text style={styles.txt}><Text style={{fontWeight:'bold'}}>Username :</Text> {usr}</Text>
          <Text style={styles.txt}><Text style={{fontWeight:'bold'}}>Email :</Text> {em}</Text>

          <View style={styles.txtP}>
            <Text style={styles.txtC}>
              <Text style={{fontWeight:'bold'}}>Password : </Text>
              <Text>{hpass}</Text>
            </Text>
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <MaterialCommunityIcons name={!isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray"/>
            </TouchableOpacity>
          </View>

          <Text style={styles.txt}><Text style={{fontWeight:'bold'}}>ID :</Text> {id}</Text>
          <Text style={styles.txt}><Text style={{fontWeight:'bold'}}>UID :</Text> {uid}</Text>

        </ScrollView>}

        {visibility && <View style={styles.navi}>
          <TouchableOpacity style={styles.button} onPress={()=>load(0)}><Text style={styles.btnTxt}>Previous</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button1} onPress={()=>load(1)}><Text style={styles.btnTxt1}>Next</Text></TouchableOpacity>
        </View>}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    justifyContent:'center',
  },

  name:{
    marginTop:25,
    fontSize:25,
    textAlign:'center',
  },

  pass:{
    opacity:0
  },

  avatarP:{
    alignItems:'center'
  },

  avatar:{
    width:150,
    height:150,
    marginTop:70,
    borderRadius:75,
    backgroundColor:"yellow",
    borderColor:'black',
    borderWidth:2
  },

  navi:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginStart:30,
    marginBottom:30,
    marginEnd:30,
  },

  sv:{
    marginTop:20,
    marginBottom:20,
  },

  button:{
    alignItems: 'center',
    borderColor:'black',
    borderWidth:1,
    backgroundColor:'#f2f2f2',
    borderRadius:15,
    width:130,
    padding:10,
  },

  button1:{
    alignItems: 'center',
    borderColor:'black',
    backgroundColor: '#000',
    borderWidth:1,
    borderRadius:15,
    width:130,
    padding:10,
  },

  btnTxt:{
    fontSize:20,
    fontWeight:'bold'
  },

  btnTxt1:{
    fontSize:20,
    color:'#fff',
    fontWeight:'bold'
  },

  txt:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'lightgrey',
    borderRadius:15,
    padding:13,
    fontSize:20,
    marginBottom:20,
    marginEnd:20,
    marginStart:20,
  },

  txtC:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'lightgrey',
    borderRadius:15,
    fontSize:20,
  },

  txtP:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'lightgrey',
    borderRadius:15,
    padding:13,
    marginBottom:20,
    marginEnd:20,
    marginStart:20,
  }
});