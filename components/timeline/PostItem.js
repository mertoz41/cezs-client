import React, { createRef } from "react";
import { Video } from "expo-av";
import { getTiming, responsiveSizes } from "../../constants/reusableFunctions";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Avatar from "../reusables/Avatar";
import { connect } from "react-redux";
import store from "../../redux/store";
import { API_ROOT } from "../../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
import { BlurView } from "expo-blur";
import OptionsButton from "../reusables/OptionsButton";
class PostItem extends React.Component {
  constructor(props) {
    super(props);
    this.video = createRef();
    this.toolTip = createRef();
  }
  state = {
    modalVisible: false,
    playing: true,
    viewed: false,
    viewCount: this.props.item.view_count,
    applaudCount: this.props.item.applaud_count,
    showContent: false,
    videoLoading: false,
    optionType: "",
    applauded: this.props.item.applauded,
    displayReported: false,
  };

  componentDidUpdate(prevProps) {
    if (!this.props.isFocused) {
      this.video.current.pauseAsync();
    }
  }

  deleteVideo = async (item) => {
    let token = await AsyncStorage.getItem("jwt");

    fetch(`http://${API_ROOT}/posts/${item.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        this.props.updateList(item.id);
        let filteredPosts = this.props.currentUser.posts.filter(
          (post) => post.id !== item.id
        );
        let updatedCurrentUser = {
          ...this.props.currentUser,
          posts: filteredPosts,
        };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
        Toast.show({
          type: "success",
          text1: `Post is deleted.`,
        });
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  handleVideoPlay = (video) => {
    if (this.state.playing) {
      video.current.pauseAsync();
      this.setState({ playing: false });
    } else {
      video.current.playAsync();
      this.setState({ playing: true });
    }
  };

  beforeNavigation = (item, destination) => {
    if (this.video.current) {
      this.video.current.pauseAsync();
    }
    if (destination == "songs") {
      this.props.songPage(item);
    } else if (destination == "artists") {
      this.props.artistPage(item);
    } else if (destination == "users") {
      this.props.userProfile(item);
    } else if (destination == "comments" || destination == "applauds") {
      let updatedItem = { id: item.id, usage: destination };
      this.props.toComments(updatedItem);
    }
  };

  sendView = async (id) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/countview/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  checkUserContent = (item) => {
    if (item.user_id === this.props.currentUser.id) {
      return true;
    } else if (item.band_id) {
      let found = this.props.currentUser.bands.find(
        (band) => band.id === item.band_id
      );
      if (found) {
        return true;
      }
    }
    return false;
  };

  playbackUpdate = async (status) => {
    if (status.positionMillis === 0) {
      // re-start video cycle
      this.setState({ viewed: false });
    } else if (
      status.positionMillis > status.durationMillis / 2 &&
      status.positionMillis !== status.durationMillis &&
      !this.state.viewed
    ) {
      this.setState({ viewed: true });
      if (!this.checkUserContent(this.props.item)) {
        this.setState({ viewCount: this.state.viewCount + 1 });
        this.sendView(this.props.item.id);
      }
    } else if (status.didJustFinish) {
      if (!this.props.onLoop) {
        this.video.current.stopAsync();
        this.props.nextVideo();
      }
    }
  };
  applaudFunc = (item) => {
    const findUserBand = (bandId) => {
      let found = this.props.currentUser.bands.find((band) => {
        return band.id === bandId;
      });
      return found;
    };
    if (
      (item.user_id && item.user_id !== this.props.currentUser.id) ||
      (item.band_id && !findUserBand(item.band_id))
    ) {
      if (this.state.applauded) {
        this.unApplaudPost(item.id);
      } else {
        this.applaudPost(item.id);
      }
    }
  };

  applaudPost = async (id) => {
    this.setState({
      applaudCount: this.state.applaudCount + 1,
      applauded: true,
    });
    // let updatedApplauds = [...this.props.currentUser.applauds, this.props.item];
    // let updatedCurrentUser = {
    //   ...this.props.currentUser,
    //   applauds: updatedApplauds,
    // };
    // store.dispatch({
    //   type: "UPDATE_CURRENT_USER",
    //   currentUser: updatedCurrentUser,
    // });
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/applauds`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ post_id: id }),
    }).catch((err) => {
      this.setState({
        applaudCount: this.state.applaudCount - 1,
        applauded: false,
      });
      // add item to currentUsers Applauds
      Toast.show({ type: "error", text1: err });
    });
  };

  unApplaudPost = async (id) => {
    this.setState({
      applaudCount: this.state.applaudCount - 1,
      applauded: false,
    });
    let token = await AsyncStorage.getItem("jwt");
    // let updatedApplauds = [...this.props.currentUser.applauds].filter(
    //   (vid) => vid.id !== id
    // );
    // let updatedCurrentUser = {
    //   ...this.props.currentUser,
    //   applauds: updatedApplauds,
    // };
    // store.dispatch({
    //   type: "UPDATE_CURRENT_USER",
    //   currentUser: updatedCurrentUser,
    // });

    fetch(`http://${API_ROOT}/applauds/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => {
      this.setState({
        applaudCount: this.state.applaudCount + 1,
        applauded: true,
      });
      Toast.show({ type: "error", text1: err.message });
    });
  };

  renderHeader = (item) => {
    return (
      <View style={styles.details}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 0,
            margin: 5,
          }}
        >
          <View style={{ paddingRight: 10 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => this.beforeNavigation(item, "users")}
              >
                <Avatar
                  avatar={item.bandpicture ? item.bandpicture : item.useravatar}
                  size={responsiveSizes[height].postItemAvatar}
                  withRadius={true}
                />
              </TouchableOpacity>
              <View style={{ marginLeft: 5, justifyContent: "space-between" }}>
                <TouchableOpacity
                  onPress={() => this.beforeNavigation(item, "users")}
                >
                  <Text
                    style={{
                      fontSize: responsiveSizes[height].postItemAccountFontSize,
                      fontWeight: "600",
                      textAlign: "left",
                      color: "white",
                    }}
                  >
                    {item.username ? item.username : item.bandname}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: responsiveSizes[height].postItemTimeFont,
                    color: "silver",
                    textAlign: "left",
                  }}
                >
                  {getTiming(item.created_at)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {item.song_name ? (
          <View style={{ flex: 1, margin: 5 }}>
            <TouchableOpacity
              onPress={() => this.beforeNavigation(item, "songs")}
            >
              <Text
                style={{
                  textAlign: "right",
                  color: "white",
                  fontSize: responsiveSizes[height].postItemSongFont,
                }}
                numberOfLines={1}
              >
                {item.song_name}{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.beforeNavigation(item, "artists")}
            >
              <Text
                style={{
                  textAlign: "right",
                  color: "lightgray",
                  fontSize: responsiveSizes[height].postItemArtistFont,
                }}
                numberOfLines={1}
              >
                {item.artist_name}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  renderVideoButtons = (item) => {
    return (
      <BlurView
        intensity={20}
        tint="dark"
        style={{
          height: "auto",
          width: "100%",
          position: "absolute",
          maxHeight: 200,
          zIndex: 1,
          bottom: 0,
          padding: 10,
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
            zIndex: 1,
          }}
        >
          <Text
            style={{
              fontSize: responsiveSizes[height].postItemLowerVidFont,
              color: "white",
            }}
          >
            {item.description}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: responsiveSizes[height].postItemLowerVidFont,
                color: "white",
                textDecorationLine: "underline",
                textDecorationColor: "#9370DB",
              }}
            >
              {this.state.viewCount} views
            </Text>
            <TouchableOpacity
              onPress={() => this.beforeNavigation(item, "applauds")}
            >
              <Text
                style={{
                  fontSize: responsiveSizes[height].postItemLowerVidFont,
                  marginLeft: 5,
                  color: "white",
                  textDecorationLine: "underline",
                  textDecorationColor: "#9370DB",
                }}
              >
                {this.state.applaudCount} applauds
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.beforeNavigation(item, "comments")}
            >
              <Text
                style={{
                  fontSize: responsiveSizes[height].postItemLowerVidFont,
                  marginLeft: 5,
                  color: "white",
                  textDecorationLine: "underline",
                  textDecorationColor: "#9370DB",
                }}
              >
                comments
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.applaudFunc(item)}>
            <MaterialCommunityIcons
              name="hand-clap"
              size={responsiveSizes[height].postItemApplaud}
              style={{
                alignSelf: "center",
              }}
              color={this.state.applauded ? "#9370DB" : "white"}
            />
          </TouchableOpacity>
          <OptionsButton
            deleteAction={this.deleteVideo}
            item={this.props.item}
            update={this.props.updatePosts}
            usage={"post"}
            color="white"
          />
        </View>
      </BlurView>
    );
  };
  checkShouldPlay = () => {
    // console.log("WE HEREEE", this.props.index, this.props.viewingIndex);
    if (this.props.index === this.props.viewingIndex) {
      return true;
    }
    return false;
  };
  seeVideo = () => {
    this.setState({ displayReported: true, playing: true });
    this.video.current.playAsync();
  };

  render() {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.top}>{this.renderHeader(item)}</View>
        {this.props.origin == "timeline" ||
        this.props.origin == "posts" ||
        (this.props.origin == "playlist" && this.state.showContent) ? (
          <View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.handleVideoPlay(this.video)}
            >
              <Video
                source={{ uri: item.clip }}
                onLoadStart={() => this.setState({ videoLoading: true })}
                shouldPlay={this.checkShouldPlay()}
                rate={1.0}
                ref={this.video}
                volume={1}
                onPlaybackStatusUpdate={(status) => this.playbackUpdate(status)}
                isMuted={false}
                resizeMode={"cover"}
                isLooping={this.props.onLoop}
                style={{
                  height: responsiveSizes[height].postItemVideo,
                  width: width,
                }}
              />
            </TouchableOpacity>
            {this.renderVideoButtons(item)}
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "auto",
    borderBottomWidth: 1,
    borderBottomColor: "#2e2e2e",
  },
  top: {
    height: "auto",
  },

  details: {
    height: "auto",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  centeredView: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  description: {
    fontSize: 21,
    fontWeight: "600",
    paddingLeft: 5,
    color: "white",
  },
});
const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  timeline: state.timeline,
});
export default connect(mapStateToProps)(React.memo(PostItem));
