import React from "react";
import { View, Text, TextInput, Dimensions } from "react-native";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const InputSection = ({ title, value, changeValue }) => {
  return (
    <View
      style={{
        marginHorizontal: 5,
        marginBottom: 5,
        display: "flex",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        flexDirection: "row",
        padding: 5,
      }}
    >
      <Text
        style={{
          fontSize: responsiveSizes[height].sliderItemFontSize,
          fontWeight: "600",
          textAlign: "left",
          color: "white",
          alignSelf: "flex-end",
          textDecorationLine: "underline",
          textDecorationColor: "#9370DB",
          flex: 1,
        }}
      >
        {title}
      </Text>
      <TextInput
        style={{
          fontSize: responsiveSizes[height].sliderItemFontSize,
          flex: 3,
          fontWeight: "bold",
          textAlign: "left",
          alignSelf: "flex-end",
          color: "white",
        }}
        autoCapitalize="none"
        value={value}
        secureTextEntry={
          title === "password" || title === "confirm password" ? true : false
        }
        onChangeText={(text) => changeValue(text)}
        placeholderTextColor="gray"
      />
    </View>
  );
};

export default InputSection;
