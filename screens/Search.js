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
import Avatar from "../components/reusables/Avatar";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../constants/index";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import { responsiveSizes } from "../constants/reusableFunctions";
const { width, height } = Dimensions.get("window");
const Search = ({ navigation, loggedIn, currentUser }) => {
  const [searching, setSearching] = useState("");
  const [result, setResult] = useState([]);
  const [searchingFor, setSearchingFor] = useState("posts");
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
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [displayNotFound, setDisplayNotFound] = useState("");
  const [artistViews, setArtistViews] = useState([]);
  const [songViews, setSongViews] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [artistPosts, setArtistPosts] = useState([]);
  const [songPosts, setSongPosts] = useState([]);

  useEffect(() => {
    setDataLoading(true);
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
        setResult(resp.last_posts);
        setArtistViews(resp.artist_views);
        setSongViews(resp.song_views);
        setArtistPosts(resp.artist_posts);
        setSongPosts(resp.song_posts);
        setDataLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
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

  const fetchMusicContent = async () => {
    let token = await AsyncStorage.getItem("jwt");
    let searchType = searchName();
    fetch(`http://${API_ROOT}/${searchType}search`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ searching: searching }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (searchType === "artist") {
          if (resp.artists.length) {
            setResult(resp.artists);
          } else {
            setDisplayNotFound(`Couldn't find '${searching}'`);
          }
        } else {
          if (resp.songs.length) {
            setResult(resp.songs);
          } else {
            setDisplayNotFound(`Couldn't find '${searching}'`);
          }
        }
        setLoading(false);
      });
  };

  const fetchAccounts = async (type) => {
    setLoading(true);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/${type}search`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ searching: searching }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (!resp.length) {
          setResult([]);
          setDisplayNotFound(`Couldn't find '${searching}'`);
        } else {
          if (type === "user") {
            // let filtered = resp?.filter((user) => user.id !== currentUser.id);
            setResult(resp);
          } else {
            setResult(resp.bands);
          }
        }
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
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

  const selection = (item) => {
    if (searchingFor == "users") {
      toUserPage(item);
    } else if (searchingFor == "artists") {
      navigation.navigate("Artist", item);
    } else if (searchingFor == "songs") {
      navigation.navigate("Song", item);
    } else if (searchingFor == "bands") {
      toBandPage(item);
    } else if (searchingFor == "albums") {
      navigation.navigate("Album", item);
    }
    emptyResults();
  };
  const toBandPage = (item) => {
    // check to see if user is in this band, if so send it to userband
    let thatBand = { bandname: item.name, picture: item.picture, id: item.id };
    navigation.navigate("Band", thatBand);
    emptyResults();
  };

  const toArtistPage = (item) => {
    navigation.navigate("Artist", item);
    emptyResults();
  };
  const toUserPage = (item) => {
    let user = { username: item.username, avatar: item.avatar, id: item.id };
    navigation.navigate("User", user);
    emptyResults();
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
    setSelectedInstruments([]);
    setSelectedGenres([]);
    setDisplayNotFound("");
    setSearching("");
  };
  const emptyResults = () => {
    // setResult([]);
    setSearching("");
    setDisplayNotFound("");
    setLoading(false);
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

  const selectGenre = (genr) => {
    let found = selectedGenres.find((genre) => genre.id === genr.id);
    if (found) {
      let filtered = selectedGenres.filter((genre) => genre.id !== genr.id);
      setSelectedGenres(filtered);
      updateResult(filtered, selectedInstruments);
    } else {
      let updated = [...selectedGenres, genr];
      setSelectedGenres(updated);
      getFilterSearch(updated, selectedInstruments);
    }
  };
  const selectInstrument = (inst) => {
    let found = selectedInstruments.find(
      (instrument) => instrument.id === inst.id
    );
    if (found) {
      let filtered = selectedInstruments.filter(
        (instru) => instru.id !== inst.id
      );
      setSelectedInstruments(filtered);

      updateResult(selectedGenres, filtered);
    } else {
      let updated = [...selectedInstruments, inst];
      setSelectedInstruments(updated);
      getFilterSearch(selectedGenres, updated);
    }
  };

  const updateResult = (genres, instruments) => {
    let nameInstruments = instruments.map((inst) => inst.name);
    let nameGenres = genres.map((genr) => genr.name);
    if (searchingFor == "users") {
      let updatedResult = result.filter((person) => {
        return (
          person.instruments.some((inst) =>
            nameInstruments.includes(inst.name)
          ) || person.genres.some((genr) => nameGenres.includes(genr.name))
        );
      });
      setResult(updatedResult.length ? updatedResult : lateUsers);
    } else if (searchingFor == "bands") {
      let updatedResult = result.filter((band) => {
        return (
          band.genres.some((genr) => nameGenres.includes(genr.name)) ||
          band.instruments.some((inst) => nameInstruments.includes(inst.name))
        );
      });
      setResult(updatedResult.length ? updatedResult : lateBands);
    } else {
      let updatedPosts = result.filter((post) => {
        return (
          post.instruments.some((inst) =>
            nameInstruments.includes(inst.name)
          ) || nameGenres.includes(post.genre.name)
        );
      });
      setResult(updatedPosts.length ? updatedPosts : latePosts);
    }
  };
  const getFilterSearch = async (genres, instruments) => {
    setLoading(true);
    let genreIds = genres.map((genr) => genr.id);
    let instrumentIds = instruments.map((inst) => inst.id);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/${searchingFor}filtersearch`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ genres: genreIds, instruments: instrumentIds }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setResult(sortPosts(resp));
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const sortPosts = (arr) => {
    let sorted = arr.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return sorted;
  };

  const renderMostSection = (views, posts, toPage) => {
    return (
      <View style={{ marginTop: 0 }}>
        <Text style={responsiveSizes[height].sectionTitle}>most views</Text>
        {views.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.exploreItem}
            onPress={() => toPage(item)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.primaryText}>{item.name} </Text>
              {item.artist_name && (
                <Text style={styles.secondaryText}>/ {item.artist_name}</Text>
              )}
            </View>
            <Text
              style={{
                color: "#9370DB",
                fontSize: responsiveSizes[height].sliderItemFontSize,
                fontWeight: "bold",
                marginLeft: 5,
              }}
            >
              {item.view_count}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={responsiveSizes[height].sectionTitle}>most posts</Text>
        {posts.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.exploreItem}
            onPress={() => toPage(item)}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.primaryText}>{item.name} </Text>
              {item.artist_name && (
                <Text style={styles.secondaryText}>/ {item.artist_name}</Text>
              )}
            </View>
            <Text
              style={{
                color: "#9370DB",
                fontSize: responsiveSizes[height].slider,
                fontWeight: "bold",
                marginLeft: 5,
              }}
            >
              {item.post_count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderHeader = () => {
    const optionButton = (name, count) => {
      return (
        <TouchableOpacity
          style={
            searchingFor === name
              ? styles.selectedFilterItem
              : styles.filterItem
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
    return (
      <View
        style={{
          height: responsiveSizes[height].header,
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {optionButton(`posts`, postCount)}
        {optionButton(`bands`, bandCount)}
        {optionButton(`users`, userCount)}
        {optionButton("songs", songCount)}
        {optionButton("artists", artistCount)}
      </View>
    );
  };
  const renderMusicFilters = () => {
    let musicInstruments;
    let musicGenres;
    switch (searchingFor) {
      case "users":
        musicInstruments = accountInstruments;
        musicGenres = accountGenres;
        break;
      case "bands":
        musicInstruments = accountInstruments;
        musicGenres = accountGenres;
        break;
      case "posts":
        musicInstruments = postInstruments;
        musicGenres = postGenres;
        break;
    }

    return (
      <View style={{ marginTop: 0 }}>
        {musicInstruments?.length ? (
          <View>
            <View style={{ marginTop: 5 }}>
              <Text style={responsiveSizes[height].sectionTitle}>
                instruments
              </Text>
            </View>
            <ScrollView horizontal={true}>
              {musicInstruments.map((inst, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    height: "auto",
                    width: "auto",
                    marginLeft: 10,

                    borderColor: selectedInstruments.includes(inst)
                      ? "#9370DB"
                      : "gray",
                    borderRadius: 10,
                    borderWidth: responsiveSizes[height].borderWidth,
                    paddingHorizontal: 4,
                  }}
                  onPress={() => selectInstrument(inst)}
                >
                  <Text
                    style={
                      selectedInstruments.includes(inst)
                        ? {
                            fontSize: 22,
                            fontWeight: "300",
                            color: "#9370DB",
                          }
                        : {
                            fontSize: 22,
                            fontWeight: "300",
                            color: "silver",
                          }
                    }
                  >
                    {inst.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}
        {musicGenres?.length ? (
          <View>
            <View style={{ marginTop: 5 }}>
              <Text style={responsiveSizes[height].sectionTitle}>genres</Text>
            </View>
            <ScrollView horizontal={true}>
              {musicGenres.map((genr, i) => (
                <TouchableOpacity
                  style={{
                    height: "auto",
                    width: "auto",
                    marginLeft: 10,

                    borderColor: selectedGenres.includes(genr)
                      ? "#9370DB"
                      : "gray",
                    borderRadius: 10,
                    borderWidth: responsiveSizes[height].borderWidth,
                    paddingHorizontal: 4,
                  }}
                  key={i}
                  onPress={() => selectGenre(genr)}
                >
                  <Text
                    style={
                      selectedGenres.includes(genr)
                        ? {
                            fontSize: 22,
                            fontWeight: "300",
                            color: "#9370DB",
                          }
                        : {
                            fontSize: 22,
                            fontWeight: "300",
                            color: "silver",
                          }
                    }
                  >
                    {genr.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
    );
  };

  const renderMusicResult = (musicResult, action) => {
    return musicResult.map((item) => (
      <TouchableOpacity
        onPress={() => action(item)}
        key={item.id}
        style={{
          borderBottomWidth: responsiveSizes[height].borderWidth,
          borderBottomColor: "gray",
          margin: 10,
          paddingVertical: 10,
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: responsiveSizes[height].screenTitle,
            color: "white",
          }}
        >
          {item.name}
        </Text>
        {item.artist_name ? (
          <Text
            style={{
              fontSize: responsiveSizes[height].screenTitle,
              color: "gray",
            }}
          >
            {" "}
            <Text
              style={{
                fontSize: responsiveSizes[height].screenTitle,
                color: "#9370DB",
              }}
            >
              /
            </Text>{" "}
            {item.artist_name}
          </Text>
        ) : null}
      </TouchableOpacity>
    ));
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

  const renderNotFoundMessage = () => {
    return (
      <Text
        style={{
          fontSize: responsiveSizes[height].screenTitle,
          color: "red",
          textAlign: "center",
          margin: 10,
          fontWeight: "300",
          width: "100%",
        }}
      >
        {displayNotFound}.
      </Text>
    );
  };
  const renderPostResults = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          height: "auto",
        }}
      >
        {displayNotFound ? renderNotFoundMessage() : null}
        {result.map((item, index) => (
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
              avatar={
                searchingFor === "users"
                  ? item.avatar
                  : searchingFor === "bands"
                  ? item.picture
                  : item.thumbnail
              }
              size={width / 4}
              withRadius={false}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* <SearchFilters /> */}
      {/* <SearchResults /> */}

      {renderHeader()}
      {renderMusicFilters()}
      {searchingFor !== "posts" ? renderInputSection() : null}

      <ScrollView>
        {dataLoading ? (
          <ActivityIndicator
            color="gray"
            size="large"
            style={{ marginTop: 10 }}
          />
        ) : null}

        {searchingFor === "posts" ||
        searchingFor === "users" ||
        searchingFor === "bands" ? (
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={responsiveSizes[height].sectionTitle}>
                {selectedInstruments.length || selectedGenres.length
                  ? "result"
                  : "most recent"}
              </Text>
              {loading ? (
                <ActivityIndicator style={{ marginRight: 10 }} size={"small"} />
              ) : null}
            </View>
            {renderPostResults()}
          </View>
        ) : null}
        {searchingFor === "artists"
          ? displayNotFound
            ? renderNotFoundMessage()
            : result.length
            ? renderMusicResult(result, toArtistPage)
            : renderMostSection(artistViews, artistPosts, toArtistPage)
          : null}
        {searchingFor === "songs"
          ? displayNotFound
            ? renderNotFoundMessage()
            : result.length
            ? renderMusicResult(result, selection)
            : renderMostSection(songViews, songPosts, selection)
          : null}
      </ScrollView>
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
    fontWeight: "300",
    color: "silver",
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
const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  loggedIn: state.loggedIn,
});

export default connect(mapStateToProps)(Search);

//
