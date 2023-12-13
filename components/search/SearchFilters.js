import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../../constants";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import { responsiveSizes } from "../../constants/reusableFunctions";
import MusicFilters from "./MusicFilters";
const { width, height } = Dimensions.get("window");

const SearchFilters = () => {
    const [searching, setSearching] = useState("");
    const [result, setResult] = useState([]);
    const [searchingFor, setSearchingFor] = useState("users");
    const [loading, setLoading] = useState(false);
    const [postInstruments, setPostInstruments] = useState([]);
    const [postGenres, setPostGenres] = useState([]);
    const [postCount, setPostCount] = useState("#");
    const [userCount, setUserCount] = useState("#");
    const [bandCount, setBandCount] = useState("#");
    const [songCount, setSongCount] = useState("#");
    const [lateUsers, setLateUsers] = useState([]);
    const [lateBands, setLateBands] = useState([]);
    const [latePosts, setLatePosts] = useState([]);
    const [artistCount, setArtistCount] = useState("#");
    const [accountInstruments, setAccountInstruments] = useState([]);
    const [accountGenres, setAccountGenres] = useState([]);
    // const [selectedInstruments, setSelectedInstruments] = useState([]);
    // const [selectedGenres, setSelectedGenres] = useState([]);
    const [displayNotFound, setDisplayNotFound] = useState("");
    const [artistViews, setArtistViews] = useState([]);
    const [songViews, setSongViews] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [artistPosts, setArtistPosts] = useState([]);
    const [songPosts, setSongPosts] = useState([]);
  useEffect(() => {
    getExploreData();
  }, []);

  const getExploreData = async () => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/exploredata`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setPostInstruments(resp.post_instrument_filters);
        setPostGenres(resp.post_genre_filters);

        setAccountInstruments(resp.account_instrument_filters);
        setAccountGenres(resp.account_genre_filters);
        setLateBands(resp.last_bands);
        setLatePosts(resp.last_posts);
        setLateUsers(resp.last_users);
        setPostCount(resp.post_count);
        setUserCount(resp.user_count);
        setBandCount(resp.band_count);
        setSongCount(resp.song_count);
        setArtistCount(resp.artist_count);
        setResult(resp.last_users);
        setArtistViews(resp.artist_views);
        setSongViews(resp.song_views);
        setArtistPosts(resp.artist_posts);
        setSongPosts(resp.song_posts);
        setDataLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const searchCateg = (category) => {
    setSearchingFor(category);

    if (category === "artists" || category === "songs") {
      setResult([]);
    } else {
      let lateResult;
      switch (category) {
        case "posts":
          lateResult = latePosts;
          break;
        case "bands":
          lateResult = lateBands;
          break;
        case "users":
          lateResult = lateUsers;
          break;
      }
      setResult(lateResult);
    }
    // setSelectedInstruments([]);
    // setSelectedGenres([]);
    // setDisplayNotFound("");
    setSearching("");
  };
  const optionButton = (name) => {
    return (
      <TouchableOpacity
        style={
          searchingFor === name ? styles.selectedFilterItem : styles.filterItem
        }
        onPress={() => searchCateg(name)}
      >
        <Text
          style={
            searchingFor === name
              ? styles.selectedItemWriting
              : styles.itemWriting
          }
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const searchName = () => {
    if (searchingFor == "users") {
      return "user";
    } else if (searchingFor == "bands") {
      return "band";
    } else if (searchingFor == "artists") {
      return "artist";
    } else if (searchingFor == "songs") {
      return "song";
    } else if (searchingFor == "posts") {
      return "post";
    }
  };

  const fetchType = () => {
    setLoading(true);
    if (searchingFor === "users" || searchingFor === "bands") {
      fetchAccounts(searchName());
    } else if (searchingFor === "songs" || searchingFor === "artists") {
      fetchMusicContent();
    } else if (searchingFor === "posts") {
      fetchPosts();
    }
  };
  const renderInputSection = () => {
    return (
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searching}
          returnKeyType="search"
          placeholder={`search ${searchName()}s`}
          placeholderTextColor="gray"
          onChangeText={(text) => setSearching(text)}
          onSubmitEditing={() => fetchType()}
          autoCapitalize="none"
          value={searching}
        />

        {searching.length ? (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
              top: 5,
              flexDirection: "row",
            }}
            onPress={() => emptyResults()}
          >
            <MaterialIcons name="close" size={35} color="white" />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  return (
    <View>
      <View
        style={{
          height: responsiveSizes[height].header,
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {optionButton(`posts`)}
        {optionButton(`bands`)}
        {optionButton(`users`)}
        {optionButton("songs")}
        {optionButton("artists")}
      </View>
      {renderInputSection()}
      <MusicFilters />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    height: 50,
  },

  searchType: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "flex-end",
    padding: 5,
  },

  sectionItem: {
    fontSize: 22,
  },
  filterItem: {
    height: "auto",
    width: "auto",

    borderColor: "gray",
    borderRadius: 10,
    borderWidth: responsiveSizes[height].borderWidth,
    paddingHorizontal: 4,
  },
  selectedFilterItem: {
    height: "auto",
    width: "auto",

    borderColor: "#9370DB",
    borderRadius: 10,
    borderWidth: responsiveSizes[height].borderWidth,

    paddingHorizontal: 4,
  },
  itemWriting: {
    fontSize: responsiveSizes[height].searchOptionFont,
    color: "silver",
    fontWeight: "300",
  },
  selectedItemWriting: {
    fontSize: responsiveSizes[height].searchOptionFont,
    color: "#9370DB",
    fontWeight: "300",
  },

  header: {
    height: 40,
  },
  searching: {
    fontSize: 24,
    color: "white",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },

  exploreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    marginLeft: 10,
  },

  primaryText: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
  },

  secondaryText: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "gray",
  },
});

export default SearchFilters;
