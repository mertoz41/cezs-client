import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { ListItem } from "react-native-elements";
import Avatar from "../components/reusables/Avatar";
import Toast from "react-native-toast-message";
import { API_ROOT } from "../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import Header from "../components/reusables/Header";
import { responsiveSizes } from "../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const Follow = ({ route, navigation, currentUser }) => {
  const [followType, setFollowType] = useState("all");
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [bands, setBands] = useState([]);
  const [songs, setSongs] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (route.params.origin == "user" || route.params.origin == "profile") {
      if (route.params.type == "following") {
        getFollows(route.params.userId);
      } else {
        getFollowers(route.params.userId);
      }
    } else if (route.params.origin === "band") {
      getBandFollowers(route.params.id);
    } else {
      getContentInfo(route.params.origin, route.params.type, route.params.id);
    }
  }, []);

  const getContentInfo = async (origin, type, id) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/${origin}${type}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setFollowers(resp);
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const getBandFollowers = async (id) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setFollowers(resp.followers);
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const getFollows = async (id) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/getfollows/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setUsers(resp.users);
        setArtists(resp.artists);
        setBands(resp.bands);
        setSongs(resp.songs);
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const getFollowers = async (id) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/getfollowers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setFollowers(resp.followers);
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const backTo = () => {
    navigation.goBack();
  };
  const toUserPage = (user) => {
    if (route.params.origin == "profile") {
      return;
    }
    let thatUser = {
      username: user.username,
      avatar: user.avatar,
      id: user.id,
    };
    navigation.push("User", thatUser);
  };
  const toBandScreen = (band) => {
    if (route.params.origin == "profile") {
      return;
    }
    let thatBand = { bandname: band.name, picture: band.picture, id: band.id };
    navigation.navigate("Band", thatBand);
  };
  const toArtistPage = (artis) => {
    if (route.params.origin == "profile") {
      return;
    }
    let thatArtis = { id: artis.id, name: artis.name };
    navigation.navigate("Artist", thatArtis);
  };
  const toSongPage = (song) => {
    if (route.params.origin == "profile") {
      return;
    }
    navigation.navigate("Song", song);
  };

  const renderItem = (acct, i) => {
    const action = (item) => {
      if (item.song_count) {
        toArtistPage(item);
      } else if (item.artist_id) {
        toSongPage(item);
      } else if (item.username) {
        toUserPage(item);
      } else {
        toBandScreen(item);
      }
    };

    return (
      <ListItem
        key={i}
        bottomDivider
        containerStyle={{ backgroundColor: "transparent" }}
        onPress={() => action(acct)}
      >
        {acct.avatar || acct.picture ? (
          <Avatar
            avatar={acct.avatar || acct.picture}
            withRadius={true}
            size={responsiveSizes[height].newEventAvatarSize}
          />
        ) : null}
        <ListItem.Content>
          <ListItem.Title
            style={{
              fontSize: responsiveSizes[height].sliderItemFontSize,
              color: "white",
            }}
          >
            {item.username ? item.username : item.name}
          </ListItem.Title>
          {item.artist_name ? (
            <ListItem.Subtitle style={{ color: "gray" }}>
              {item.artist_name}
            </ListItem.Subtitle>
          ) : null}
        </ListItem.Content>
      </ListItem>
    );
  };
  const renderOptions = () => {
    const optionButton = (title) => {
      return (
        <TouchableOpacity
          onPress={() => setFollowType(title)}
          style={styles.filterItem}
        >
          <Text
            style={
              followType == title
                ? styles.selectedItemWriting
                : styles.itemWriting
            }
          >
            {title}
          </Text>
        </TouchableOpacity>
      );
    };
    return loading ? (
      <ActivityIndicator color="gray" size="large" style={{ marginTop: 10 }} />
    ) : route.params.type == "following" ? (
      <View>
        <ScrollView horizontal={true}>
          {optionButton("all")}
          {users.length ? optionButton("users") : null}

          {bands.length ? optionButton("bands") : null}

          {artists.length ? optionButton("artists") : null}

          {songs.length ? optionButton("songs") : null}
        </ScrollView>
      </View>
    ) : null;
  };

  const renderFollowers = () => {
    return (
      <ScrollView>
        {followers.length ? followers.map((user) => renderItem(user)) : null}
      </ScrollView>
    );
  };

  const renderAllFollowed = () => {
    const allAccounts = [...users, ...bands, ...artists, ...songs];
    return <View>{allAccounts.map((acct) => renderItem(acct))}</View>;
  };

  const renderFollowedAccounts = () => {
    return (
      <ScrollView>
        {followType == "all" ? renderAllFollowed() : null}
        {users && users.length && followType == "users"
          ? users.map((user, index) => renderItem(user, index))
          : null}
        {bands && bands.length && followType == "bands"
          ? bands.map((band, index) => renderItem(band, index))
          : null}
        {artists && artists.length && followType == "artists"
          ? artists.map((artis, index) => renderItem(artis, index))
          : null}
        {songs && songs.length && followType == "songs"
          ? songs.map((song, i) => renderItem(song, index))
          : null}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={route.params.type} goBack={backTo} />
      {renderOptions()}

      {route.params.type == "followers" || route.params.type == "favorites"
        ? renderFollowers()
        : renderFollowedAccounts()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  filterItem: {
    height: "auto",
    width: "auto",
    padding: 5,
    marginRight: 4,
  },
  itemWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
    textAlign: "center",
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },
  selectedItemWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
    textAlign: "center",
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "#9370DB",
    borderRadius: 10,
    padding: 5,
  },
});

const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(Follow);
