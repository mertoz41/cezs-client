import React from "react";
import { View, StyleSheet, ScrollView, Dimensions, Text } from "react-native";
import Thumbnail from "../artist/Thumbnail";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { width, height } = Dimensions.get("window");

const VideoContainer = ({ toPostView, posts, account, display, loading }) => {
  const renderSkeleton = (i) => {
    return (
      <View
        key={i}
        style={{
          height: width / 3,
          width: width / 3,
          justifyContent: "center",
          backgroundColor: "rgba(147,112,219, .3)",
        }}
      ></View>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => renderSkeleton(i))
        ) : posts.length ? (
          posts.map((item) => (
            <Thumbnail key={item.id} item={item} toPostView={toPostView} />
          ))
        ) : (
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                fontWeight: "300",
                textAlign: "center",
                marginTop: 25,
                color: "white",
              }}
            >{`${account} has no ${display}.`}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 6,
  },
});

export default VideoContainer;
