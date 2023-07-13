import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal, Dimensions } from "react-native";
import store from "../../redux/store";
import { API_ROOT } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  responsiveSizes,
  addPostsToTimeline,
  removePostsFromTimeline,
} from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const MusicInteractions = ({
  currentUser,
  content,
  follows,
  setFollows,
  favoriteItems,
  title,
  setTheItem,
  setUsersFavorite,
  usersFavorite,
  accountPosts,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const unfollow = async (item) => {
    let updatedItem = {
      ...item,
      followingusers_count: item.followingusers_count - 1,
    };
    setTheItem(updatedItem);
    setFollows(false);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/${title}unfollow/${item.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        updateCurrentUser("unfollow");
        removePostsFromTimeline(`${title}_id`, content.id);
      })
      .catch((err) => {
        let updatedItem = {
          ...item,
          followingusers_count: item.followingusers_count + 1,
        };
        setTheItem(updatedItem);
        setFollows(true);
        Toast.show({ type: "error", text1: err.message });
      });
  };
  const follow = async (item) => {
    setFollows(true);
    let newItem = {
      ...item,
      followingusers_count: item.followingusers_count + 1,
    };
    setTheItem(newItem);
    let token = await AsyncStorage.getItem("jwt");
    let followObj = properFields(item);
    fetch(`http://${API_ROOT}/${title}follow`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(followObj),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        updateCurrentUser("follow");
        addPostsToTimeline(accountPosts.slice(0, 3));
      })
      .catch((err) => {
        setFollows(false);
        let newItem = {
          ...item,
          followingusers_count: item.followingusers_count - 1,
        };
        setTheItem(newItem);
        Toast.show({ type: "error", text1: err.message });
      });
  };
  const updateCurrentUser = (type, updated, old) => {
    let updatedCurrentUser = {
      ...currentUser,
    };

    const addToFavorites = (newItem) => {
      let favoriteList = [...updatedCurrentUser[`favorite${title}s`], newItem];
      return favoriteList;
    };
    const filterFavorites = (oldItem) => {
      let updatedFavoriteList = currentUser[`favorite${title}s`].filter(
        (item) => item.id !== oldItem.id
      );
      return updatedFavoriteList;
    };

    switch (type) {
      case "follow":
        updatedCurrentUser = {
          ...updatedCurrentUser,
          follows_count: currentUser.follows_count + 1,
        };
        break;
      case "unfollow":
        updatedCurrentUser = {
          ...updatedCurrentUser,
          follows_count: currentUser.follows_count - 1,
        };
        break;
      case "favorite":
        updatedCurrentUser[`favorite${title}s`] = addToFavorites(updated);

        break;
      case "unfavorite":
        updatedCurrentUser[`favorite${title}s`] = filterFavorites(content);
        break;
      case "update":
        let filtered = filterFavorites(old);
        filtered.push(updated);
        updatedCurrentUser[`favorite${title}s`] = filtered;
        break;
    }

    store.dispatch({
      type: "UPDATE_CURRENT_USER",
      currentUser: updatedCurrentUser,
    });
  };

  // const checkFavorite = (item) => {
  //   let found = favoriteItems.find((itm) => itm.id == item?.id);
  //   if (found) {
  //     return true;
  //   }
  //   return false;
  // };
  const favorite = async (item) => {
    if (favoriteItems.length === 5) {
      setModalVisible(true);
    } else {
      let updatedItem = {
        ...item,
        favoriteusers_count: item.favoriteusers_count + 1,
      };
      setTheItem(updatedItem);
      setUsersFavorite(true);
      let token = await AsyncStorage.getItem("jwt");

      let favObj = properFields(item);

      fetch(`http://${API_ROOT}/user${title}s`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...favObj,
        }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          updateCurrentUser("favorite", {
            ...resp[title],
          });
        })
        .catch((err) => {
          let fixItem = {
            ...item,
            favoriteusers_count: item.favoriteusers_count - 1,
          };
          setTheItem(fixItem);
          setUsersFavorite(false);
          Toast.show({ type: "error", text1: err.message });
        });
    }
  };
  const properFields = (item) => {
    let followObj;
    switch (title) {
      case "song":
        followObj = {
          id: item.id,
          name: item.name,
          artist_name: item.artist_name,
          artist_id: item.artist_id,
        };
        break;
      case "artist":
        followObj = {
          artist_name: item.name,
          id: item.id,
        };
        break;
      default:
    }
    return followObj;
  };

  const unfavorite = async (item) => {
    let updatedItem = {
      ...item,
      favoriteusers_count: item.favoriteusers_count - 1,
    };
    setTheItem(updatedItem);
    setUsersFavorite(false);
    let token = await AsyncStorage.getItem("jwt");
    let unFavoriteObj;
    switch (title) {
      case "song":
        unFavoriteObj = { song_id: item.id };
        break;
      case "artist":
        unFavoriteObj = { artist_id: item.id };
        break;
    }
    fetch(`http://${API_ROOT}/deleteuser${title}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(unFavoriteObj),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        updateCurrentUser("unfavorite");
      })
      .catch((err) => {
        let updatedItem = {
          ...item,
          favoriteusers_count: item.favoriteusers_count + 1,
        };
        setTheItem(updatedItem);
        setUsersFavorite(true);
        Toast.show({ type: "error", text1: err.message });
      });
  };
  const updateFavorite = async (oldItem) => {
    let favObj = properFields(content);
    let token = await AsyncStorage.getItem("jwt");

    fetch(`http://${API_ROOT}/user${title}s/${oldItem.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(favObj),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setModalVisible(false);
        updateCurrentUser(
          "update",
          {
            ...resp[title],
          },
          oldItem
        );
        let updatedItem = {
          ...resp[title],
          favoriteusers_count: content.favoriteusers_count + 1,
        };
        setUsersFavorite(true);
        setTheItem(updatedItem);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(46,46,46, .8)",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              width: "70%",
              marginTop: 80,
            }}
          >
            <Text style={{ color: "white", fontSize: 24, marginBottom: 10 }}>
              choose {title === "song" ? "a" : "an"} {title} to replace:
            </Text>
            {favoriteItems.map((item) => (
              <TouchableOpacity
                onPress={() => updateFavorite(item)}
                key={item.id}
                style={{
                  padding: 5,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "white",
                  marginBottom: 10,
                  alignSelf: "flex-start",
                }}
              >
                <Text style={{ color: "white", fontSize: 19 }}>
                  {item.name}
                </Text>
                <Text style={{ color: "white", fontSize: 17 }}>
                  {item.artist_name}{" "}
                  {item.album_name ? `- ${item.album_name}` : null}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={{
              padding: 5,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "white",
              alignSelf: "flex-end",
              marginRight: 10,
            }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => (follows ? unfollow(content) : follow(content))}
      >
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            color: "white",
            borderWidth: responsiveSizes[height].borderWidth,
            borderColor: follows ? "#9370DB" : "gray",
            borderRadius: 10,
            textAlign: "center",
            padding: 5,
          }}
        >
          {follows ? "following" : "follow"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ alignSelf: "center", marginLeft: 5 }}
        onPress={() =>
          usersFavorite ? unfavorite(content) : favorite(content)
        }
      >
        <MaterialIcons
          name={`favorite${usersFavorite ? "" : "-outline"}`}
          size={responsiveSizes[height].favoriteIcon}
          color="red"
        />
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(MusicInteractions);
