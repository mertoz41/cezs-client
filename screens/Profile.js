import React from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { connect } from "react-redux";
import InstrumentSection from "../components/profile/instrumentsection";
import UpcomingEvent from "../components/account/upcomingevent";
import Info from "../components/account/info";
import Card from "../components/account/card";
import Tabs from "../components/account/Tabs";
import ProfileHeader from "../components/profile/ProfileHeader";
import { preparePostView } from "../constants/reusableFunctions";

const Profile = ({ currentUser, navigation }) => {
  const toMusicPage = (item) => {
    let contentType = item.album_name
      ? "Song"
      : item.artist_name
      ? "Album"
      : "Artist";
    navigation.navigate(contentType, {
      name: item.name,
      id: item.id,
      spotify_id: item.spotify_id,
    });
  };

  const toFollow = (type) => {
    if (type == "following") {
      navigation.navigate("Follow", {
        type: "following",
        origin: "profile",
        userId: currentUser.id,
      });
    } else {
      navigation.navigate("Follow", {
        type: "followers",
        origin: "profile",
        userId: currentUser.id,
      });
    }
  };
  const toSongScreen = (song) => {
    navigation.navigate("Song", { id: song.song_id });
  };

  const toSettingsScreen = () => {
    navigation.navigate("Edit");
  };

  const toBandPage = (band) => {
    navigation.navigate("Band", band);
  };

  const toPostView = (item, posts) => {
    let obj = preparePostView(item, posts, currentUser.username);
    navigation.navigate("Posts", obj);
  };
  return (
    <View style={styles.container}>
      <ProfileHeader account={currentUser} navigateEdit={toSettingsScreen} />
      <ScrollView style={styles.scroll}>
        <Card userId={currentUser.id} avatar={currentUser.avatar} />
        <Info
          account={currentUser}
          toFollow={toFollow}
          toPostView={toPostView}
        />
        {!currentUser.avatar ? (
          <View style={{ marginVertical: 30 }}>
            <Text style={{ fontSize: 25, color: "white", textAlign: "center" }}>
              Customize your profile in{" "}
              <Text
                onPress={() => toSettingsScreen()}
                style={{
                  alignSelf: "center",
                  fontSize: 25,

                  color: "white",
                  textDecorationLine: "underline",
                }}
              >
                settings.
              </Text>
            </Text>
          </View>
        ) : null}
        {currentUser.upcoming_event ? (
          <UpcomingEvent gig={currentUser.upcoming_event} />
        ) : null}
        <InstrumentSection
          toBandPage={toBandPage}
          instruments={currentUser.instruments}
          genres={currentUser.genres}
          bands={currentUser.bands}
          theUser={currentUser}
        />
        {currentUser.posts.length || currentUser.applauds.length ? (
          <Tabs
            account={currentUser}
            toPostView={toPostView}
            toSongScreen={toSongScreen}
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  scroll: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(Profile);
