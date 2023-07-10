import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import SongsList from "./songslist";
import ThumbnailPosts from "./thumbnailposts";
import { responsiveSizes } from "../../constants/reusableFunctions";
import { connect } from "react-redux";
const initialLayout = { width: Dimensions.get("window").width };
const { height } = Dimensions.get("window");

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: "#9370DB",
      borderWidth: 1,
      borderColor: "#9370DB",
    }}
    style={{
      backgroundColor: "transparent",
      padding: 10,
      shadowColor: "transparent",
    }}
    activeColor="#9370DB"
    inactiveColor="#2e2e2e"
    renderIcon={({ route, focused, color }) => {
      if (route.key === "posts") {
        return (
          <MaterialIcons
            name="grid-view"
            size={responsiveSizes[height].backwardIcon}
            color={focused ? "#9370DB" : "darkgray"}
          />
        );
      } else if (route.key === "second") {
        return (
          <Ionicons
            name="ios-calendar-sharp"
            size={responsiveSizes[height].backwardIcon}
            color={focused ? "#9370DB" : "darkgray"}
          />
        );
      } else if (route.key === "covers") {
        return (
          <Entypo
            name="note"
            size={responsiveSizes[height].backwardIcon}
            color={focused ? "#9370DB" : "darkgray"}
          />
        );
      }
    }}
    renderLabel={({ route, focused }) => (
      <Text
        style={{
          fontSize: 15,
          color: focused ? "#9370DB" : "darkgray",
          fontWeight: focused ? "600" : "300",
        }}
      >
        {route.title}
      </Text>
    )}
  />
);

const Tabs = ({ toPostView, account, origin, toSongScreen }) => {
  const [index, setIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [posts, setPosts] = useState([]);

  const [routes] = useState([
    { key: "posts", title: "posts" },
    { key: "covers", title: "covers" },
  ]);

  useEffect(() => {
    if (account.posts.length) {
      let songPosts = account.posts.filter((post) => post.song_name);
      setSongs(songPosts);
      let sorted = account.posts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setPosts(sorted);
    }
  }, [account]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "posts":
        return (
          <ThumbnailPosts
            posts={posts}
            display="posts"
            toPostView={toPostView}
            account="user"
          />
        );
      case "covers":
        return (
          <SongsList toSongPage={toSongScreen} lists={songs} origin={origin} />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{ height: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: responsiveSizes[height].thumbnailContainerHeight,
    flex: 1,
    width: "100%",
  },
  scene: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({ currentUser: state.currentUser });
export default connect(mapStateToProps)(Tabs);
