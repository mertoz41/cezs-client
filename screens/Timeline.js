import React, { Component } from "react";
import {
  StyleSheet,
  RefreshControl,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import store from "../redux/store";
import consumer from "../consumer/consumer";
import PostItem from "../components/timeline/PostItem";
import TimelineHeader from "../components/timeline/TimelineHeader";
import { API_ROOT } from "../constants/index";
import { useIsFocused } from "@react-navigation/native";
import Toast from "react-native-toast-message";

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 70,
    };
    this.flatRef = React.createRef();
    this.tipRef = React.createRef();
    this.kablo = React.createRef();
  }
  state = {
    viewingIndex: 0,
    refreshing: false,
    filterPosts: [],
    uploadingPerc: 0,
    onLoop: false,
    noPostLeftToShow: false,
  };
  componentDidMount() {
    if (this.props.route.params && this.props.route.params.newPost) {
      this.createSubs(this.props.currentUser.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.route.params &&
      this.props.route.params.newPost &&
      !this.kablo.current
    ) {
      this.createSubs(this.props.currentUser.id);
    }
    if (
      this.props.timeline.length == this.state.viewingIndex + 1 &&
      !this.state.noPostLeftToShow
    ) {
      this.getOlderPosts();
    }
    // if (
    //   this.props.route.params &&
    //   this.props.route.params.newPost &&
    //   !this.kablo.current
    // ) {
    // }
    // this.createSubs(this.props.currentUser.id);
  }

  getOlderPosts = async () => {
    let token = await AsyncStorage.getItem("jwt");

    let lastItem = this.props.timeline[this.props.timeline.length - 1];
    fetch(`http://${API_ROOT}/olderposts`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ last_created_at: lastItem.created_at }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.message) {
          this.setState({ noPostLeftToShow: true });
        } else {
          let updatedTimeline = [...this.props.timeline, ...resp.older_posts];
          store.dispatch({
            type: "UPDATE_TIMELINE",
            timeline: updatedTimeline,
          });
        }
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
    // send created at of last post
    // get 6, remove first 7
  };
  userProfile = (item) => {
    if (item.bandname) {
      let band = {
        name: item.bandname,
        picture: item.bandpicture,
        id: item.band_id,
      };
      this.props.navigation.navigate("Band", band);
    } else {
      //   }
      // } else {
      let user = {
        username: item.username,
        avatar: item.useravatar,
        id: item.user_id,
      };
      this.props.navigation.navigate("User", user);
    }
  };

  createSubs = (id) => {
    // const actionCable = ActionCable.createConsumer(`ws://${API_ROOT}/cable`);
    // const cable = new Cable({});
    // const channel = cable.setChannel(
    //   `video_conversion_channel_${id}`, // channel name to which we will pass data from Rails app with `stream_from`
    //   actionCable.subscriptions.create({
    //     channel: "VideoConversionChannel",
    //     user_id: id,
    //   })
    // );
    const addToTimeline = (data) => {
      if (data.clip) {
        let updatedTimeline = [data, ...this.props.timeline];
        let updatedCurrentUser = {
          ...this.props.currentUser,
          posts: [...this.props.currentUser.posts, data],
        };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
        store.dispatch({
          type: "UPDATE_TIMELINE",
          timeline: updatedTimeline,
        });
        this.setState({ uploadingPerc: 0 });
        Toast.show({ type: "success", text1: "Your video is posted." });

        // this.kablo.current.unsubscribe();
      } else {
        this.setState({ uploadingPerc: parseInt(data * 100) });
      }
    };
    // const addToTimeline = (data) => {};
    // channel.on("connected", () => console.log("AYE"));
    // .on( 'connected', this.handleConnected )
    // console.log("WE ARE TRYING TO MAKE CONNECTION");
    // if chatroom is not included in currentUsers chatroom update it.
    // timeline = (data) => this.addToTimeline(data);
    let cable = consumer.subscriptions.create(
      { channel: "VideoConversionChannel", user_id: id },
      {
        connected() {
        },
        received(data) {
          addToTimeline(data);
        },
        disconnected() {
          console.log("disconnected...");
        },
      }
    );
    this.kablo.current = cable;
  };

  updateTimeline = (tl) => {
    this.setState({ filterPosts: tl });
  };

  toComments = (item) => {
    this.props.navigation.navigate("Comment", item);
  };

  toMessages = () => {
    this.props.navigation.navigate("Messages");
  };

  toNotifications = () => {
    this.props.navigation.navigate("Notifications");
  };

  artistPage = (item) => {
    let artis = {
      id: item.artist_id,
      name: item.artist_name,
    };
    this.props.navigation.push("Artist", artis);
  };
  songPage = (item) => {
    let song = {
      id: item.song_id,
      name: item.song_name,
      artist_name: item.artist_name,
    };
    this.props.navigation.push("Song", song);
  };

  renderItem = ({ item, index }) => {
    return this.props.timeline.length ? (
      <PostItem
        origin="timeline"
        isFocused={this.props.isFocused}
        viewingIndex={this.state.viewingIndex}
        nextVideo={this.nextVideo}
        item={item}
        index={index}
        key={item.id}
        userProfile={this.userProfile}
        toComments={this.toComments}
        artistPage={this.artistPage}
        songPage={this.songPage}
        onLoop={this.state.onLoop}
      />
    ) : (
      this.renderEmptyMessage()
    );
  };
  nextVideo = () => {
    if (this.state.viewingIndex + 1 !== this.props.timeline.length) {
      this.setState({ viewingIndex: this.state.viewingIndex + 1 });
      this.flatRef.scrollToIndex({
        animated: true,
        index: this.state.viewingIndex + 1,
        viewOffset: 0,
        viewPosition: 0,
      });
    }
  };

  viewableItemChanged = ({ viewableItems }) => {
    if (viewableItems.length) {
      this.setState({
        viewingIndex: viewableItems[0].index,
      });
    }
  };
  onRefresh = async () => {
    let token = await AsyncStorage.getItem("jwt");
    let lasts = { last_post: this.props.timeline[0].id };
    // add new followed posts ids to get videos
    if (this.props.newFollowedPosts.length) {
      lasts.newPostIds = this.props.newFollowedPosts;
      store.dispatch({
        type: "UPDATE_NEW_FOLLOWED_POSTS",
        newFollowedPosts: [],
      });
    }
    // get timeline
    fetch(`http://${API_ROOT}/timeline`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lasts),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.timeline.length) {
          let updatedTimeline = resp.timeline.concat(this.props.timeline);
          let sortedTimeline = updatedTimeline.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          store.dispatch({ type: "UPDATE_TIMELINE", timeline: sortedTimeline });
        }
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  loopHandle = (bool) => {
    this.setState({ onLoop: bool });
  };
  renderFlatList = () => {
    return (
      <FlatList
        ref={(ref) => {
          this.flatRef = ref;
        }}
        data={this.props.timeline}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => "key" + index}
        style={styles.scroll}
        initialNumToRender={5}
        viewabilityConfig={this.viewabilityConfig}
        onViewableItemsChanged={this.viewableItemChanged}
        refreshControl={
          <RefreshControl
            tintColor="white"
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      />
      // <FlashList
      //   ref={(ref) => {
      //     this.flatRef = ref;
      //   }}
      //   data={this.props.timeline}
      //   renderItem={this.renderItem}
      //   keyExtractor={(item, index) => "key" + index}
      //   // style={styles.scroll}
      //   estimatedItemSize={200}
      //   // initialNumToRender={5}
      //   viewabilityConfig={this.viewabilityConfig}
      //   onViewableItemsChanged={this.viewableItemChanged}
      //   refreshControl={
      //     <RefreshControl
      //       tintColor="white"
      //       refreshing={this.state.refreshing}
      //       onRefresh={this.onRefresh}
      //     />
      //   }
      // />
    );
  };

  renderEmptyMessage = () => {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 80,
        }}
      >
        <Text style={{ alignSelf: "center", fontSize: 25, color: "white" }}>
          Your timeline is empty.
        </Text>
        <Text style={{ alignSelf: "center", fontSize: 25, color: "white" }}>
          Post{" "}
          <Text
            onPress={() => this.props.navigation.navigate("Camera")}
            style={{
              alignSelf: "center",
              fontSize: 25,

              color: "white",
              textDecorationLine: "underline",
            }}
          >
            videos
          </Text>{" "}
          or{" "}
          <Text
            onPress={() => this.props.navigation.navigate("Search")}
            style={{
              alignSelf: "center",
              fontSize: 25,

              color: "white",
              textDecorationLine: "underline",
            }}
          >
            find musicians
          </Text>{" "}
          to follow.
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TimelineHeader
          title="timeline"
          toMessages={this.toMessages}
          toNotifications={this.toNotifications}
          loopHandle={this.loopHandle}
          onLoop={this.state.onLoop}
        />

        {this.state.uploadingPerc > 1 ? (
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
                width: `${this.state.uploadingPerc}%`,
                position: "absolute",
              }}
            ></View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                alignSelf: "center",
                marginLeft: 10,
                color: "white",
              }}
            >
              uploading
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                alignSelf: "center",
                marginRight: 10,
                color: "white",
              }}
            >
              {this.state.uploadingPerc}%
            </Text>
          </View>
        ) : null}
        {this.props.timeline.length
          ? this.renderFlatList()
          : this.renderEmptyMessage()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  timeline: state.timeline,
  notis: state.notis,
  chatrooms: state.chatrooms,
  newFollowedPosts: state.newFollowedPosts,
  newFollowedAlbums: state.newFollowedAlbums,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },
});

const wrapped = function (props) {
  const isFocused = useIsFocused();

  return <Timeline {...props} isFocused={isFocused} />;
};
export default connect(mapStateToProps)(wrapped);
