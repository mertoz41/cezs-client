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
      }}
    >
      <BlurView
        intensity={30}
        tint="dark"
        style={{
          flex: 1,
        }}
      >
        {props.children}
      </BlurView>
    </View>
  );
};

export default BlurryBubble;
