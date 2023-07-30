import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Text,
} from "react-native";
import MusicCard from "../components/reusables/MusicCard";
import { API_ROOT } from "../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MusicContent from "../components/artist/MusicContent";
import MusicHeader from "../components/reusables/MusicHeader";
import { connect } from "react-redux";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  preparePostView,
  responsiveSizes,
} from "../constants/reusableFunctions";
import { TabView, TabBar } from "react-native-tab-view";
import Filters from "../components/music/Filters";
import SongsList from "../components/account/songslist";
const { height } = Dimensions.get("window");
const initialLayout = { width: Dimensions.get("window").width };

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
      } else if (route.key === "covers") {
        return (
          <Entypo
            name="note"
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
const Artist = ({ route, navigation, currentUser }) => {
  const [theArtist, setTheArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [follows, setFollows] = useState(false);
  const [usersFavorite, setUsersFavorite] = useState(false);

  const [songs, setSongs] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = navigation.addListener("focus", () => {
      getArtist(route.params);
    });
    return unsubscribe;
  }, [navigation]);

  const getArtist = async (artis) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/artists/${artis.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let availableRoutes = [];
        if (resp.posts.length) {
          let sorted = resp.posts.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          });

          setPosts(sorted);
          setAllPosts(sorted);
          availableRoutes = [{ key: "posts", title: "posts" }];
        }

        if (resp.songs.length) {
          setSongs(resp.songs);
          availableRoutes = [
            ...availableRoutes,
            { key: "songs", title: "songs" },
          ];
        }
        setRoutes(availableRoutes);

        setTheArtist({ ...resp.artist });
        setUsersFavorite(resp.user_favorites);
        setFollows(resp.follows);

        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const toSongPage = (song) => {
    navigation.push("Song", { id: song.id });
  };
  const goBack = () => {
    navigation.goBack();
  };

  const toArtistFollowers = (id, type) => {
    navigation.navigate("Follow", {
      type: type,
      origin: "artist",
      id: id,
    });
  };

  const toPostView = (item) => {
    let obj = preparePostView(item, posts, theArtist.name);
    navigation.navigate("Posts", obj);
  };
  const [routes, setRoutes] = useState([]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "posts":
        return <MusicContent accountPosts={posts} toPostView={toPostView} />;
      case "songs":
        return <SongsList toSongPage={toSongPage} lists={songs} />;
      default:
        return null;
    }
  };
  return (
    <View style={styles.container}>
      <MusicHeader item={theArtist} goBack={goBack} navigate={navigation} />
      {loading && (
        <ActivityIndicator
          color="gray"
          size="large"
          style={{ marginTop: 10 }}
        />
      )}

      {theArtist && (
        <View style={{ flex: 1 }}>
          <MusicCard
            content={theArtist}
            toFollowers={toArtistFollowers}
            title={"artist"}
            follows={follows}
            setFollows={setFollows}
            favoriteItems={currentUser.favoriteartists}
            setTheItem={setTheArtist}
          />

          <Filters
            accountPosts={allPosts}
            title={"artist"}
            follows={follows}
            setTheItem={setTheArtist}
            content={theArtist}
            setFollows={setFollows}
            favoriteItems={currentUser.favoriteartists}
            setPosts={setPosts}
            setUsersFavorite={setUsersFavorite}
            usersFavorite={usersFavorite}
          />
          {allPosts.length || songs.length ? (
            <TabView
              renderTabBar={renderTabBar}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              style={{ height: 30 }}
            />
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(Artist);
