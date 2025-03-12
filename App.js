import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';

export default function App() {
  const MAX_USR = 80;
  const MAX_LD = 10;

  const { width, height } = Dimensions.get('window');
  const [data, setData] = useState([]);
  const [cnt, setCnt] = useState(-1);

  const [visibility, setVis] = useState(true);
  const [active, setActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [id, setId] = useState();
  const [uid, setUId] = useState();
  const [pass, setPass] = useState();
  const [hpass, sethPass] = useState();
  const [fn, setFn] = useState();
  const [ln, setLn] = useState();
  const [usr, setUsr] = useState();
  const [em, setEm] = useState();
  const [avt, setAvt] = useState();

  /**
   * toggles the visibility of the user password from hidden to shown
   */
  useEffect(() => {
    if (isPasswordVisible) sethPass(pass);
    else sethPass("•".repeat(12));
  }, [isPasswordVisible]);

  /**
   * changes the user data every-time on navigation either back/forward
   */
  useEffect(() => {
    if (cnt < MAX_USR) {
      if (cnt >= 0) {
        setIsPasswordVisible(false);
        setId(data[cnt][0]);
        setUId(data[cnt][1]);
        setPass(data[cnt][2]);
        setFn(data[cnt][3]);
        setLn(data[cnt][4]);
        setUsr(data[cnt][5]);
        setEm(data[cnt][6]);
        setAvt(data[cnt][7]);
      }
    }
  }, [cnt]);

  /**
   * sets a loading screen
   * fetchs random 10 user data
   * updates the user data stored
   * navigates to the next user
   * hides the loading screen
   */
  const get = () => {
    setVis((visibility) => !visibility);
    fetch(`https://random-data-api.com/api/users/random_user?size=${MAX_LD}`)
      .then((response) => response.json())
      .then((resdata) => {
        setData(
          data.concat(
            resdata.map((item) => [
              item.id,
              item.uid,
              item.password,
              item.first_name,
              item.last_name,
              item.username,
              item.email,
              item.avatar,
            ])
          )
        );
        setCnt((cnt) => cnt + 1);
        setVis((visibility) => !visibility);
      })
      .catch((error) => {
        console.error(error);
        if (!active) {
          setActive(true);
          ToastAndroid.show("Could not Load data", ToastAndroid.SHORT);
          const timeoutId = setTimeout(() => {
            setActive(false);
          }, 2500);
          return () => clearTimeout(timeoutId);
        }
      });
  };

  /**
   * handles logical operations of navigation and displays apporiate message
   * sends a fetch request when last user of the fetched data is reached
   */
  const load = (w) => {
    if (w == 1) {
      if (cnt < data.length - 1) setCnt((cnt) => cnt + 1);
      else if (data.length < MAX_USR) get();
      else {
        if (!active) {
          setActive(true);
          ToastAndroid.show(
            "Already Viewing The Last User",
            ToastAndroid.SHORT
          );
          const timeoutId = setTimeout(() => {
            setActive(false);
          }, 2500);
          return () => clearTimeout(timeoutId);
        }
      }
    } else {
      if (cnt > 0) setCnt((cnt) => cnt - 1);
      else {
        if (!active) {
          setActive(true);
          ToastAndroid.show(
            "Already Viewing The First User",
            ToastAndroid.SHORT
          );
          const timeoutId = setTimeout(() => {
            setActive(false);
          }, 2500);
          return () => clearTimeout(timeoutId);
        }
      }
    }
  };

  /**
   * the initial call made to fetch 10 random users
   */
  useEffect(() => {
    load(1);
  }, []);

  return (
    /**
     * used { visibility && ... } to toggle the loading screen
     */

    // parent container
    <View style={styles.container}>
      {/* loader */}
      {!visibility && (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {/* profile section */}
      {visibility && (
        <View>
          <View style={styles.avatarP}>
            <Image style={styles.avatar} source={{ uri: avt }}></Image>
          </View>
          <Text style={styles.name}>
            {fn} {ln}
          </Text>
        </View>
      )}

      {/* display user data section */}
      {visibility && (
        <ScrollView style={styles.sv} showsHorizontalScrollIndicator={false}>
          <Text style={styles.txt}>
            <Text style={{ fontWeight: "bold" }}>First Name :</Text> {fn}
          </Text>
          <Text style={styles.txt}>
            <Text style={{ fontWeight: "bold" }}>Last Name :</Text> {ln}
          </Text>
          <Text style={styles.txt}>
            <Text style={{ fontWeight: "bold" }}>Username :</Text> {usr}
          </Text>
          <Text style={styles.txt}>
            <Text style={{ fontWeight: "bold" }}>Email :</Text> {em}
          </Text>

          <View style={styles.txtP}>
            <Text style={styles.txtC}>
              <Text style={{ fontWeight: "bold" }}>Password : </Text>
              <Text >{hpass}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <MaterialCommunityIcons
                name={!isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.txt}>
            <Text style={{ fontWeight: "bold" }}>ID :</Text> {id}
          </Text>
          <Text style={styles.txt}>
            <Text style={{ fontWeight: "bold" }}>UID :</Text> {uid}
          </Text>
        </ScrollView>
      )}

      {/* navigation section */}
      {visibility && (
        <View style={styles.navi}>
          <TouchableOpacity style={styles.button} onPress={() => load(0)}>
            <Text style={styles.btnTxt}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button1} onPress={() => load(1)}>
            <Text style={styles.btnTxt1}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // fill the whole screen with white background and its content/children as center
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems:'center'
  },

  name: {
    // 25 logical pixels below the previous sibling/upper component
    marginTop: 25,
    fontSize: 23,
    textAlign: "center",
  },

  avatarP: {
    // center the image on the screen
    alignItems: "center",
  },

  avatar: {
    // widht and height of the avatar set to 150 logical pixels for uniform images
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 75,
    backgroundColor: "yellow",
    borderColor: "black",
    borderWidth: 2,
  },

  navi: {
    // dispaly the navigation button in a row with space between them
    flexDirection: "row",
    marginTop:20,
    marginBottom:20,
  },

  sv: {
    // scrollview margins to provide space
    marginTop: 20,
    flexGrow:0
  },

  button: {
    // forward navigation button css
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    width: 110,
    padding: 10,
  },

  button1: {
    // backward navigation button css
    alignItems: "center",
    borderColor: "black",
    backgroundColor: "#000",
    borderWidth: 1,
    borderRadius: 15,
    width: 110,
    padding: 10,
    marginStart:30,
  },

  btnTxt: {
    // text styling of backward navigation button
    fontSize: 20,
    fontWeight: "bold",
  },

  btnTxt1: {
    // text styling of forward navigation button
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },

  txt: {
    // text styling of user data being displayed
    flex: 1,
    flexDirection: "row",
    backgroundColor: "lightgrey",
    borderRadius: 15,
    padding: 13,
    fontSize: 17,
    marginBottom: 13,
    marginEnd: 20,
    marginStart: 20,
  },

  txtC: {
    // text styling of password section's label and value
    flex: 1,
    flexDirection: "row",
    backgroundColor: "lightgrey",
    borderRadius: 15,
    fontSize: 16,
  },

  txtP: {
    // text styling of the whole password section's
    flex: 1,
    flexDirection: "row",
    backgroundColor: "lightgrey",
    borderRadius: 15,
    padding: 13,
    marginBottom: 13,
    marginEnd: 20,
    marginStart: 20,
  },
});