import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { Avatar } from "react-native-elements";
import store from "../../redux/store";
import { API_ROOT } from "../../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import SliderSection from "./SliderSection";
import Toast from "react-native-toast-message";
const { height } = Dimensions.get("window");
import { ListItem } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { responsiveSizes } from "../../constants/reusableFunctions";

const InstrumentEdit = ({
  setNewInstruments,
  newInstruments,
  setNewGenres,
  newGenres,
  setNewFavoriteArtists,
  newFavoriteArtists,
  setNewFavoriteSongs,
  newFavoriteSongs,
  currentUser,
  toNewBandPage,
  toBlockedUsers,
  setRemovedGenres,
  setRemovedInstruments,
}) => {
  const [searching, setSearching] = useState("");
  const [result, setResult] = useState([]);

  const [songSearch, setSongSearch] = useState("");
  const [songResult, setSongResult] = useState([]);

  const [songArtistSearch, setSongArtistSearch] = useState("");
  const [songArtistResult, setSongArtistResult] = useState([]);

  const [artistSearch, setArtistSearch] = useState("");
  const [artistResult, setArtistResult] = useState([]);

  const [genreSearching, setGenreSearching] = useState("");
  const [genreResult, setGenreResult] = useState([]);
  const searchInstruments = async (text) => {
    setSearching(text);
    let token = await AsyncStorage.getItem("jwt");
    if (text.length) {
      fetch(`http://${API_ROOT}/instrumentsearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searching: text }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setResult(resp.instruments);
        })
        .catch((err) => console.log(err));
    }
  };

  const removeGenre = async (genre) => {
    // let token = await AsyncStorage.getItem("jwt");
    let filteredGenres = newGenres.filter((genr) => genr.id !== genre.id);
    setNewGenres(filteredGenres);
    setRemovedGenres((prevState) => [...prevState, genre.id]);
    // let updatedCurrentUser = { ...currentUser, genres: filteredGenres };
    // store.dispatch({
    //   type: "UPDATE_CURRENT_USER",
    //   currentUser: updatedCurrentUser,
    // });
    // let obj = {
    //   user_id: currentUser.id,
    //   genre_id: genre.id,
    // };
    // fetch(`http://${API_ROOT}/deleteusergenre`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(obj),
    // })
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     showToast(genre.name);
    //   })
    //   .catch((err) => console.log(err));
  };

  const deleteInstrument = async (inst) => {
    // let token = await AsyncStorage.getItem("jwt");
    let filteredInstruments = newInstruments.filter(
      (instru) => instru.id !== inst.id
    );
    setNewInstruments(filteredInstruments);
    setRemovedInstruments((prevState) => [...prevState, inst.id]);
    // let updatedCurrentUser = {
    //   ...currentUser,
    //   instruments: filteredInstruments,
    // };
    // store.dispatch({
    //   type: "UPDATE_CURRENT_USER",
    //   currentUser: updatedCurrentUser,
    // });

    // let obj = {
    //   user_id: currentUser.id,
    //   instrument_id: inst.id,
    // };
    // fetch(`http://${API_ROOT}/deleteuserinstrument`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(obj),
    // })
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     showToast(inst.name);
    //   })
    //   .catch((err) => console.log(err));
  };

  const showToast = (name) => {
    Toast.show({
      type: "success",
      text1: "success",
      text2: `${name} is deleted`,
    });
  };
  const searchGenres = async (text) => {
    setGenreSearching(text);
    if (text.length) {
      let token = await AsyncStorage.getItem("jwt");

      fetch(`http://${API_ROOT}/genresearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searching: text }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setGenreResult(resp.genres);
        })
        .catch((err) => console.log(err));
    }
  };

  const selectNewInstrument = (item) => {
    setNewInstruments([...newInstruments, item]);
    setSearching("");
    setResult([]);
  };
  const selectNewGenre = (item) => {
    setNewGenres([...newGenres, item]);
    setGenreSearching("");
    setGenreResult([]);
  };

  const selectArtist = (item) => {
    setNewFavoriteArtists([...newFavoriteArtists, item]);
    setArtistSearch("");
    setArtistResult([]);
  };

  const selectSong = (item) => {
    setSongArtistSearch(item.artist_name);
    setSongSearch(item.name);
    setSongResult([]);
  };

  const searchArtists = async (text, forSong) => {
    if (forSong) {
      setSongArtistSearch(text);
    } else {
      setArtistSearch(text);
    }
    if (text.length) {
      let token = await AsyncStorage.getItem("jwt");
      fetch(`http://${API_ROOT}/artistsearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searching: text }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          if (forSong) {
            setSongArtistResult(resp.artists);
          } else {
            setArtistResult(resp.artists);
          }
        });
    }
  };
  const searchSongs = async (text) => {
    setSongSearch(text);
    if (text.length) {
      let token = await AsyncStorage.getItem("jwt");
      fetch(`http://${API_ROOT}/songsearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searching: text }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setSongResult(resp.songs);
        });
    }
  };
  const clearInstrumentResult = () => {
    // setResult([]);
  };
  const clearGenreResult = () => {
    // setGenreResult([]);
  };
  const renderBands = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>bands</Text>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: responsiveSizes[height].borderWidth,
              borderColor: "gray",
              borderRadius: 10,
              marginRight: 10,
              marginTop: 5,
            }}
            onPress={() => toNewBandPage()}
          >
            <Text
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "white",
                fontWeight: "300",
                padding: 5,
              }}
            >
              new
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ marginTop: 10 }} horizontal={true}>
          {currentUser.bands.map((item, index) => {
            return (
              <TouchableOpacity style={styles.instrumentItem} key={index}>
                {item.picture && (
                  <Avatar
                    source={{ uri: item.picture }}
                    size={100}
                    avatarStyle={{ borderRadius: 10 }}
                  />
                )}
                <Text
                  style={{
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    color: "white",
                    textAlign: "center",
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderBlockedUsers = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>
              blocked users
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toBlockedUsers()}
            style={{
              borderWidth: responsiveSizes[height].borderWidth,
              borderColor: "gray",
              borderRadius: 10,
              marginRight: 10,
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "white",
                fontWeight: "300",
                padding: 5,
              }}
            >
              {currentUser.blocked_account_count}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const selectSongArtist = (item) => {
    setSongArtistSearch(item);
    setSongArtistResult([]);
  };
  const addNewSong = (newSong) => {
    setNewFavoriteSongs([...newFavoriteSongs, newSong]);
    setSongArtistSearch("");
    setSongSearch("");
  };

  const deleteFavArtist = async (item) => {
    let token = await AsyncStorage.getItem("jwt");

    fetch(`http://${API_ROOT}/deleteuserartist`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ artist_id: item.id }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let filtered = [...newFavoriteArtists].filter(
          (artis) => artis.id !== item.id
        );
        let updatedCurrentUser = { ...currentUser, favoriteartists: filtered };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
        setNewFavoriteArtists(filtered);
      });
  };

  const deleteFavSong = async (song) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/deleteusersong`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ song_id: song.id }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let filtered = [...newFavoriteSongs].filter(
          (sng) => sng.id !== song.id
        );
        let updatedCurrentUser = { ...currentUser, favoritesongs: filtered };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
        setNewFavoriteSongs(filtered);
      });
  };
  const renderFavoriteSongsSection = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>
              favorite songs
            </Text>
          </View>
          <View style={{ flex: 2 }}>
            <TextInput
              onBlur={() => clearInstrumentResult()}
              multiline
              placeholder={`song name`}
              placeholderTextColor="gray"
              value={songSearch}
              autoCapitalize="none"
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "white",
                fontWeight: "300",
                marginBottom: 5,
              }}
              onChangeText={(text) => searchSongs(text)}
            />
            <TextInput
              onBlur={() => clearInstrumentResult()}
              multiline
              placeholder={`artist name`}
              placeholderTextColor="gray"
              value={songArtistSearch}
              autoCapitalize="none"
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "white",
                fontWeight: "300",
                marginBottom: 5,
              }}
              onChangeText={(text) => searchArtists(text, true)}
            />
            {songResult?.length || songArtistResult?.length ? (
              <ScrollView
                keyboardShouldPersistTaps={"always"}
                style={{
                  borderTopWidth: "1px",
                  borderTopColor: "#9370DB",
                  height: 200,
                }}
              >
                {songResult.map((item, index) => (
                  <ListItem
                    key={index}
                    bottomDivider
                    onPress={() => selectSong(item)}
                    containerStyle={{
                      backgroundColor: "transparent",
                      justifyContent: "center",
                    }}
                  >
                    <ListItem.Content>
                      <ListItem.Title style={{ color: "white" }}>
                        {item.name}
                      </ListItem.Title>
                      <ListItem.Title style={{ color: "gray" }}>
                        {item.artist_name}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))}
                {songArtistResult.map((item, index) => (
                  <ListItem
                    key={index}
                    bottomDivider
                    onPress={() => selectSongArtist(item.name)}
                    containerStyle={{
                      backgroundColor: "transparent",
                      justifyContent: "center",
                    }}
                  >
                    <ListItem.Content>
                      <ListItem.Title style={{ color: "white" }}>
                        {item.name}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </ScrollView>
            ) : null}
          </View>
          {songSearch.length && songArtistSearch.length ? (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 10,
                top: 5,
                borderRadius: "50%",
                zIndex: 1,
              }}
              onPress={() =>
                addNewSong({
                  name: songSearch.trim(),
                  artist_name: songArtistSearch.trim(),
                })
              }
            >
              <AntDesign name="plus" size={27} color="gray" />
            </TouchableOpacity>
          ) : null}
        </View>
        <ScrollView style={styles.instrumentsBox} horizontal={true}>
          {newFavoriteSongs.map((item, index) => {
            return (
              <TouchableOpacity
                style={{
                  borderWidth: responsiveSizes[height].borderWidth,
                  borderColor: "gray",
                  padding: 5,
                  borderRadius: 10,
                  marginRight: 4,
                  marginBottom: 5,
                  marginLeft: 10,
                }}
                key={index}
                onPress={() => deleteFavSong(item)}
              >
                <Text
                  style={{
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    color: "white",
                    textAlign: "left",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    color: "gray",
                    textAlign: "left",
                  }}
                >
                  {item.artist_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  return (
    <View>
      <SliderSection
        label="instruments"
        search={searchInstruments}
        searching={searching}
        select={selectNewInstrument}
        remove={deleteInstrument}
        selected={newInstruments}
        searchResult={result}
        clearSearchResult={clearInstrumentResult}
      />

      <SliderSection
        label="genres"
        search={searchGenres}
        searching={genreSearching}
        select={selectNewGenre}
        remove={removeGenre}
        selected={newGenres}
        searchResult={genreResult}
        clearSearchResult={clearGenreResult}
      />
      <SliderSection
        label="favorite artists"
        search={searchArtists}
        searching={artistSearch}
        select={selectArtist}
        remove={deleteFavArtist}
        selected={newFavoriteArtists}
        searchResult={artistResult}
        clearSearchResult={clearGenreResult}
      />
      {renderFavoriteSongsSection()}

      {renderBands()}
      {renderBlockedUsers()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    borderBottomWidth: 2,
    borderBottomColor: "darkgray",
    paddingBottom: 15,
    backgroundColor: "red",
  },
  instrumentItem: {
    padding: 5,
    borderRadius: 10,
    marginRight: 4,
    alignItems: "center",
  },

  section: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});
const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(InstrumentEdit);
