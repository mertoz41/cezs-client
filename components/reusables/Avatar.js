import React from "react";
import { View } from "react-native";
import { Avatar as Avi } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import BlurryBubble from "./BlurryBubble";
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
        <BlurryBubble marginRight={0} radius={0}>
          <View style={{ height: size, width: size, alignSelf: "center" }}>
            <Feather
              name="user"
              size={size}
              color="gray"
              style={{ alignSelf: "center" }}
            />
          </View>
        </BlurryBubble>
      )}
    </View>
  );
};

export default React.memo(Avatar);
