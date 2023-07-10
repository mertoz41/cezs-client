import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../constants";
import store from "../redux/store";
import Header from "../components/reusables/Header";
import Notification from "../components/timeline/Notification";
import Toast from "react-native-toast-message";
const Notifications = ({ navigation, currentUser, notifications }) => {
  useEffect(() => {
    let unseenNotifications = notifications
      .filter((noti) => !noti.seen)
      .map((noti) => noti.id);
    if (unseenNotifications.length) {
      setTimeout(() => {
        markSeen(unseenNotifications);
      }, 3000);
    }
  }, [notifications]);

  _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const markSeen = async (notis) => {
    let updatedNotis = notifications.map((noti) => ({ ...noti, seen: true }));
    store.dispatch({ type: "NOTIFICATIONS", notifications: updatedNotis });
    let token = await AsyncStorage.getItem("jwt");

    fetch(`http://${API_ROOT}/marknotifications`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notifications: notis,
      }),
    }).catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const toPostView = (noti) => {
    let obj = {
      postId: noti.post_id,
      posts: [noti.post_id],
      title: "notifications",
    };
    navigation.navigate("Posts", obj);
  };

  const toBandPage = (noti) => {
    let obj = {
      bandname: noti.bandname,
      picture: noti.thumbnail,
      id: noti.band_id
    }
    navigation.navigate("Band", obj)
  }

  const toUserPage = (noti) => {
    navigation.navigate("User", {
      id: noti.action_user_id,
      username: noti.username,
      avatar: noti.avatar,
    });
  };

  const backTo = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="notifications" goBack={backTo} />
      {notifications.length ? (
        <ScrollView>
          {notifications.map((noti) => (
            <Notification
              toPostView={toPostView}
              toUserPage={toUserPage}
              toBandPage={toBandPage}
              noti={noti}
              key={noti.id}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  notifications: state.notifications,
});

export default connect(mapStateToProps)(Notifications);
