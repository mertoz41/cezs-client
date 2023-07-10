import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");

const MusicActionButtons = ({ onLoop, loopHandle }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        borderWidth: responsiveSizes[height].borderWidth,
        justifyContent: "space-around",
        paddingLeft: 8,
        borderRadius: 10,
        borderColor: "gray",
      }}
    >
      <TouchableOpacity onPress={() => loopHandle(true)}>
        <Entypo
          name="loop"
          size={responsiveSizes[height].iconSize}
          color={onLoop ? "#9370DB" : "gray"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => loopHandle(false)}
        style={{ paddingHorizontal: 4 }}
      >
        <Entypo
          name="controller-next"
          size={responsiveSizes[height].iconSize}
          color={!onLoop ? "#9370DB" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MusicActionButtons;
