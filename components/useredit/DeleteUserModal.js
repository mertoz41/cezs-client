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
import store from "../../redux/store";
import { connect } from "react-redux";
const DeleteUserModal = ({
  deleteModalVisible,
  setDeleteModalVisible,
  currentUser,
}) => {
  const deleteAccount = async () => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/users/${currentUser.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then(async (resp) => {
        if (resp.deleted) {
          store.dispatch({ type: "LOG_USER_OUT" });
          await AsyncStorage.removeItem("jwt");
        }
      });
  };

  const closeModal = () => {
    setDeleteModalVisible(false);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={deleteModalVisible}>
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
              delete account
            </Text>
            <Text
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "white",
                marginVertical: 10,
              }}
            >
              Please confirm to delete your account. Please note that there is
              no option to restore the account or its data once it's deleted.
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#9370DB",
                padding: 5,
                borderRadius: 10,
              }}
              onPress={() => deleteAccount()}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                  color: "white",
                }}
              >
                confirm
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
            {/* 
            {InputSection("old password", old, setOld)}
            {InputSection("new password", newPassword, setNewPassword)}
            {InputSection("confirm password", confirm, setConfirm)} */}
            {/* {loading ? (
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
            )} */}
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

const mapStateToProps = (state) => ({ currentUser: state.currentUser });
export default connect(mapStateToProps)(DeleteUserModal);
