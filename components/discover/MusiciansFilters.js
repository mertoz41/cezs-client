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
import BlurryBubble from "../reusables/BlurryBubble";
import { BlurView } from "expo-blur";
import {
  preparePostView,
  responsiveSizes,
} from "../../constants/reusableFunctions";
const MusiciansFilter = ({
  selectedMarker,
  toUserPage,
  toBandPage,
  markerAccounts,
  navigation,
  markerPosts,
}) => {
  const [display, setDisplay] = useState("instruments");
  const [contentDisplay, setContentDisplay] = useState("users");
  const [filterUsers, setFilterUsers] = useState([]);
  const [accountInstruments, setAccountInstruments] = useState([]);
  const [accountGenres, setAccountGenres] = useState([]);
  const [postInstruments, setPostInstruments] = useState([]);
  const [postGenres, setPostGenres] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filterPosts, setFilterPosts] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const translation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    setAccountInstruments(getUniqueFilters(markerAccounts).instruments);
    setAccountGenres(getUniqueFilters(markerAccounts).genres);
    setPostGenres(getUniqueFilters(markerPosts).genres);
    setPostInstruments(getUniqueFilters(markerPosts).instruments);

    Animated.timing(translation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    return () => {};
  }, []);

  const getUniqueFilters = (list) => {
    let allInstruments = [];
    let allGenres = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].instruments?.length) {
        allInstruments.push(...list[i].instruments);
      }
      if (list[i].genres?.length) {
        allGenres.push(...list[i].genres);
      } else if (list[i].genre) {
        allGenres.push(list[i].genre);
      }
    }
    const uniquify = (list) => {
      return list.filter(
        (elem, index) => list.findIndex((obj) => obj.id === elem.id) === index
      );
    };
    let uniqueInstruments = uniquify(allInstruments);
    let uniqueGenres = uniquify(allGenres);

    return {
      instruments: uniqueInstruments,
      genres: uniqueGenres,
    };
  };
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
      updateFilterResults(filteredGenres, selectedInstruments);
    } else {
      // selection
      let updatedSelectGenres = [...selectedGenres, item.id];
      setSelectedGenres(updatedSelectGenres);
      updateFilterResults(updatedSelectGenres, selectedInstruments);
    }
  };

  const instrumentFunc = (item) => {
    // function that filters users and posts

    if (selectedInstruments.includes(item.id)) {
      // deselecting an option
      let filteredSelectedInst = selectedInstruments.filter(
        (it) => it !== item.id
      );
      setSelectedInstruments(filteredSelectedInst);
      updateFilterResults(selectedGenres, filteredSelectedInst);
    } else {
      // selecting an option
      let selectedIns = [...selectedInstruments, item.id];
      setSelectedInstruments(selectedIns);
      updateFilterResults(selectedGenres, selectedIns);

      // selectItem(item)
    }
  };
  const updateFilterResults = (genres, instruments) => {
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

  changeContent = (content) => {
    setFilterUsers([]);
    setSelectedGenres([]);
    setSelectedInstruments([]);
    setFilterPosts([]);
    setContentDisplay(content);
  };
  const renderHeader = () => {
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
    return selected.includes(item.id) ? (
      <TouchableOpacity
        key={item.id}
        style={{ marginRight: 5 }}
        onPress={() => action(item)}
      >
        <BlurryBubble marginRight={0} marginLeft={0} radius={10}>
          <Text
            style={{
              fontSize: 21,
              fontWeight: 600,
              padding: 5,
              color: "white",
              flexWrap: "wrap",
            }}
          >
            {item.name}
          </Text>
        </BlurryBubble>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        key={item.id}
        style={{ marginRight: 5 }}
        onPress={() => action(item)}
      >
        <Text
          style={{
            fontSize: 21,
            fontWeight: 600,
            padding: 4,
            color: "black",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "gray",
            flexWrap: "wrap",
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const filterButton = (comparison, type, func) => {
    return comparison === type ? (
      <TouchableOpacity onPress={() => func(type)}>
        <BlurryBubble marginRight={0} marginLeft={0} radius={10}>
          <Text
            style={{
              fontSize: 21,
              fontWeight: 600,
              padding: 5,
              color: "white",
              flexWrap: "wrap",
            }}
          >
            {type}
          </Text>
        </BlurryBubble>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => func(type)}>
        <Text
          style={{
            fontSize: 21,
            borderRadius: 10,
            borderWidth: 1,
            marginRight: 0,
            borderColor: "gray",
            fontWeight: 600,
            padding: 4,
            flexWrap: "wrap",
          }}
        >
          {type}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOptions = () => {
    return (
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", margin: 5 }}>
            <View style={{ marginRight: 10 }}>
              {filterButton(contentDisplay, "users", changeContent)}
            </View>
            {markerPosts.length
              ? filterButton(
                  contentDisplay,
                  `${markerPosts.length} posts`,
                  changeContent
                )
              : null}
          </View>
          <View style={{ flexDirection: "row", margin: 5 }}>
            {contentDisplay === "users" ? (
              accountInstruments.length ? (
                <View style={{ marginRight: 10 }}>
                  {filterButton(display, "instruments", setDisplay)}
                </View>
              ) : null
            ) : postInstruments.length ? (
              <View style={{ marginRight: 10 }}>
                {filterButton(display, "instruments", setDisplay)}
              </View>
            ) : null}
            {contentDisplay === "users"
              ? accountGenres.length
                ? filterButton(display, "genres", setDisplay)
                : null
              : postGenres.length
              ? filterButton(display, "genres", setDisplay)
              : null}
          </View>
        </View>
        <ScrollView
          horizontal={true}
          style={{ marginBottom: 5, marginLeft: 5 }}
        >
          {display === "instruments"
            ? contentDisplay === "users"
              ? accountInstruments.map((inst, i) =>
                  renderMusicItem(inst, instrumentFunc, selectedInstruments)
                )
              : postInstruments.map((inst, i) =>
                  renderMusicItem(inst, instrumentFunc, selectedInstruments)
                )
            : contentDisplay === "users"
            ? accountGenres.map((inst, i) =>
                renderMusicItem(inst, genreFunc, selectedGenres)
              )
            : postGenres.map((inst, i) =>
                renderMusicItem(inst, genreFunc, selectedGenres)
              )}
        </ScrollView>
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        display: "flex",
        top: responsiveSizes[height].discoverEventFilterMargin,
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
