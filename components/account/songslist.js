import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const SongsList = ({ lists, toSongPage, origin }) => {
  return (
    <View style={styles.container}>
      {lists.length ? (
        <ScrollView>
          {lists.map((post, index) => (
            <TouchableOpacity
              onPress={() => toSongPage(post)}
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: post.song_name ? null : "space-between",
                height: "auto",
                borderBottomWidth: 1,
                // marginHorizontal: 10,
                borderBottomColor: "gray",
                padding: 10,
              }}
            >
              {post.song_name ? (
                <>
                  <Text
                    style={{
                      fontSize: responsiveSizes[height].sliderItemFontSize,
                      fontWeight: "500",
                      color: "white",
                    }}
                  >
                    {post.song_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: responsiveSizes[height].sliderItemFontSize,
                      fontWeight: "500",
                      paddingLeft: 5,
                      color: "#9370DB",
                    }}
                  >
                    /
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    fontWeight: "500",
                    color: "white",
                  }}
                >
                  {post.name}
                </Text>
              )}
              {post.song_name ? (
                <Text
                  style={{
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    fontWeight: "500",
                    paddingLeft: 5,
                    color: "gray",
                  }}
                >
                  {post.artist_name}{" "}
                </Text>
              ) : (
                <View>
                  <Text
                    style={{
                      fontSize: responsiveSizes[height].sliderItemFontSize,
                      fontWeight: "500",
                      paddingLeft: 5,
                      color: "gray",
                    }}
                  >
                    {post.post_count} {post.post_count === 1 ? "post" : "posts"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
        >
          {origin} has no covers.
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 6,
  },
});

export default SongsList;
