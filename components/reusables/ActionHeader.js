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
const ActionHeader = ({
  title,
  actionLabel,
  action,
  displayAction,
  goBack,
  loading,
}) => {
  const renderLeft = () => {
    return (
      <View style={{ display: "flex", flexDirection: "row", flex: 2 }}>
        {loading ? null : (
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={() => goBack()}
          >
            <FontAwesome5
              name="backward"
              size={responsiveSizes[height].backwardIcon}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const renderMiddle = () => {
    return (
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
    );
  };
  const renderRight = () => {
    return (
      <View style={{ display: "flex", flex: 2, justifyContent: "center" }}>
        {displayAction &&
          (loading ? (
            <ActivityIndicator
              style={{ alignSelf: "flex-end", marginRight: 10 }}
              color="gray"
              size="small"
            />
          ) : (
            <TouchableOpacity
              style={{
                borderWidth: responsiveSizes[height].borderWidth,
                borderColor: "#9370DB",
                borderRadius: 10,
                alignSelf: "flex-end",
              }}
              onPress={() => action()}
            >
              <Text
                style={{
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                  color: "white",
                  padding: 5,
                }}
              >
                {actionLabel}
              </Text>
            </TouchableOpacity>
          ))}
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
        {renderLeft()}
        {renderMiddle()}
        {renderRight()}
      </View>
    </View>
  );
};
export default ActionHeader;
