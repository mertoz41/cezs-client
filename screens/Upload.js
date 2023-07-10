import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import Toast from "react-native-toast-message";
import { AntDesign } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";
import { CommonActions } from "@react-navigation/native";
import { connect } from "react-redux";
import { ListItem, Avatar } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditHeader from "../components/reusables/Header";
import { API_ROOT } from "../constants/index";
import { responsiveSizes } from "../constants/reusableFunctions";
const { width, height } = Dimensions.get("window");

const Upload = ({ navigation, currentUser, recordedVideo }) => {
  const [description, setDescription] = useState("");
  const [songResults, setSongResults] = useState([]);
  const [songSearch, setSongSearch] = useState("");
  const [artistSearch, setArtistSearch] = useState("");
  const [artistResults, setArtistResults] = useState([]);
  const [searching, setSearching] = useState("");
  const [result, setResult] = useState([]);
  const [genreSearching, setGenreSearching] = useState("");
  const [genreResult, setGenreResult] = useState([]);
  const [allInstruments, setAllInstruments] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    generateThumbnail();
    getInstrumentsGenres();
    setAuthor(currentUser);
  }, []);
  const getInstrumentsGenres = async () => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/instrumentsgenres`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setAllGenres(resp.genres);
        setAllInstruments(resp.instruments);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        recordedVideo.uri,
        {
          time: 150,
        }
      );
      setThumbnail(uri);
    } catch (e) {
      console.warn(e);
    }
  };
  const toTimeline = () => {
    navigation.dispatch((state) => {
      // Remove the home route from the stack
      const routes = state.routes.filter((r) => r.name !== "Upload");

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
    navigation.navigate("Social", { newPost: true });
  };
  const backTo = () => {
    navigation.goBack();
  };

  const selectSong = (type, item) => {
    if (type === "song") {
      setSongSearch(item.name);
      setArtistSearch(item.artist_name);
      setSongResults([]);
    } else {
      setArtistSearch(item.name);
      setArtistResults([]);
    }
  };
  const renderSongSection = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>song</Text>
          </View>
          <View style={{ flex: 5 }}>
            <TextInput
              returnKeyType="search"
              placeholder={`search songs`}
              placeholderTextColor="gray"
              value={songSearch}
              autoCapitalize="none"
              keyboardType="default"
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "white",
                fontWeight: "300",
              }}
              onChangeText={(text) => setSongSearch(text)}
              onSubmitEditing={() =>
                searchMusic("song", songSearch.trim().toLocaleLowerCase())
              }
            />
            {loading ? (
              <ActivityIndicator
                size={"small"}
                style={{ position: "absolute", right: 5, top: 0 }}
                color="gray"
              />
            ) : null}

            {songResults?.length ? (
              <ScrollView
                keyboardShouldPersistTaps={"always"}
                style={{
                  borderTopWidth: "1px",
                  borderTopColor: "#9370DB",
                  height: 200,
                }}
              >
                {songResults.map((item, index) => (
                  <ListItem
                    key={index}
                    bottomDivider
                    onPress={() => selectSong("song", item)}
                    containerStyle={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <ListItem.Content
                      style={{
                        alignItems: "flex-end",
                      }}
                    >
                      <ListItem.Title
                        style={{
                          color: "white",
                          fontSize: 22,
                        }}
                      >
                        {item.name}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{ color: "darkgray", fontSize: 22 }}
                      >
                        {item.artist_name}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </View>
    );
  };
  const searchMusic = async (type, searching) => {
    setLoading(true);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/${type}search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ searching: searching }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (type === "song") {
          setSongResults(resp.songs);
        } else {
          setArtistResults(resp.artists);
        }
        setLoading(false);
      });
  };

  const renderArtistSection = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>artist</Text>
          </View>
          <View style={{ flex: 5 }}>
            <TextInput
              returnKeyType="search"
              placeholder={`search artists`}
              placeholderTextColor="gray"
              value={artistSearch}
              autoCapitalize="none"
              keyboardType="default"
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "white",
                fontWeight: "300",
              }}
              onChangeText={(text) => setArtistSearch(text)}
              onSubmitEditing={() =>
                searchMusic("artist", artistSearch.trim().toLocaleLowerCase())
              }
            />
            {loading ? (
              <ActivityIndicator
                size={"small"}
                style={{ position: "absolute", right: 5, top: 0 }}
                color="gray"
              />
            ) : null}

            {artistResults?.length ? (
              <ScrollView
                style={{
                  borderTopWidth: "1px",
                  borderTopColor: "#9370DB",
                  height: 200,
                }}
              >
                {artistResults.map((item, index) => (
                  <ListItem
                    key={index}
                    bottomDivider
                    onPress={() => selectSong("artist", item)}
                    containerStyle={{
                      backgroundColor: "transparent",
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
        </View>
      </View>
    );
  };
  const renderInstrumentSection = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>
              instruments
            </Text>
          </View>
          <View style={{ flex: 5, marginBottom: 5 }}>
            <View>
              <TextInput
                multiline
                placeholder={`search instrument`}
                placeholderTextColor="gray"
                value={searching}
                autoCapitalize="none"
                style={{
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                  color: "white",
                  fontWeight: "300",
                }}
                onChangeText={(text) =>
                  searchMusicItem(setSearching, allInstruments, text, setResult)
                }
              />
              {searching.length >= 3 ? (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 0,
                    borderRadius: "50%",
                    zIndex: 1,
                  }}
                  onPress={() => selectNewInstrument({ name: searching })}
                >
                  <AntDesign name="plus" size={27} color="gray" />
                </TouchableOpacity>
              ) : null}
            </View>

            {result?.length ? (
              <ScrollView
                keyboardShouldPersistTaps={"always"}
                style={{
                  borderTopWidth: "1px",
                  borderTopColor: "#9370DB",
                  height: 200,
                }}
              >
                {result.map((item, index) => (
                  <ListItem
                    key={index}
                    bottomDivider
                    onPress={() => selectNewInstrument(item)}
                    containerStyle={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <ListItem.Content>
                      <ListItem.Title
                        style={{
                          color: "white",
                          fontSize: responsiveSizes[height].sliderItemFontSize,
                        }}
                      >
                        {item.name}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>
        <ScrollView horizontal={true} keyboardShouldPersistTaps={"always"}>
          {instruments.map((inst, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => deleteInstrument(inst)}
            >
              <Text
                style={{
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                  color: "white",
                  textAlign: "center",
                  borderWidth: responsiveSizes[height].borderWidth,
                  borderColor: "gray",
                  borderRadius: 10,
                  padding: 5,
                  marginLeft: 5,
                }}
              >
                {inst.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  const renderGenreSection = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>genre</Text>
          </View>
          <View style={{ flex: 5, marginBottom: 5 }}>
            {selectedGenre ? (
              <ScrollView horizontal={true}>
                <TouchableOpacity onPress={() => setSelectedGenre(null)}>
                  <Text
                    style={{
                      fontSize: responsiveSizes[height].sliderItemFontSize,
                      color: "white",
                      textAlign: "center",
                      borderWidth: responsiveSizes[height].borderWidth,
                      borderColor: "gray",
                      borderRadius: 10,
                      padding: 5,
                    }}
                  >
                    {selectedGenre.name}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <View>
                <TextInput
                  multiline
                  placeholder={`search genre`}
                  placeholderTextColor="gray"
                  value={genreSearching}
                  autoCapitalize="none"
                  style={{
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    color: "white",
                    fontWeight: "300",
                  }}
                  onChangeText={(text) =>
                    searchMusicItem(
                      setGenreSearching,
                      allGenres,
                      text,
                      setGenreResult
                    )
                  }
                />
                {genreSearching.length >= 3 ? (
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 0,
                      borderRadius: "50%",
                      zIndex: 1,
                    }}
                    onPress={() => selectGenre({ name: genreSearching })}
                  >
                    <AntDesign name="plus" size={27} color="gray" />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
            {genreResult?.length ? (
              <ScrollView
                keyboardShouldPersistTaps={"always"}
                style={{
                  borderTopWidth: "1px",
                  borderTopColor: "#9370DB",
                  height: 200,
                }}
              >
                {genreResult.map((item, index) => (
                  <ListItem
                    key={index}
                    bottomDivider
                    onPress={() => selectGenre(item)}
                    containerStyle={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <ListItem.Content>
                      <ListItem.Title
                        style={{
                          color: "white",
                          fontSize: responsiveSizes[height].sliderItemFontSize,
                        }}
                      >
                        {item.name}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const renderAuthorSection = () => {
    let combined = [...currentUser.bands, currentUser];
    return (
      <View
        style={{
          marginBottom: 0,
          borderBottomWidth: 1,
          borderBottomColor: "gray",
          marginTop: 10,
          height: "auto",
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={responsiveSizes[height].sectionTitle}>author</Text>
        </View>
        <ScrollView style={{ marginTop: 10 }} horizontal={true}>
          {combined.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.instrumentItem}
                key={index}
                onPress={() => setAuthor(item)}
              >
                <Avatar
                  source={{ uri: item.picture ? item.picture : item.avatar }}
                  size={responsiveSizes[height].bandMemberAvatar}
                  avatarStyle={{ borderRadius: 10, alignSelf: "center" }}
                />

                <Text
                  style={{
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    color: "white",
                    textAlign: "center",
                    borderWidth: responsiveSizes[height].borderWidth,
                    borderColor: author === item ? "#9370DB" : "gray",
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  {item.username ? item.username : item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const selectNewInstrument = (item) => {
    setInstruments([...instruments, item]);
    setSearching("");
    setResult([]);
  };
  const selectGenre = (item) => {
    setSelectedGenre(item);
    setGenreSearching("");
    setGenreResult([]);
  };

  const deleteInstrument = (item) => {
    let filtered = instruments.filter((itm) => itm.id !== item.id);
    setInstruments(filtered);
  };

  const searchMusicItem = (setAction, options, text, setResult) => {
    setAction(text);
    let filtered = options.filter((item) => item.name.includes(text));
    setResult(filtered);
  };

  const checkPostButton = () => {
    if (selectedGenre && instruments.length) {
      return true;
    }
    return false;
  };

  const postVideo = async () => {
    setUploading(true);
    let token = await AsyncStorage.getItem("jwt");

    let splitted = recordedVideo.uri.split(".");
    let fileEnding = splitted[splitted.length - 1];
    let timeline = timeline;
    let formData = new FormData();
    formData.append("clip", {
      uri: recordedVideo.uri,
      type: `${recordedVideo.type}/${fileEnding}`,
      name: `upload.${fileEnding}`,
    });
    let thumbnailSplit = thumbnail.split(".");
    let thumbnailEnding = thumbnailSplit[thumbnailSplit.length - 1];
    formData.append("thumbnail", {
      uri: thumbnail,
      type: `image/${thumbnailEnding}`,
      name: `upload.${thumbnailEnding}`,
    });
    let namedInstruments = instruments.map((inst) => inst.name);
    if (songSearch.length) {
      formData.append("song_name", songSearch.trim());
    }
    if (artistSearch.length) {
      formData.append("artist_name", artistSearch.trim());
    }
    formData.append("description", description);
    formData.append("instruments", JSON.stringify(namedInstruments));
    formData.append("genre", selectedGenre.name.trim());
    if (author.username) {
      formData.append("user_id", currentUser.id);
    } else {
      formData.append("band_id", author.id);
    }
    formData.append("description", description);

    await axios
      .post(`http://${API_ROOT}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          let prog = event.loaded / event.total;
          setLoadPercent((prog * 100).toFixed());
        },
      })
      .then((resp) => {
        toTimeline();
        setUploading(false);
      })
      .catch((err) => alert(err));
  };

  const renderVideoSection = () => {
    const handleVideoPlay = (vid) => {
      if (videoPlaying) {
        vid.current.pauseAsync();
        setVideoPlaying(false);
      } else {
        vid.current.playAsync();
        setVideoPlaying(true);
      }
    };
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleVideoPlay(videoRef)}
      >
        <Video
          source={{ uri: recordedVideo.uri }}
          shouldPlay={true}
          rate={1.0}
          ref={videoRef}
          volume={1}
          isMuted={false}
          resizeMode={"cover"}
          isLooping={true}
          style={{
            height: responsiveSizes[height].postItemVideo,
            width: width,
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderDescriptionSection = () => {
    const checkCharacter = (text) => {
      if (text.length >= 101) {
        return;
      }
      setDescription(text);
    };
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>
              description
            </Text>
          </View>
          <View style={{ flex: 5, justifyContent: "flex-start" }}>
            <TextInput
              multiline
              placeholder={`enter description`}
              placeholderTextColor="gray"
              value={description}
              autoCapitalize="none"
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "white",
                fontWeight: "300",
                marginBottom: 5,
              }}
              onChangeText={(text) => checkCharacter(text)}
            />

            <Text
              style={{
                position: "absolute",
                color: "white",
                right: 0,
                backgroundColor: "rgba(46,46,46, .6)",
              }}
            >
              {description?.length}/100
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <EditHeader
        title={uploading ? "uploading" : "upload"}
        goBack={backTo}
        actionLabel="post"
        loading={uploading}
        displayAction={checkPostButton()}
        action={postVideo}
      />
      {uploading ? (
        <View
          style={{
            height: 40,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              backgroundColor: "#9370DB",
              height: 40,
              width: `${loadPercent}%`,
              position: "absolute",
            }}
          ></View>
          <Text
            style={{
              fontSize: 24,
              position: "absolute",
              right: 0,
              fontWeight: "bold",
              marginRight: 10,
              color: "white",
              textAlign: "right",
            }}
          >
            {loadPercent}%
          </Text>
        </View>
      ) : (
        <ScrollView keyboardShouldPersistTaps={"always"}>
          {renderSongSection()}
          {renderArtistSection()}
          {renderDescriptionSection()}
          {renderGenreSection()}
          {renderInstrumentSection()}
          {currentUser.bands.length ? renderAuthorSection() : null}
          {renderVideoSection()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#2e2e2e",
  },

  instrumentItem: {
    padding: 5,
    alignItems: "center",
    marginRight: 4,
  },
  section: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    // margin: 10,
    marginVertical: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
  },
});

const mapStateToProps = (state) => ({
  recordedVideo: state.recordedVideo,
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(Upload);
