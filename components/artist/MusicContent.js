import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Thumbnail from "./Thumbnail";
const MusicContent = ({ toPostView, accountPosts }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        {accountPosts.map((item) => (
          <Thumbnail key={item.id} item={item} toPostView={toPostView} />
        ))}
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
