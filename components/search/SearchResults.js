import React from "react";
import {
  TouchableOpacity,
  ScrollView,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import Avatar from "../reusables/Avatar";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { width, height } = Dimensions.get("window");

const SearchResults = ({
  result,
  loading,
  selectedLength,
  dataLoading,
  navigation,
  searchingFor,
}) => {
  const toUserPage = (item) => {
    let user = { username: item.username, avatar: item.avatar, id: item.id };
    navigation.navigate("User", user);
  };
  const toBandPage = (item) => {
    let thatBand = { bandname: item.name, picture: item.picture, id: item.id };
    navigation.navigate("Band", thatBand);
  };

  const toPostView = (item) => {
    let posts = result.map((post) => post.id);
    let sliced = posts.slice(posts.indexOf(item.id));
    let obj = {
      postId: item.id,
      usage: "search",
      title: "library",
      posts: sliced,
    };
    navigation.navigate("Posts", obj);
  };
  const renderListTitle = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={responsiveSizes[height].sectionTitle}>
          {selectedLength ? "results" : "most recent"}
        </Text>
        {loading ? (
          <ActivityIndicator style={{ marginRight: 10 }} size={"small"} />
        ) : null}
      </View>
    );
  };
  return (
    <View>
      {renderListTitle()}
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          height: "auto",
        }}
      >
        {dataLoading
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <View
                key={i}
                style={{
                  height: width / 4,
                  width: width / 4,
                  backgroundColor: "rgba(147,112,219, .3)",
                }}
              />
            ))
          : result.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  searchingFor === "users"
                    ? toUserPage(item)
                    : searchingFor === "bands"
                    ? toBandPage(item)
                    : toPostView(item);
                }}
                key={index}
              >
                <Avatar
                  avatar={item.thumbnail ? item.thumbnail : item.avatar}
                  size={width / 4}
                  withRadius={false}
                />
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
};

export default SearchResults;
