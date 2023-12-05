import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../redux/store";
import { API_ROOT } from "../constants/index";
import { connect } from "react-redux";
import EntryBottom from "../components/entry/EntryBottom";
import InputSection from "../components/entry/InputSection";
import ForgotPasswordModal from "../components/entry/ForgotPasswordModal";
import Toast from "react-native-toast-message";
import { setUpChatrooms } from "../constants/reusableFunctions";
import { responsiveSizes } from "../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const Login = ({ navigation, currentUser }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const postLogin = () => {
    let obj = { username: userName.trim(), password: password.trim() };
    setLoading(true);
    fetch(`http://${API_ROOT}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((resp) => resp.json())
      .then(async (resp) => {
        if (resp.message) {
          Toast.show({ type: "error", text1: resp.message });
          setLoading(false);
        } else {
          try {
            await AsyncStorage.setItem("jwt", resp.token);
            // callback function to set usertoken in app.js

            let user = { ...resp.user };

            let sortedNotis = user.notifications.sort((a, b) => {
              return new Date(b.created_at) - new Date(a.created_at);
            });
            store.dispatch({
              type: "NOTIFICATIONS",
              notifications: sortedNotis,
            });
            // SETUP NOTIFICATIONS
            setUpChatrooms(resp.chatrooms, resp.user.id);
            store.dispatch({ type: "UPDATE_CURRENT_USER", currentUser: user });
            store.dispatch({ type: "UPDATE_LOGGED_IN", loggedIn: true });
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: responsiveSizes[height].screenTitle,
          fontWeight: "600",
          textAlign: "center",
          color: "white",
          marginTop: 10,
        }}
      >
        Sign in
      </Text>
      <InputSection
        title="username"
        value={userName}
        changeValue={setUserName}
      />
      <InputSection
        title="password"
        value={password}
        changeValue={setPassword}
      />
      <ForgotPasswordModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            fontWeight: "500",
            marginRight: 10,
            alignSelf: "flex-end",
            textAlign: "left",
            color: "white",
            textDecorationLine: "underline",
            textDecorationColor: "#9370DB",
          }}
        >
          forgot password?
        </Text>
      </TouchableOpacity>
      <EntryBottom
        text={"Don't have an account?"}
        actionVerb={"sign in"}
        loading={loading}
        navigate={() => navigation.push("Register")}
        action={postLogin}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
});

const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(Login);
