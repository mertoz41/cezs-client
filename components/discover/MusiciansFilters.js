import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
} from "react-native";
import { connect } from "react-redux";
import Avatar from "../reusables/Avatar";
const { width, height } = Dimensions.get("window");
import { BlurView } from "expo-blur";
import {
  preparePostView,
  responsiveSizes,
} from "../../constants/reusableFunctions";
const MusiciansFilter = ({
  selectedMarker,
  toUserPage,
  toBandPage,
  instruments,
  markerAccounts,
  navigation,
  markerPosts,
  genres,
}) => {
  const [display, setDisplay] = useState("instruments");
  const [contentDisplay, setContentDisplay] = useState("users");
  const [filterUsers, setFilterUsers] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filterPosts, setFilterPosts] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const translation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(translation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    return () => {};
  }, []);
  //
  // ADD LOCATION CARD INTO HEADER, DISPLAY LOCATION BELOW, DISPLAY LOCATION NAME AT VERY TOP, REPLACE ADD BUTTON WITH CLOSE WHEN LOCATION IS SELECTED TO CLOSE LOCATION

  const toPostsPage = (item) => {
    let posts =
      selectedGenres.length || selectedInstruments.length
        ? filterPosts
        : markerPosts;

    let obj = preparePostView(item, posts, selectedMarker.city);
    navigation.navigate("Posts", obj);
  };

  const genreFunc = (item) => {
    if (selectedGenres.includes(item.id)) {
      // deselection
      let filteredGenres = selectedGenres.filter((genr) => genr !== item.id);
      setSelectedGenres(filteredGenres);
      updateMarker(filteredGenres, selectedInstruments);
    } else {
      // selection
      let updatedSelectGenres = [...selectedGenres, item.id];
      setSelectedGenres(updatedSelectGenres);
      updateMarker(updatedSelectGenres, selectedInstruments);
    }
  };

  const instrumentFunc = (item) => {
    // function that filters users and posts
    if (item == "all") {
      setSelectedInstruments([]);
      setSelectedGenres([]);
      setFilterUsers([]);
      setFilterPosts([]);
    } else {
      if (selectedInstruments.includes(item.id)) {
        // deselecting an option
        let filteredSelectedInst = selectedInstruments.filter(
          (it) => it !== item.id
        );
        setSelectedInstruments(filteredSelectedInst);
        updateMarker(selectedGenres, filteredSelectedInst);
      } else {
        // selecting an option
        let selectedIns = [...selectedInstruments, item.id];
        setSelectedInstruments(selectedIns);
        updateMarker(selectedGenres, selectedIns);

        // selectItem(item)
      }
    }
  };
  const updateMarker = (genres, instruments) => {
    let updatedUsers = markerAccounts.filter((account) => {
      return (
        account.instruments.some((inst) => instruments.includes(inst.id)) ||
        account.genres.some((genre) => genres.includes(genre.id))
      );
    });
    setFilterUsers(updatedUsers);
    let updatedPosts = markerPosts.filter((post) => {
      return (
        post.instruments.some((inst) => instruments.includes(inst.id)) ||
        genres.includes(post.genre.id)
      );
    });

    setFilterPosts(updatedPosts);
  };

  const toAccountPage = (account) => {
    if (account.picture) {
      toBandPage(account);
    } else {
      toUserPage(account);
    }
  };
  const renderBottom = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          margin: 5,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: responsiveSizes[height].sliderItemFontSize,
            textDecorationLine: "underline",
            textDecorationColor: "#9370DB",
          }}
        >
          {selectedMarker?.city}
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    changeContent = (content) => {
      setFilterUsers([]);
      setSelectedGenres([]);
      setSelectedInstruments([]);
      setFilterPosts([]);
      setContentDisplay(content);
    };
    return (
      <View style={{ flex: 1 }}>
        {renderOptions()}
        <View
          style={{
            flex: 1,
            height: 250,
            flexWrap: "wrap",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {renderContent()}
          </ScrollView>
        </View>
        {renderBottom()}
      </View>
    );
  };
  const renderLocationContent = (content) => {
    return content.map((item, i) => (
      <TouchableOpacity
        key={i}
        onPress={() =>
          contentDisplay === "users" ? toAccountPage(item) : toPostsPage(item)
        }
      >
        <Avatar
          avatar={
            item.thumbnail
              ? item.thumbnail
              : item.username
              ? item.avatar
              : item.picture
          }
          size={(width - responsiveSizes[height].locationAvatarFit) / 4}
          withRadius={false}
        />
      </TouchableOpacity>
    ));
  };
  const renderContent = () => {
    return contentDisplay === "users"
      ? selectedInstruments.length || selectedGenres.length
        ? renderLocationContent(filterUsers)
        : renderLocationContent(markerAccounts)
      : selectedInstruments.length || selectedGenres.length
      ? renderLocationContent(filterPosts)
      : renderLocationContent(markerPosts);
  };
  const renderMusicItem = (item, action, selected) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={{ marginRight: 5 }}
        onPress={() => action(item)}
      >
        <View
          style={
            selected.includes(item.id)
              ? responsiveSizes[height].selectedItem
              : responsiveSizes[height].regularItem
          }
        >
          <Text
            style={
              selected.includes(item.id)
                ? responsiveSizes[height].selectedItemWriting
                : responsiveSizes[height].itemWriting
            }
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderOptions = () => {
    return (
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", margin: 5 }}>
            {instruments.length ? (
              <TouchableOpacity
                style={{ marginRight: 5 }}
                onPress={() => setDisplay("instruments")}
              >
                <View
                  style={
                    display == "instruments"
                      ? responsiveSizes[height].selectedItem
                      : responsiveSizes[height].regularItem
                  }
                >
                  <Text
                    style={
                      display == "instruments"
                        ? responsiveSizes[height].selectedItemWriting
                        : responsiveSizes[height].itemWriting
                    }
                  >
                    instruments
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {genres.length ? (
              <TouchableOpacity
                style={
                  display == "genres"
                    ? responsiveSizes[height].selectedItem
                    : responsiveSizes[height].regularItem
                }
                onPress={() => setDisplay("genres")}
              >
                <Text
                  style={
                    display == "genres"
                      ? responsiveSizes[height].selectedItemWriting
                      : responsiveSizes[height].itemWriting
                  }
                >
                  genres
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={{ flexDirection: "row", margin: 5 }}>
            <TouchableOpacity onPress={() => changeContent("users")}>
              <View
                style={
                  contentDisplay == "users"
                    ? responsiveSizes[height].selectedItem
                    : responsiveSizes[height].regularItem
                }
              >
                <Text
                  style={
                    contentDisplay == "users"
                      ? responsiveSizes[height].selectedItemWriting
                      : responsiveSizes[height].itemWriting
                  }
                >
                  users
                </Text>
              </View>
            </TouchableOpacity>
            {markerPosts.length ? (
              <TouchableOpacity
                style={{ marginLeft: 5 }}
                onPress={() => changeContent("posts")}
              >
                <View
                  style={
                    contentDisplay == "posts"
                      ? responsiveSizes[height].selectedItem
                      : responsiveSizes[height].regularItem
                  }
                >
                  <Text
                    style={
                      contentDisplay == "posts"
                        ? responsiveSizes[height].selectedItemWriting
                        : responsiveSizes[height].itemWriting
                    }
                  >
                    {markerPosts.length} posts
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <ScrollView
          horizontal={true}
          style={{ marginBottom: 5, marginLeft: 5 }}
        >
          {display == "instruments"
            ? instruments.map((inst, i) =>
                renderMusicItem(inst, instrumentFunc, selectedInstruments)
              )
            : null}
          {display == "genres"
            ? genres.map((genr) =>
                renderMusicItem(genr, genreFunc, selectedGenres)
              )
            : null}
        </ScrollView>
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        // height: "auto",
        display: "flex",
        top: 80,
        width: "96%",
        alignSelf: "center",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        zIndex: 1,
        opacity: translation,
      }}
    >
      <View style={{ overflow: "hidden", borderRadius: 10 }}>
        <BlurView intensity={20} tint="dark">
          {renderHeader()}
        </BlurView>
      </View>
    </Animated.View>
  );
};

const mapStateToProps = (state) => ({
  selectedMarker: state.selectedMarker,
  markerAccounts: state.markerAccounts,
  markerPosts: state.markerPosts,
  currentUser: state.currentUser,
});
export default connect(mapStateToProps)(MusiciansFilter);
