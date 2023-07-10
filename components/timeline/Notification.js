import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { getTiming, responsiveSizes } from "../../constants/reusableFunctions";
import Avatar from "../reusables/Avatar";
const { height } = Dimensions.get("window");
const Notification = ({ noti, toUserPage, toPostView, toBandPage }) => {
  const navigation = () => {
    if (noti.post_id) {
      toPostView(noti);
    } else {
      toBandPage(noti);
    }
  };

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        backgroundColor: noti.seen ? "transparent" : "rgba(250,250,250, .3)",
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity onPress={() => toUserPage(noti)}>
        <Avatar
          avatar={noti.avatar}
          size={responsiveSizes[height].newEventAvatarSize}
          withRadius={true}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 2,
          marginHorizontal: 1,
          justifyContent: "space-between",
          marginLeft: 5,
        }}
      >
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            color: "white",
          }}
        >
          {noti.message}.
        </Text>
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize - 4,
            color: "lightgray",
          }}
        >
          {getTiming(noti.created_at)}
        </Text>
      </View>
      {noti.thumbnail ? (
        <TouchableOpacity onPress={() => navigation()}>
          <Avatar
            avatar={noti.thumbnail}
            size={responsiveSizes[height].newEventAvatarSize}
            withRadius={false}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Notification;
