import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
const InputField = ({ focusing, handleMessage, sendComment, usage }) => {
  const [input, setInput] = useState("");
  sendAction = () => {
    if (usage == "message") {
      handleMessage(input);
      setInput("");
    } else {
      sendComment(input);
      setInput("");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <BlurView
        intensity={35}
        tint="dark"
        style={{
          flex: 1,
          padding: 20,
          paddingTop: 5,
          paddingRight: 10,
          flexDirection: "row",
        }}
      >
        <TextInput
          onFocus={() => focusing()}
          value={input}
          placeholder={`your ${usage}`}
          style={styles.inputWriting}
          placeholderTextColor="gray"
          onChangeText={(text) => setInput(text)}
          multiline={true}
        />
        <TouchableOpacity
          onPress={() => (input.length ? sendAction() : null)}
          style={{ alignSelf: "center" }}
        >
          <FontAwesome
            name="send"
            size={23}
            color={input.length ? "#9370DB" : "gray"}
          />
        </TouchableOpacity>
      </BlurView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    height: "auto",
    width: "100%",
    // marginBottom: 20,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    minHeight: 70,
    alignSelf: "center",
    borderTopWidth: 4,
    borderTopColor: "#9370DB",
    flexDirection: "row",
  },
  inputWriting: {
    // height: "auto",
    fontSize: 24,
    flex: 1,
    padding: 10,
    // borderRadius: 10,
    // width: "85%",
    // padding: 10,
    // justifyContent: "center",
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    // backgroundColor: 'darkgray',
    // margin: 10,
  },
});
const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(InputField);
