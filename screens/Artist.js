import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Card from "../components/reusables/MusicCard";
import { API_ROOT } from "../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/reusables/MusicHeader";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import Tabs from "../components/artist/Tabs";
import {
  preparePostView,
  responsiveSizes,
} from "../constants/reusableFunctions";
import Filters from "../components/music/Filters";

const Artist = ({ route, navigation, currentUser }) => {
  const [theArtist, setTheArtist] = useState(null);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <Header item={theArtist} goBack={goBack} navigate={navigation} />
      <Card content={theArtist} toFollowers={toArtistFollowers} />
      <Filters
        loading={loading}
        accountPosts={allPosts}
        title={"artist"}
        setTheItem={setTheArtist}
        content={theArtist}
        favoriteItems={currentUser.favoriteartists}
        setPosts={setPosts}
      />
      {allPosts.length || songs.length ? (
        <Tabs
          posts={allPosts}
          toSongPage={toSongPage}
          songs={songs}
          toPostView={toPostView}
          routes={routes}
        />
      ) : null}
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
