import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { API_ROOT } from "../../constants";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const ChangePasswordModal = ({
  passwordModalVisible,
  setPasswordModalVisible,
}) => {
  const [old, setOld] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    if (newPassword.length < 8) {
      setErrorMessage("Password has to be at least 8 characters.");
    } else if (newPassword !== confirm) {
      setErrorMessage("Passwords do not match.");
    } else {
      setErrorMessage(false);
      setLoading(true);
      let token = await AsyncStorage.getItem("jwt");

      fetch(`http://${API_ROOT}/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old: old.trim(),
          newPassword: newPassword.trim(),
        }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.valid) {
            Toast.show({ type: "success", text1: resp.message });
            closeModal();
          } else {
            setErrorMessage(resp.message);
          }
          setLoading(false);
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    }
  };

  const closeModal = () => {
    setErrorMessage("");
    setOld("");
    setNewPassword("");
    setConfirm("");
    setPasswordModalVisible(false);
  };

  const InputSection = (title, value, changeValue) => {
    return (
      <View
        style={{
          marginBottom: 5,
          display: "flex",
          borderBottomWidth: 1,
          borderBottomColor: "gray",
          flexDirection: "row",
          paddingVertical: 5,
        }}
      >
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            fontWeight: "600",
            textAlign: "left",
            color: "white",
            alignSelf: "flex-end",
            textDecorationLine: "underline",
            textDecorationColor: "#9370DB",
            flex: 2,
          }}
        >
          {title}
        </Text>
        <TextInput
          secureTextEntry={true}
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            flex: 3,
            fontWeight: "bold",
            textAlign: "left",
            alignSelf: "flex-end",
            color: "white",
          }}
          autoCapitalize="none"
          value={value}
          onChangeText={(text) => changeValue(text)}
          placeholderTextColor="gray"
        />
      </View>
    );
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={passwordModalVisible}
    >
      <View style={styles.centeredView}>
        <BlurView
          intensity={70}
          tint="dark"
          style={{
            display: "flex",
            flex: 1,
            width: "100%",
          }}
        >
          <View style={styles.modalView}>
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "500",
                fontSize: 30,
                marginBottom: 20,
              }}
            >
              change password
            </Text>
            <Text
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "red",
                marginVertical: 10,
              }}
            >
              {errorMessage}
            </Text>

            {InputSection("old password", old, setOld)}
            {InputSection("new password", newPassword, setNewPassword)}
            {InputSection("confirm password", confirm, setConfirm)}
            {loading ? (
              <ActivityIndicator color="gray" size="large" />
            ) : (
              <>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "#9370DB",
                    padding: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => changePassword()}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: responsiveSizes[height].sliderItemFontSize,
                      color: "white",
                    }}
                  >
                    change password
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => closeModal()}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: responsiveSizes[height].sliderItemFontSize,
                      color: "white",
                    }}
                  >
                    cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    paddingTop: 35,
  },
});

export default ChangePasswordModal;
