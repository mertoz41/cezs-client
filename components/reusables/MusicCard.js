import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const MusicCard = ({ content, toFollowers }) => {
  useEffect(() => {
    setViewCount(content?.view_count);
  }, [content]);
  const [viewCount, setViewCount] = useState(0);
  const renderSkeleton = () => {
    return (
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: responsiveSizes[height].sliderItemFontSize,
            paddingRight: 5,
            width: "30%",
            fontWeight: "bold",
            alignSelf: "center",
            backgroundColor: "rgba(147,112,219, .3)",
            color: "transparent",
          }}
        >
          0
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: responsiveSizes[height].sliderItemFontSize,
            color: "transparent",
            backgroundColor: "rgba(147,112,219, .3)",
            marginTop: 4,
          }}
        >
          followers
        </Text>
      </View>
    );
  };
  const renderStats = () => {
    return (
      <View style={styles.bubble}>
        <TouchableOpacity
          style={styles.numbers}
          onPress={
            content?.posts && content.posts.length
              ? () =>
                  toPostView(
                    content?.posts.length
                      ? content.posts[0]
                      : content.bandposts[0],
                    "posts"
                  )
              : null
          }
        >
          <Text style={styles.boxNumber}>{content.post_count}</Text>
          <Text style={styles.boxWritings}>
            {content?.posts && content.posts.length == 1 ? "post" : "posts"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.numbers}
          onPress={
            content.favoriteusers_count && content.favoriteusers_count > 0
              ? () => toFollowers(content.id, "favorites")
              : null
          }
        >
          <Text style={styles.boxNumber}>
            {content.favoriteusers_count ? content.favoriteusers_count : 0}
          </Text>
          <Text style={styles.boxWritings}>users favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numbers}
          onPress={
            content.followingusers_count && content.followingusers_count > 0
              ? () => toFollowers(content.id, "followers")
              : null
          }
        >
          <Text style={styles.boxNumber}>
            {content.followingusers_count ? content.followingusers_count : 0}
          </Text>
          <Text style={styles.boxWritings}>followers</Text>
        </TouchableOpacity>
        <View style={styles.numbers}>
          <Text style={styles.boxNumber}>{viewCount}</Text>
          <Text style={styles.boxWritings}>views</Text>
        </View>
      </View>
    );
  };

  const renderSkeletonContainer = () => {
    return (
      <View style={styles.bubble}>
        {renderSkeleton()}
        {renderSkeleton()}
        {renderSkeleton()}
        {renderSkeleton()}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {content ? renderStats() : renderSkeletonContainer()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: "auto",
    marginHorizontal: 10,
    display: "flex",
    flexDirection: "row",
  },

  boxWritings: {
    textAlign: "center",
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
  },
  boxNumber: {
    textAlign: "center",
    fontSize: responsiveSizes[height].sliderItemFontSize,
    paddingRight: 5,
    justifyContent: "center",
    fontWeight: "bold",
    color: "white",
  },

  numbers: {
    height: "auto",
  },
  bubble: {
    alignSelf: "center",
    width: "100%",
    padding: 10,
    paddingLeft: 0,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(MusicCard);
