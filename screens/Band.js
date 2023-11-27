import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, ActivityIndicator, Animated } from "react-native";
import { API_ROOT } from "../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpcomingEvent from "../components/account/upcomingevent";
import Info from "../components/account/info";
import Card from "../components/account/card";
import { connect } from "react-redux";
import ProfileHeader from "../components/profile/ProfileHeader";
import InstrumentSection from "../components/profile/instrumentsection";
import Toast from "react-native-toast-message";
import Tabs from "../components/account/Tabs";
import { preparePostView } from "../constants/reusableFunctions";
const Band = ({ route, navigation }) => {
  const [theBand, setTheBand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upcomingGig, setUpcomingGig] = useState(null);
  const [follows, setFollows] = useState(false);
  const [followerNumber, setFollowerNumber] = useState(null);
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoading(true);
    getBand(route.params.id);
    return () => {
      setTheBand(null);
    };
  }, []);
  const getBand = async (id) => {
    let token = await AsyncStorage.getItem("jwt");

    fetch(`http://${API_ROOT}/bands/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setTheBand(resp.band);
        setFollowerNumber(resp.band.followers_count);
        setFollows(resp.follows);
        if (resp.band.upcoming_event) {
          setUpcomingGig(resp.band.upcoming_event);
        }

        setLoading(false);
        Animated.timing(translation, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const backTo = () => {
    navigation.goBack();
  };
  const toEditBand = () => {
    navigation.navigate("BandEdit", theBand);
  };

  const toFollow = (type) => {
    navigation.navigate("Follow", {
      type: type,
      origin: "band",
      id: theBand.id,
    });
  };

  const toSongScreen = (song) => {
    navigation.navigate("Song", { id: song.song_id });
  };

  const toUserProfile = (member) => {
    let user = {
      username: member.username,
      avatar: member.avatar,
      id: member.id,
    };
    navigation.push("User", user);
  };
  const toPostView = (item) => {
    let obj = preparePostView(item, theBand.posts, theBand.name);
    navigation.navigate("Posts", obj);
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator
          color="gray"
          size="large"
          style={{ marginTop: 10 }}
        />
      ) : null}
      <Animated.View style={{ opacity: translation }}>
        <ProfileHeader
          navigateEdit={toEditBand}
          account={theBand}
          follows={follows}
          setFollows={setFollows}
          goBack={backTo}
          setFollowerNumber={setFollowerNumber}
        />
        <ScrollView>
          {theBand ? (
            <>
              <Card avatar={theBand.picture} />
              <Info
                toPostView={toPostView}
                account={theBand}
                toFollow={toFollow}
                followerNumber={followerNumber}
              />
              {upcomingGig ? <UpcomingEvent gig={upcomingGig} /> : null}

              <InstrumentSection
                genres={theBand.genres}
                instruments={theBand.instruments}
                members={theBand.members}
                toUserPage={toUserProfile}
              />

              {theBand.posts.length ? (
                <Tabs
                  account={theBand}
                  toPostView={toPostView}
                  toSongScreen={toSongScreen}
                  origin={"band"}
                  applauds={[]}
                />
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(Band);
