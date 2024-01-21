import React, { useState } from "react";
import { Text, Dimensions } from "react-native";
import SongsList from "../account/songslist";
import { TabView, TabBar } from "react-native-tab-view";
import { responsiveSizes } from "../../constants/reusableFunctions";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import VideoContainer from "../reusables/VideoContainer";
const { height, width } = Dimensions.get("window");
const initialLayout = { width: width };

const Tabs = ({ posts, toSongPage, toPostView, songs, routes, loading }) => {
  const [index, setIndex] = useState(0);
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
              color={focused ? "#9370DB" : "gray"}
            />
          );
        } else if (route.key === "songs") {
          return (
            <MaterialIcons
              name="queue-music"
              size={responsiveSizes[height].backwardIcon}
              color={focused ? "#9370DB" : "gray"}
            />
          );
        }
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            fontSize: 15,
            color: focused ? "#9370DB" : "gray",
            fontWeight: focused ? "600" : "300",
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "posts":
        return (
          <VideoContainer
            posts={posts}
            toPostView={toPostView}
            loading={loading}
          />
        );
      case "songs":
        return <SongsList toSongPage={toSongPage} lists={songs} />;
      default:
        return null;
    }
  };
  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{ height: 30 }}
    />
  );
};

export default Tabs;
