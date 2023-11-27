import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../../redux/store";
import { API_ROOT } from "../../constants";
import OptionsButton from "../reusables/OptionsButton";
import Toast from "react-native-toast-message";
import {
  responsiveSizes,
  addPostsToTimeline,
  removePostsFromTimeline,
  updateCurrentUser,
} from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const ProfileHeader = ({
  account,
  currentUser,
  goBack,
  navigateMessages,
  navigateEdit,
  follows,
  setFollows,
  setFollowerNumber,
}) => {
  const unfollowAccount = async (account) => {
    setFollows(false);
    setFollowerNumber((prevState) => prevState - 1);
    let token = await AsyncStorage.getItem("jwt");
    fetch(
      `http://${API_ROOT}/${account.username ? "" : "band"}follows/${
        account.id
      }`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        removePostsFromTimeline(
          `${account.username ? "user" : "band"}_id`,
          account.id
        );
        let updatedCurrentUser = {
          ...currentUser,
          follows_count: currentUser.follows_count - 1,
        };
        updateCurrentUser(updatedCurrentUser);
      })
      .catch((err) => {
        Toast.show({ type: "error", text1: err.message });
        setFollows(true);
        setFollowerNumber((prevState) => prevState + 1);
      });
  };

  const followAccount = async (account) => {
    setFollowerNumber((prevState) => prevState + 1);
    setFollows(true);

    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/${account.username ? "" : "band"}follows`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: account.id }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        addPostsToTimeline(account.posts.slice(0, 3));

        let updatedCurrentUser = {
          ...currentUser,
          follows_count: currentUser.follows_count + 1,
        };
        updateCurrentUser(updatedCurrentUser);
      })
      .catch((err) => {
        setFollows(false);
        Toast.show({ type: "error", text1: err.message });
        setFollowerNumber((prevState) => prevState - 1);
      });
  };
  const renderFollowButton = (account) => {
    return (
      <TouchableOpacity
        onPress={() =>
          follows ? unfollowAccount(account) : followAccount(account)
        }
      >
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            color: "white",
            textAlign: "center",
            borderWidth: responsiveSizes[height].borderWidth,
            borderColor: follows ? "#9370DB" : "gray",
            borderRadius: 10,
            padding: 5,
          }}
        >
          {follows ? "following" : "follow"}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLeftSide = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        {account?.id === currentUser.id ? null : (
          <TouchableOpacity onPress={() => goBack()}>
            <FontAwesome5
              name="backward"
              size={responsiveSizes[height].backwardIcon}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const blockAccount = async (acct) => {
    let blockObj = {};
    blockObj[acct.username ? "blocked_user_id" : "blocked_band_id"] = acct.id;
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/userblocks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(blockObj),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let updatedCurrentUser = {
          ...currentUser,
          blocked_account_count: currentUser.blocked_account_count + 1,
        };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
        Toast.show({
          type: "success",
          text1: `You blocked ${acct.username ? "user" : "band"}.`,
        });
        goBack();
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const renderRightSide = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          justifyContent: "flex-end",
          alignSelf: "flex-end",
        }}
      >
        {account?.id === currentUser.id || checkCurrentUserBand(account?.id) ? (
          <TouchableOpacity onPress={() => navigateEdit()}>
            <Feather
              name="settings"
              size={responsiveSizes[height].settingsIcon}
              color="gray"
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {renderFollowButton(account)}
            <OptionsButton
              item={account}
              usage={account?.username ? "user" : "band"}
              blockAction={blockAccount}
              color="gray"
              goBack={goBack}
            />
          </View>
        )}
      </View>
    );
  };

  const checkCurrentUserBand = (id) => {
    let found = currentUser.bands.find((band) => band.id === id);
    if (found) {
      return true;
    }
    return false;
  };

  const renderMiddle = () => {
    return (
      <View style={{ flex: 3, flexDirection: "row", justifyContent: "center" }}>
        {!account?.username || account.id === currentUser.id ? null : (
          <TouchableOpacity
            onPress={() => navigateMessages(account)}
            style={{ alignSelf: "center", marginRight: 5, marginTop: 2 }}
          >
            <Feather
              name="message-circle"
              size={responsiveSizes[height].backwardIcon}
              color="darkgray"
            />
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontSize: responsiveSizes[height].screenTitle,

            color: "white",
            alignSelf: "center",
          }}
        >
          {account.username ? account.username : account.name}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        height: responsiveSizes[height].header,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          paddingBottom: 5,
        }}
      >
        {renderLeftSide()}

        {account ? renderMiddle() : null}
        {renderRightSide()}
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(ProfileHeader);
