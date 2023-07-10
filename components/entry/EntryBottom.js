import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const EntryBottom = ({ text, actionVerb, loading, navigate, action }) => {
  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{
        position: "absolute",
        height: "auto",
        marginBottom: 5,
        bottom: 0,
        width: "100%",
      }}
    >
      <BlurView intensity={35} tint="dark">
        <View
          style={{
            // borderTopColor: "gray",
            // borderTopWidth: 2,
            height: "auto",
            paddingVertical: 5,
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => navigate()}
            style={{ alignSelf: "center", marginLeft: 10 }}
          >
            <Text
              style={{
                textAlign: "left",
                color: "white",
                fontSize: responsiveSizes[height].sliderItemFontSize,
                paddingLeft: 10,
                textDecorationLine: "underline",
              }}
            >
              {text}
            </Text>
          </TouchableOpacity>
          {loading ? (
            <View
              style={{
                alignSelf: "center",
                padding: 5,
                margin: 5,
                marginRight: 20,
              }}
            >
              <ActivityIndicator color="whitesmoke" size="small" />
            </View>
          ) : (
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                borderWidth: responsiveSizes[height].borderWidth,
                borderColor: "#9370DB",
                padding: 5,
                margin: 5,
                marginRight: 20,
                height: "auto",
                justifyContent: "center",
                borderRadius: 10,
              }}
              onPress={() => action()}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                }}
              >
                {actionVerb}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
};

export default EntryBottom;
