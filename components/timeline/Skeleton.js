import React from "react";

import { View, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

import { responsiveSizes } from "../../constants/reusableFunctions";
const Skeleton = () => {
  const renderHeader = () => {
    return (
      <View
        style={{
          height: 50,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 0,
            margin: 5,
          }}
        >
          <View style={{ paddingRight: 10 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(147,112,219, .1)",
                  borderRadius: 10,
                }}
              />

              <View style={{ marginLeft: 5, justifyContent: "space-between" }}>
                <View
                  style={{
                    height: 20,
                    width: 130,
                    backgroundColor: "rgba(147,112,219, .1)",
                  }}
                />
                <View
                  style={{
                    height: 10,
                    width: 80,
                    backgroundColor: "rgba(147,112,219, .1)",
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            margin: 5,
            alignItems: "flex-end",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              height: 20,
              width: 150,
              alignSelf: "flex-end",
              backgroundColor: "rgba(147,112,219, .1)",
            }}
          />

          <View
            style={{
              height: 15,
              width: 100,
              backgroundColor: "rgba(147,112,219, .1)",
            }}
          />
        </View>
      </View>
    );
  };
  const renderVideo = () => {
    return (
      <View
        style={{
          height: responsiveSizes[height].postItemVideo,
          width: width,
          backgroundColor: "rgba(147,112,219, .1)",
        }}
      />
    );
  };
  return (
    <View>
      {renderHeader()}
      {renderVideo()}
    </View>
  );
};

export default Skeleton;
