import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import InputSection from "./InputSection";
import { checkEmail } from "../../constants/reusableFunctions";
import Toast from "react-native-toast-message";
import { API_ROOT } from "../../constants";
const ForgotPasswordModal = ({ modalVisible, setModalVisible }) => {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const requestReset = () => {
    if (checkEmail(email)) {
      setLoading(true);
      if (errorMessage) {
        setErrorMessage("");
      }
      fetch(`http://${API_ROOT}/requestpasswordreset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.found) {
            setUsername(resp.username);
            setLoading(false);
          } else {
            setErrorMessage(`Account with ${email} is not found.`);
            setLoading(false);
          }
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    } else {
      setErrorMessage("Invalid email, please try again.");
    }
  };
  const resetPassword = () => {
    if (newPassword.length < 8) {
      setErrorMessage("Password has to be at least 8 characters");
    } else if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
    } else {
      setLoading(true);
      fetch(`http://${API_ROOT}/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token.trim(), password: newPassword }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.valid) {
            setModalVisible(false);
            Toast.show({
              type: "success",
              text1: "Your password is changed",
            });
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
    setEmail("");
    setUsername("");
    setModalVisible(false);
  };

  const renderResetWithToken = () => {
    return (
      <>
        <Text
          style={{
            fontSize: 22,
            color: "white",
            marginLeft: 5,
            marginBottom: 10,
          }}
        >
          Enter token sent to {username}'s email and enter new password.
        </Text>
        <InputSection title="token" value={token} changeValue={setToken} />
        <InputSection
          title="password"
          value={newPassword}
          changeValue={setNewPassword}
        />
        <InputSection
          title="confirm password"
          value={confirmPassword}
          changeValue={setConfirmPassword}
        />
      </>
    );
  };
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
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
              forgot password?
            </Text>
            {username ? (
              renderResetWithToken()
            ) : (
              <InputSection
                title="email"
                value={email}
                changeValue={setEmail}
              />
            )}

            {errorMessage ? (
              <Text
                style={{
                  fontSize: 20,
                  color: "red",
                  marginTop: 5,
                }}
              >
                {errorMessage}
              </Text>
            ) : null}
            {loading ? (
              <ActivityIndicator
                color="gray"
                size="large"
                style={{ marginVertical: 5 }}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "#9370DB",
                    padding: 5,
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                  onPress={() => (username ? resetPassword() : requestReset())}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      color: "white",
                    }}
                  >
                    {username ? "change password" : "request a password reset"}
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
                      fontSize: 20,
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
  container: {
    flex: 1,
    paddingTop: 40,
  },
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

export default ForgotPasswordModal;
