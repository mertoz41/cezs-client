import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import SongsList from "./songslist";
import ThumbnailPosts from "./thumbnailposts";
import { responsiveSizes } from "../../constants/reusableFunctions";
import BlurryBubble from "../reusables/BlurryBubble";
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
      } else if (route.key === "applauds") {
        return (
          <MaterialCommunityIcons
            name="hand-clap"
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
          fontWeight: "300",
          zIndex: 0,
        }}
      >
        {route.title}
      </Text>
    )}
  />
);

const Tabs = ({ toPostView, account, origin, toSongScreen, applauds }) => {
  const [index, setIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [routes, setRoutes] = useState([
    { key: "posts", title: "posts" },
    { key: "covers", title: "covers" },
  ]);

  useEffect(() => {
    if (account.posts.length) {
      let songPosts = account.posts.filter((post) => post.song_name);
      if (songPosts.length) {
        setSongs(songPosts);
      }
    }
    if (origin === "user") {
      setRoutes([...routes, { key: "applauds", title: "applauds" }]);
    }
  }, [account]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "posts":
        return (
          <ThumbnailPosts
            posts={account.posts}
            display="posts"
            toPostView={toPostView}
            account="user"
          />
        );
      case "covers":
        return (
          <SongsList toSongPage={toSongScreen} lists={songs} origin={origin} />
        );
      case "applauds":
        return (
          <ThumbnailPosts
            posts={applauds}
            display="applauds"
            toPostView={toPostView}
            account="user"
          />
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
});

export default Tabs;
