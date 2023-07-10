import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../../constants";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import store from "../../redux/store";
import { BlurView } from "expo-blur";
const ReportModal = ({
  visible,
  type,
  id,
  close,
  timeline,
  update,
  item,
  goBack,
  markerAccounts,
}) => {
  // types:

  // post //
  // user //
  // band //
  // comment //
  // event //
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const reportPrompts = [
    "nudity or sexual activity",
    "non-music related content",
    "hate speech or symbols",
    "violence or disturbing activity",
  ];
  const reportItem = async (id, type) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/report${type}/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description: selectedPrompt }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        Toast.show({
          type: "success",
          text1: `${type} is reported.`,
        });
        if (type === "post") {
          let found = timeline.find((post) => post.id === id);
          if (found) {
            let filteredTimeline = timeline.filter((post) => post.id !== id);
            store.dispatch({
              type: "UPDATE_TIMELINE",
              timeline: filteredTimeline,
            });
          }
          update(id);
        } else if (type === "user" || type === "band") {
          if (markerAccounts) {
            let filtered = markerAccounts.filter(
              (account) => account.id !== id
            );
            store.dispatch({ type: "UPDATE_MARKER", markerAccounts: filtered });
          }
          goBack();
        } else if (type === "event") {
          update(item);
        }
        close();
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const renderPrompt = (prompt, i) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedPrompt(prompt)}
        key={i}
        style={{
          padding: 5,
          margin: 5,
          borderWidth: 1,
          borderColor: selectedPrompt === prompt ? "#9370DB" : "gray",
          backgroundColor:
            selectedPrompt === prompt ? "#9370DB" : "transparent",
          borderRadius: 10,
          width: "auto",
        }}
      >
        <Text style={{ fontSize: 22, textAlign: "center", color: "white" }}>
          {prompt}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <BlurView
          intensity={70}
          tint="dark"
          style={{
            display: "flex",
            flex: 1,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <View style={styles.modalView}>
            {reportPrompts.map((prompt, i) => renderPrompt(prompt, i))}
            <View
              style={{
                display: "flex",
                marginVertical: 5,
                padding: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => close()}
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#9370DB",
                  padding: 5,
                }}
              >
                <Text style={{ fontSize: 21, color: "white" }}>cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!selectedPrompt}
                onPress={() => reportItem(id, type)}
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: selectedPrompt ? "#9370DB" : "gray",
                  padding: 5,
                }}
              >
                <Text style={{ fontSize: 21, color: "white" }}>submit</Text>
              </TouchableOpacity>
            </View>
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
    padding: 35,
  },
});

const mapStateToProps = (state) => ({
  timeline: state.timeline,
  markerAccounts: state.markerAccounts,
});
export default connect(mapStateToProps)(ReportModal);
