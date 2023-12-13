import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  responsiveSizes,
  getUnseenNotificationsNumber,
  getUnseenMessagesNumber,
} from "../../constants/reusableFunctions";
import {
  FontAwesome5,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MusicActionButtons from "../reusables/MusicActionButtons";
import { connect } from "react-redux";
import { reusableStyles } from "../../themes";
const { height } = Dimensions.get("window");

const TimelineHeader = ({
  title,
  goBack,
  toMessages,
  toUpload,
  currentUser,
  chatrooms,
  toNotifications,
  loopHandle,
  onLoop,
  notifications,
}) => {
  const [notiNumber, setNotiNumber] = useState(0);
  const [messageNumber, setMessageNumber] = useState(0);

  useEffect(() => {
    setMessageNumber(getUnseenMessagesNumber(chatrooms, currentUser));
    setNotiNumber(getUnseenNotificationsNumber(notifications));
  }, [notifications, chatrooms]);
  const renderleftSide = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          justifyContent: "flex-start",
          alignSelf: "flex-start",
        }}
      >
        {title === "timeline" ? (
          <MusicActionButtons loopHandle={loopHandle} onLoop={onLoop} />
        ) : (
          <TouchableOpacity onPress={() => goBack()}>
            <FontAwesome5
              name="backward"
              size={responsiveSizes[height].iconSize}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const renderMiddle = () => {
    return (
      <View style={{ flex: 3, justifyContent: "flex-end" }}>
        {title ? (
          <Text
            style={{
              fontSize: responsiveSizes[height].screenTitle,
              color: "white",
              alignSelf: "center",
            }}
          >
            {title}
          </Text>
        ) : null}
      </View>
    );
  };
  // const getUnseenNotificationsNumber = () => {
  //   let mapped = notifications.filter((noti) => !noti.seen);
  //   return mapped.length;
  // };

  // const getUnseenMessagesNumber = () => {
  //   let filtered = chatrooms.filter(
  //     (room) =>
  //       room.last_message.user_id !== currentUser?.id && !room.last_message.seen
  //     //  &&
  //     // !room.last_message.seen
  //   );
  //   return filtered.length;
  // };
  const renderRightSide = () => {
    return title === "timeline" ? (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          justifyContent: "flex-end",
          alignSelf: "flex-end",
        }}
      >
        <TouchableOpacity onPress={() => toUpload()}>
          <MaterialCommunityIcons
            name="video-plus-outline"
            size={responsiveSizes[height].iconSize + 2}
            color="#9370DB"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => toNotifications()}>
          <MaterialIcons
            name="notifications-none"
            size={responsiveSizes[height].iconSize}
            color="#9370DB"
          />
          {notiNumber > 0 ? (
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: "red",
                position: "absolute",
                right: 0,
                borderRadius: "50%",
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                {notiNumber}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toMessages()}>
          <Feather
            name="message-circle"
            size={responsiveSizes[height].iconSize - 2}
            color="#9370DB"
          />
          {messageNumber > 0 ? (
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: "red",
                position: "absolute",
                right: 0,
                borderRadius: "50%",
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                {messageNumber}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    ) : (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          justifyContent: "flex-end",
          alignSelf: "flex-end",
        }}
      >
        <MusicActionButtons loopHandle={loopHandle} onLoop={onLoop} />
      </View>
    );
  };
  return (
    <View
      style={{
        height: responsiveSizes[height].header,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 5,
          marginHorizontal: 10,
        }}
      >
        {renderleftSide()}
        {renderMiddle()}
        {renderRightSide()}
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  chatrooms: state.chatrooms,
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(TimelineHeader);
