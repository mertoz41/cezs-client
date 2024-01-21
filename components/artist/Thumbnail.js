import React from "react";
import { TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { Avatar } from "react-native-elements";
const { width } = Dimensions.get("window");

const Thumbnail = ({ item, toPostView }) => {
  return (
    <TouchableOpacity
      onPress={() => toPostView(item)}
      key={item.id}
      style={{ height: width / 3, width: width / 3, justifyContent: "center" }}
    >
      {item.thumbnail ? (
        <Avatar
          source={{ uri: item.thumbnail }}
          size={width / 3}
          placeholderStyle={{ backgroundColor: "rgba(147,112,219, .3)" }}
        />
      ) : (
        <ActivityIndicator color="gray" size="large" />
      )}
    </TouchableOpacity>
  );
};

export default Thumbnail;
