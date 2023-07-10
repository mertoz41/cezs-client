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
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const Info = ({ account, toFollow, toPostView }) => {
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

  const uniqueArray = (array) => {
    return [...new Map(array.map((item) => [item["id"], item])).values()];
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text style={responsiveSizes[height].sectionTitle}>about</Text>
      </View>
      <ScrollView horizontal={true}>
        {account && account.bio ? (
          <View style={styles.bioItem}>
            <Text style={styles.descriptionWriting}>{account.bio}</Text>
          </View>
        ) : null}
        <View style={styles.item}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.numbers}
              onPress={
                account.posts.length
                  ? () => toPostView(account.posts[0], "posts")
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
              onPress={
                account.followers_count > 0 ? () => toFollow("followers") : null
              }
            >
              <Text style={styles.boxNumber}>{account.followers_count}</Text>
              <Text style={styles.boxWritings}>followers</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    marginBottom: 5,
    // backgroundColor: "#2e2e2e",
    // paddingBottom: 5,
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
    // backgroundColor: 'darkgray',
    borderWidth: 1,
    borderColor: "gray",
    marginLeft: 10,
    justifyContent: "center",
    // alignSelf: 'center',
    minHeight: 40,
    maxWidth: 400,
    borderRadius: 20,
    padding: 5,
  },
  bioItem: {
    // backgroundColor: "#9370DB",
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "#9370DB",
    marginLeft: 15,
    justifyContent: "center",
    // alignSelf: 'center',
    // minHeight: 40,
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
