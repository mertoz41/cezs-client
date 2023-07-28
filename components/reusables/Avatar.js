import React from "react";
import { View } from "react-native";
import { Avatar as Avi } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
const Avatar = ({ avatar, size, withRadius }) => {
  return (
    <View>
      {avatar ? (
        <Avi
          source={{ uri: avatar }}
          placeholderStyle={{ backgroundColor: "rgba(147,112,219, .3)" }}
          size={size}
          avatarStyle={{ borderRadius: withRadius ? 10 : 0 }}
          containerStyle={{
            alignSelf: "center",
          }}
        />
      ) : (
        <View style={{ height: size, width: size }}>
          <Feather
            name="user"
            size={size}
            color="gray"
            style={{ alignSelf: "center" }}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(Avatar);
