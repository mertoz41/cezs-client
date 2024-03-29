import React from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";
const BlurryBubble = (props) => {
  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: props.radius,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight
      }}
    >
      <BlurView
        intensity={30}
        tint="dark"
        style={{
          flex: 1,
          backgroundColor: "rgba(147,112,219, .1)"
        }}
      >
        {props.children}
      </BlurView>
    </View>
  );
};

export default BlurryBubble;
