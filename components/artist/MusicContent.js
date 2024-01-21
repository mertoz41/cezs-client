import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import Thumbnail from "./Thumbnail";
const { width } = Dimensions.get("window");

const MusicContent = ({ toPostView, accountPosts, loading }) => {
  const renderSkeleton = (i) => {
    return (
      <View
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
        {loading
          ? [1, 2, 3, 4, 5, 6].map((i) => renderSkeleton(i))
          : accountPosts.length
          ? accountPosts.map((item) => (
              <Thumbnail key={item.id} item={item} toPostView={toPostView} />
            ))
          : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 6,
  },
});

export default MusicContent;
