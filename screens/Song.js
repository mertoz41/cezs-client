import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { API_ROOT } from "../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MusicContent from "../components/artist/MusicContent";
import { connect } from "react-redux";
import MusicHeader from "../components/reusables/MusicHeader";
import MusicCard from "../components/reusables/MusicCard";
import Toast from "react-native-toast-message";
import Filters from "../components/music/Filters";
import { preparePostView } from "../constants/reusableFunctions";
const Song = ({ route, navigation, currentUser }) => {
  const [theSong, setTheSong] = useState(null);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [follows, setFollows] = useState(false);
  const [usersFavorite, setUsersFavorite] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = navigation.addListener("focus", () => {
      getSong(route.params);
    });
    return unsubscribe;
  }, [navigation]);
  const getSong = async (song) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/songs/${song.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let searchedSong = resp.song;
        setFollows(resp.follows);
        setUsersFavorite(resp.user_favorites);
        let sorted = resp.posts.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setPosts(sorted);
        setAllPosts(sorted);
        setLoading(false);
        setTheSong(searchedSong);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const goBack = () => {
    navigation.goBack();
  };
  const toPostView = (item) => {
    let obj = preparePostView(item, posts, theSong.name);
    navigation.navigate("Posts", obj);
  };

  const toSongFollowers = (id, type) => {
    navigation.navigate("Follow", {
      type: type,
      origin: "song",
      id: id,
    });
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          color="gray"
          size="large"
          style={{ marginTop: 10 }}
        />
      ) : null}
      <MusicHeader item={theSong} goBack={goBack} navigate={navigation} />
      {theSong ? (
        <View style={{ flex: 1 }}>
          <MusicCard
            usage="tracks"
            content={theSong}
            toFollowers={toSongFollowers}
          />
          <Filters
            accountPosts={allPosts}
            title={"song"}
            follows={follows}
            setUsersFavorite={setUsersFavorite}
            usersFavorite={usersFavorite}
            setTheItem={setTheSong}
            favoriteItems={currentUser.favoritesongs}
            content={theSong}
            setFollows={setFollows}
            setPosts={setPosts}
          />
          <MusicContent accountPosts={posts} toPostView={toPostView} />
        </View>
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

export default connect(mapStateToProps)(Song);
