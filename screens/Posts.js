import React, { Component, createRef } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import TimelineHeader from "../components/timeline/TimelineHeader";
import { API_ROOT } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostItem from "../components/timeline/PostItem";
import Toast from "react-native-toast-message";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.flatRef = createRef();
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 70,
    };
  }

  state = {
    posts: [],
    viewingIndex: 0,
    loading: false,
    accountName: "",
    onLoop: false,
    onPlay: true,
    noPostLeftToShow: false,
  };

  componentDidMount() {
    let { postId, posts } = this.props.route.params;
    this.setState({ loading: true });
    if (posts) {
      let sliced = posts.slice(posts.indexOf(postId), 3);
      this.musicPosts(sliced);
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.state.posts.length == this.state.viewingIndex + 1 &&
      !this.state.noPostLeftToShow
    ) {
      let lastItemId = this.state.posts[this.state.posts.length - 1].id;
      this.getOlderPosts(lastItemId);
    }
  }

  getOlderPosts = async (id) => {
    let token = await AsyncStorage.getItem("jwt");
    let sliced = this.props.route.params.posts.slice(
      this.props.route.params.posts.indexOf(id) + 1
    );

    fetch(`http://${API_ROOT}/musicposts`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        posts: sliced,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (!resp.length) {
          this.setState({ noPostLeftToShow: true });
        } else {
          let updatedPosts = [...this.state.posts, ...resp];
          this.sortPosts(updatedPosts);
        }
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  viewableItemChanged = ({ viewableItems }) => {
    if (viewableItems.length) {
      this.setState({ viewingIndex: viewableItems[0].index });
    }
  };
  nextVideo = () => {
    if (
      this.state.viewingIndex + 1 !== this.state.posts.length &&
      !this.state.onLoop
    ) {
      this.setState({ viewingIndex: this.state.viewingIndex + 1 });
      this.flatRef.scrollToIndex({
        animated: true,
        index: this.state.viewingIndex + 1,
        viewOffset: 0,
        viewPosition: 0,
      });
    }
  };
  musicPosts = async (posts) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/musicposts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ posts: posts }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        this.sortPosts(resp);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  loopHandle = (bool) => {
    this.setState({ onLoop: bool });
  };

  sortPosts = (arr) => {
    let sorted = arr.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    this.setState({ posts: sorted, loading: false });
  };

  backTo = () => {
    this.props.navigation.goBack();
  };

  updatePosts = (id) => {
    // filter reported post from state.posts
    let oldPosts = this.state.posts;
    let filteredPosts = oldPosts.filter((post) => post.id !== id);
    this.setState({ posts: filteredPosts });
  };

  userProfile = (item) => {
    if (item.bandname) {
      let band = {
        bandname: item.bandname,
        picture: item.bandpicture,
        id: item.band_id,
      };
      this.props.navigation.navigate("Band", band);
    } else {
      let user = {
        username: item.username,
        avatar: item.useravatar,
        id: item.user_id,
      };
      this.props.navigation.push("User", user);
    }
  };
  songPage = async (item) => {
    let song = {
      id: item.song_id,
      name: item.song_name,
      artist_name: item.artist_name,
      spotify_id: item.songSpotifyId,
      artistSpotifyId: item.artistSpotifyId,
    };
    this.props.navigation.navigate("Song", song);
  };

  toComments = (item) => {
    this.props.navigation.navigate("Comment", item);
  };

  artistPage = (item) => {
    let artis = {
      id: item.artist_id,
      name: item.artist_name,
      spotify_id: item.artistSpotifyId,
    };
    this.props.navigation.navigate("Artist", artis);
  };

  renderItem = ({ item, index }) => {
    return (
      <PostItem
        origin="posts"
        updatePosts={this.updatePosts}
        item={item}
        key={item.id}
        index={index}
        songPage={this.songPage}
        artistPage={this.artistPage}
        userProfile={this.userProfile}
        toComments={this.toComments}
        viewingIndex={this.state.viewingIndex}
        onLoop={this.state.onLoop}
        onPlay={this.state.onPlay}
        nextVideo={this.nextVideo}
        isFocused={true}
      />
    );
  };

  render() {
    return (
      <View style={styles.containeitemC}>
        <TimelineHeader
          title={this.props.route.params.title}
          goBack={this.backTo}
          loopHandle={this.loopHandle}
          onLoop={this.state.onLoop}
        />
        {this.state.loading ? (
          <ActivityIndicator
            color="gray"
            size="large"
            style={{ marginTop: 10 }}
          />
        ) : null}
        {this.state.posts.length ? (
          <FlatList
            ref={(ref) => {
              this.flatRef = ref;
            }}
            data={this.state.posts}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => "key" + index}
            viewabilityConfig={this.viewabilityConfig}
            onViewableItemsChanged={this.viewableItemChanged}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containeitemC: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(Posts);
