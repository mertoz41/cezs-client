import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const Header = ({
  title,

  goBack,
}) => {
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
        <View style={{ display: "flex", flex: 4, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: responsiveSizes[height].screenTitle,

              color: "white",
              alignSelf: "center",
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Header;
