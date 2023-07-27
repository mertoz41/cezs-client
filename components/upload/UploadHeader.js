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
const UploadHeader = ({
  title,
  actionLabel,
  action,
  goBack,
  loading,
  loadPercent,
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
        <View style={{ display: "flex", flex: 4 }}>
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
        <View style={{ display: "flex", flex: 2, justifyContent: "center" }}>
          {loading ? (
            <Text
              style={{
                fontSize: 22,
                padding: 5,
                fontWeight: "500",
                color: "white",
                textAlign: "right",
              }}
            >
              {loadPercent}%
            </Text>
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
          )}
        </View>
      </View>
    </View>
  );
};
export default UploadHeader;
