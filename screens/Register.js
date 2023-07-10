import React, { useState } from "react";
import { StyleSheet, View, Text, Linking, Dimensions } from "react-native";
import { API_ROOT } from "../constants/index";
import EntryBottom from "../components/entry/EntryBottom";
import InputSection from "../components/entry/InputSection";
import Toast from "react-native-toast-message";
import { checkEmail } from "../constants/reusableFunctions";
import { responsiveSizes } from "../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const Register = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const checkInput = () => {
    let type;
    if (userName.indexOf(" ") > 0) {
      Toast.show({
        type: "error",
        text1: "Username can't have space.",
      });
    } else if (userName == "") {
      Toast.show({
        type: "error",
        text1: "Username cannot be empty.",
      });
    } else if (email == "") {
      Toast.show({
        type: "error",
        text1: "Email cannot be empty.",
      });
    } else if (!checkEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Email not valid.",
      });
    } else if (password.length < 8) {
      Toast.show({
        type: "error",
        text1: "Password has to be at least 8 characters.",
      });
    } else if (userName.length < 4) {
      Toast.show({
        type: "error",
        text1: "Username has to be at least 4 characters.",
      });
    } else if (password !== confirm) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match.",
      });
    } else {
      setLoading(true);
      registerUser();
    }
  };
  const registerUser = () => {
    // fetch request to register user
    fetch(`http://${API_ROOT}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName.trim(),
        password: password.trim(),
        email: email.trim(),
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (!resp.valid) {
          Toast.show({
            type: "error",
            text1: resp.message,
          });
          setLoading(false);
        } else {
          Toast.show({
            type: "success",
            text1: "account created!",
          });
          setLoading(false);
          navigation.push("Login");
        }
      })
      .catch((err) => {
        Toast.show({ type: "error", text1: err.message });
      });
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
        Create your account
      </Text>
      <InputSection
        title={"username"}
        value={userName}
        changeValue={setUserName}
      />
      <InputSection title={"email"} value={email} changeValue={setEmail} />
      <InputSection
        title={"password"}
        value={password}
        changeValue={setPassword}
      />
      <InputSection
        title={"confirm password"}
        value={confirm}
        changeValue={setConfirm}
      />

      <View style={{ margin: 10 }}>
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            color: "darkgray",
          }}
        >
          By continuing you acknowledge that you’ve read our{" "}
          <Text
            style={{ color: "#9370DB" }}
            onPress={() => Linking.openURL("http://cezsmusic.com/privacy")}
          >
            privacy policy
          </Text>
          .
        </Text>
      </View>
      <EntryBottom
        text="Have an account?"
        actionVerb={"sign up"}
        action={checkInput}
        loading={loading}
        navigate={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  input: {
    fontSize: 18,
    flex: 3,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "flex-end",
    color: "white",
  },
});

export default Register;
