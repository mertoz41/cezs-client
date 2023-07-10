import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import Thumbnail from "../artist/Thumbnail";
const ThumbnailPosts = ({ posts, display, account, toPostView }) => {
  return (
    <View style={styles.container}>
      {posts.length ? (
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            height: "auto",
          }}
        >
          {posts.map((item) => (
            <Thumbnail key={item.id} item={item} toPostView={toPostView} />
          ))}
        </ScrollView>
      ) : (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "300",
            textAlign: "center",
            marginTop: 25,
            color: "white",
          }}
        >{`${account} has no ${display}.`}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
});

export default React.memo(ThumbnailPosts);
