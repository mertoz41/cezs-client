import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import dateFormat from "dateformat";
import { BlurView } from "expo-blur";

import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
import BlurryBubble from "../reusables/BlurryBubble";

const Info = ({ account, toFollow, toPostView, followerNumber }) => {
  const [viewCount, setViewCount] = useState(0);
  useEffect(() => {
    let postsCount = 0;
    account.posts.forEach((post) => (postsCount += post.view_count));
    setViewCount(postsCount);
  }, []);
  const getDate = (date) => {
    let fixed = dateFormat(date, "fullDate");
    let splitted = fixed.split(",");
    let month = splitted[1].split(" ")[1];
    let year = splitted[2];
    return month + year;
  };

  const renderStats = () => {
    return (
      <BlurryBubble marginRight={0} marginLeft={10} radius={20}>
        <View style={styles.item}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.numbers}
              onPress={
                account.posts.length
                  ? () => toPostView(account.posts[0], account.posts)
                  : null
              }
            >
              <Text style={styles.boxNumber}>{account.posts.length}</Text>
              <Text style={styles.boxWritings}>posts</Text>
            </TouchableOpacity>

            <View style={styles.numbers}>
              <Text style={styles.boxNumber}>{viewCount}</Text>
              <Text style={styles.boxWritings}>views</Text>
            </View>
            {!account.members ? (
              <TouchableOpacity
                style={styles.numbers}
                onPress={
                  account.follows_count > 0 ? () => toFollow("following") : null
                }
              >
                <Text style={styles.boxNumber}>{account.follows_count}</Text>
                <Text style={styles.boxWritings}>following</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.numbers}
              onPress={followerNumber > 0 ? () => toFollow("followers") : null}
            >
              <Text style={styles.boxNumber}>{followerNumber}</Text>
              <Text style={styles.boxWritings}>followers</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurryBubble>
    );
  };

  const renderOrigin = () => {
    return (
      <BlurryBubble marginRight={0} marginLeft={10} radius={20}>
        <View style={styles.item}>
          {account && account.location ? (
            <View style={{ height: "auto", flexDirection: "row" }}>
              <TouchableOpacity style={{ justifyContent: "center" }}>
                <Ionicons
                  name="navigate-circle"
                  size={responsiveSizes[height].backwardIcon}
                  color="darkgray"
                />
              </TouchableOpacity>
              <View style={{ justifyContent: "center", paddingLeft: 5 }}>
                <Text style={styles.memberWriting}>
                  {account.location.city}
                </Text>
              </View>
            </View>
          ) : null}
          <View style={{ height: "auto", flexDirection: "row" }}>
            <View>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={responsiveSizes[height].backwardIcon}
                color="darkgray"
              />
            </View>
            <View style={{ justifyContent: "center", paddingLeft: 5 }}>
              <Text style={styles.memberWriting}>
                {account.username ? "member since " : "established in "}
                {getDate(account.created_at)}
              </Text>
            </View>
          </View>
        </View>
      </BlurryBubble>
    );
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text style={responsiveSizes[height].sectionTitle}>about</Text>
      </View>
      <ScrollView horizontal={true}>
        {account && account.bio ? (
          <BlurryBubble marginRight={0} marginLeft={10} radius={20}>
            <View style={styles.bioItem}>
              <Text style={styles.descriptionWriting}>{account.bio}</Text>
            </View>
          </BlurryBubble>
        ) : null}
        {renderStats()}
        {renderOrigin()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    marginBottom: 5,
  },
  numbers: {
    height: "auto",
    alignSelf: "center",
    marginLeft: 10,
  },
  boxWritings: {
    textAlign: "center",
    fontSize: responsiveSizes[height].sliderItemFontSize,
    fontWeight: "300",
    color: "white",
  },
  boxNumber: {
    textAlign: "center",
    fontSize: responsiveSizes[height].sliderItemFontSize,
    fontWeight: "300",
    color: "white",
  },

  descriptionWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    fontWeight: "300",
    alignSelf: "center",
    paddingLeft: 5,
    color: "white",
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    // marginLeft: 10,
    justifyContent: "center",
    // minHeight: 40,
    maxWidth: responsiveSizes[height].bioMaxWidth,
    borderRadius: 20,
    padding: 5,
  },
  bioItem: {
    flex: 1,
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "#9370DB",
    // marginLeft: 15,    

    justifyContent: "center",
    maxWidth: responsiveSizes[height].bioMaxWidth,
    borderRadius: 20,
    padding: 5,
  },
  memberWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    fontWeight: "300",
    color: "white",
  },
});
const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  timeline: state.timeline,
});

export default connect(mapStateToProps)(Info);
