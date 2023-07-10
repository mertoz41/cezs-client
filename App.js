import React, { useEffect, useRef, useState } from "react";
import { Text, View, ActivityIndicator, ImageBackground } from "react-native";
// import { NativeBaseProvider } from "native-base";
import Toast from "react-native-toast-message";
import AppNavigator from "./navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./redux/store";
import { Provider } from "react-redux";
import { API_ROOT } from "./constants/index";
import Logo from "./assets/cezslogo.png";
import { BlurView } from "expo-blur";
import { setUpChatrooms } from "./constants/reusableFunctions";
// import { SSRProvider } from "@react-aria/ssr";

const ReusableToast = (props) => {
  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: 10,
      }}
    >
      <BlurView
        intensity={10}
        tint="light"
        style={{
          padding: 15,
          backgroundColor:
            props.type === "success"
              ? "rgba(147,112,219, .6)"
              : "rgba(255,255,255, .6)",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            color: props.type === "success" ? "white" : "black",
          }}
        >
          {props.text1}
        </Text>
      </BlurView>
    </View>
  );
};

function App(props) {
  useEffect(() => {
    checkUser();
  }, []);
  const [loading, setLoading] = useState(false);
  const kablo = useRef(null);

  global.addEventListener = () => {};
  global.removeEventListener = () => {};

  const checkUser = async () => {
    // log user in if there is token.
    setLoading(true);
    let token = await AsyncStorage.getItem("jwt");
    if (token) {
      fetch(`http://${API_ROOT}/check`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then(async (resp) => {
          if (resp.message && !resp.unauthorized) {
            await AsyncStorage.removeItem("jwt");
          } else {
            let user = { ...resp.user };
            let sortedNotis = user.notifications.sort((a, b) => {
              return new Date(b.created_at) - new Date(a.created_at);
            });
            store.dispatch({
              type: "NOTIFICATIONS",
              notifications: sortedNotis,
            });
            setUpChatrooms(resp.chatrooms, resp.user.id);
            store.dispatch({ type: "UPDATE_CURRENT_USER", currentUser: user });
            store.dispatch({
              type: "UPDATE_TIMELINE",
              timeline: resp.timeline,
            });
            store.dispatch({ type: "UPDATE_LOGGED_IN" });
            setLoading(false);
          }
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    } else {
      setLoading(false);
    }
  };

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => <ReusableToast {...props} />,
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => <ReusableToast {...props} />,
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    tomatoToast: ({ text1, props }) => (
      <View
        style={{
          height: 60,
          width: "100%",

          backgroundColor: "tomato",
        }}
      >
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  return (
    <Provider store={store}>
      {loading ? (
        <ImageBackground
          source={Logo}
          resizeMode="contain"
          imageStyle={{ opacity: 0.2 }}
          style={{ flex: 1, backgroundColor: "#2e2e2e" }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color="gray" size="large" />
          </View>
        </ImageBackground>
      ) : (
        <AppNavigator />
      )}
      <Toast config={toastConfig} />
    </Provider>
  );
}

export default App;
