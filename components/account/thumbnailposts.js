import React from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { responsiveSizes } from "../../constants/reusableFunctions";
import Thumbnail from "../artist/Thumbnail";
const { height } = Dimensions.get("window");

const ThumbnailPosts = ({ posts, display, account, toPostView }) => {
  toPostPage = (item) => {
    toPostView(item, posts);
  };
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
            <Thumbnail key={item.id} item={item} toPostView={toPostPage} />
          ))}
        </ScrollView>
      ) : (
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
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
