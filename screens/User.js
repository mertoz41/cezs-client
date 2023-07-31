import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import ProfileHeader from "../components/profile/ProfileHeader";
import InstrumentSection from "../components/profile/instrumentsection";
import { API_ROOT } from "../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpcomingEvent from "../components/account/upcomingevent";
import Info from "../components/account/info";
import Card from "../components/account/card";
import UserTabs from "../components/account/Tabs";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
import { preparePostView } from "../constants/reusableFunctions";
const User = ({ route, navigation, chatrooms, currentUser }) => {
  const isFocused = useIsFocused();
  const [theUser, setTheUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [follows, setFollows] = useState(false);
  const [songs, setSongs] = useState([]);
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused && !theUser) {
      setLoading(true);
      getUser(route.params.id);
    }

    return () => {
      setTheUser(null);
    };
  }, [isFocused]);

  const getUser = async (id) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setFollows(resp.follows);
        setTheUser(resp.user);

        if (resp.user.upcoming_event) {
          setUpcomingEvent(resp.user.upcoming_event);
        }
        Animated.timing(translation, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const toFollow = (type) => {
    if (type == "following") {
      navigation.navigate("Follow", {
        type: "following",
        origin: "user",
        userId: theUser.id,
      });
    } else {
      navigation.navigate("Follow", {
        type: "followers",
        origin: "user",
        userId: theUser.id,
      });
    }
  };

  const toSongScreen = (song) => {
    navigation.navigate("Song", { id: song.song_id });
  };

  const toSettingsScreen = () => {
    navigation.navigate("Edit");
  };
  const toCommentsScreen = (comments) => {
    navigation.navigate("Comment", comments);
  };
  const toArtistPageFromContent = (artis) => {
    navigation.navigate("Artist", artis);
  };

  const toBandPage = (band) => {
    navigation.push("Band", { ...band, bandname: band.name });
  };
  const toMessageScreen = (user) => {
    let found = chatrooms.find((room) =>
      room.users.find((usr) => usr.id == user.id)
    );
    if (found) {
      navigation.navigate("Message", { room: found });
    } else {
      navigation.navigate("Message", { newMessage: user });
    }
  };

  const toPostView = (item, posts) => {
    let obj = preparePostView(item, posts, theUser.username);
    navigation.navigate("Posts", obj);
  };

  return (
    <Animated.View style={{ opacity: translation }}>
      <ProfileHeader
        account={theUser}
        goBack={navigation.goBack}
        navigateMessages={toMessageScreen}
        getAccount={getUser}
        follows={follows}
        setFollows={setFollows}
        navigateEdit={toSettingsScreen}
      />
      {loading ? (
        <ActivityIndicator
          color="gray"
          size="large"
          style={{ marginTop: 10 }}
        />
      ) : null}

      {theUser ? (
        <ScrollView>
          <Card avatar={theUser.avatar} />
          <Info
            type="user"
            toMessageScreen={toMessageScreen}
            setTheUser={setTheUser}
            toPostView={toPostView}
            account={theUser}
            toFollow={toFollow}
          />
          {upcomingEvent ? <UpcomingEvent gig={upcomingEvent} /> : null}
          <InstrumentSection
            toBandPage={toBandPage}
            theUser={theUser}
            bands={theUser.bands}
            instruments={theUser.instruments}
            genres={theUser.genres}
          />
          {theUser.posts.length || theUser.applauds.length ? (
            <UserTabs
              account={theUser}
              toPostView={toPostView}
              toSongScreen={toSongScreen}
              origin={"user"}
            />
          ) : null}
        </ScrollView>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  writing: {
    textAlign: "center",
    fontSize: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "royalblue",
    padding: 10,
  },
});

const mapStateToProps = (state) => ({
  chatrooms: state.chatrooms,
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(User);
