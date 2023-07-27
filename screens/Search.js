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
import { Avatar } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../constants/index";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import { responsiveSizes } from "../constants/reusableFunctions";
const { width, height } = Dimensions.get("window");

const Search = ({ navigation, currentUser }) => {
  const [searching, setSearching] = useState("");
  const [result, setResult] = useState([]);
  const [searchingFor, setSearchingFor] = useState("users");
  const [loading, setLoading] = useState(false);
  const [instruments, setInstruments] = useState([]);
  const [postInstruments, setPostInstruments] = useState([]);
  const [postGenres, setPostGenres] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [bandCount, setBandCount] = useState(0);
  const [accountInstruments, setAccountInstruments] = useState([]);
  const [accountGenres, setAccountGenres] = useState([]);
  const [genres, setGenres] = useState([]);
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
        setPostCount(resp.post_count);
        setUserCount(resp.user_count);
        setBandCount(resp.band_count);
        // let genreMapped = resp.genres.map((genre) => ({
        //   name: genre.name,
        //   id: genre.id,
        // }));
        // setGenres(genreMapped);
        // let mapped = resp.instruments.map((inst) => ({
        //   name: inst.name,
        //   id: inst.id,
        // }));
        // setInstruments(mapped);
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
            let filtered = resp?.filter((user) => user.id !== currentUser.id);
            setResult(filtered);
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
    setSelectedInstruments([]);
    setSelectedGenres([]);
    setResult([]);
    setDisplayNotFound("");
    setSearching("");
  };
  const emptyResults = () => {
    setResult([]);
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
      setResult(updatedResult);
    } else if (searchingFor == "bands") {
      let updatedResult = result.filter((band) => {
        return (
          band.genres.some((genr) => nameGenres.includes(genr.name)) ||
          band.instruments.some((inst) => nameInstruments.includes(inst.name))
        );
      });
      setResult(updatedResult);
    } else {
      let updatedPosts = result.filter((post) => {
        return (
          post.instruments.some((inst) =>
            nameInstruments.includes(inst.name)
          ) || nameGenres.includes(post.genre.name)
        );
      });
      setResult(updatedPosts);
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
    const optionButton = (name) => {
      return (
        <TouchableOpacity
          style={styles.filterItem}
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
        {optionButton(`${postCount} posts`)}
        {optionButton(`${bandCount} bands`)}
        {optionButton(`${userCount} users`)}
        {optionButton("songs")}
        {optionButton("artists")}
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
            <Text style={responsiveSizes[height].sectionTitle}>
              instruments
            </Text>
            <ScrollView horizontal={true}>
              {musicInstruments.map((inst, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.filterItem}
                  onPress={() => selectInstrument(inst)}
                >
                  <Text
                    style={
                      selectedInstruments.includes(inst)
                        ? styles.selectedItemWriting
                        : styles.itemWriting
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
            <Text style={responsiveSizes[height].sectionTitle}>genres</Text>
            <ScrollView horizontal={true}>
              {musicGenres.map((genr, i) => (
                <TouchableOpacity
                  style={styles.filterItem}
                  key={i}
                  onPress={() => selectGenre(genr)}
                >
                  <Text
                    style={
                      selectedGenres.includes(genr)
                        ? styles.selectedItemWriting
                        : styles.itemWriting
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

        {loading ? (
          <ActivityIndicator
            style={{ position: "absolute", right: 10, top: 5 }}
            size={"large"}
          />
        ) : searching.length ? (
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
          fontWeight: "500",
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
              source={{
                uri:
                  searchingFor === "users"
                    ? item.avatar
                    : searchingFor === "bands"
                    ? item.picture
                    : item.thumbnail,
              }}
              size={width / 4}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView>
        {searchingFor !== "posts" ? renderInputSection() : null}
        {dataLoading ? (
          <ActivityIndicator
            color="gray"
            size="large"
            style={{ marginTop: 10 }}
          />
        ) : null}
        {renderMusicFilters()}
        {(result.length && searchingFor === "posts") ||
        searchingFor === "users" ||
        searchingFor === "bands"
          ? renderPostResults()
          : null}
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
  filterItem: {
    height: "auto",
    width: "auto",
    padding: 5,
    marginRight: 4,
  },
  itemWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
    textAlign: "center",
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },
  selectedItemWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
    textAlign: "center",
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "#9370DB",
    borderRadius: 10,
    padding: 5,
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
});

export default connect(mapStateToProps)(Search);
