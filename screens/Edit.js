import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import InstrumentEdit from "../components/useredit/InstrumentGenreEdit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../redux/store";
import { API_ROOT } from "../constants/index";
import EditSection from "../components/useredit/EditSection";
import { connect } from "react-redux";
import { HERE_API_KEY } from "@env";
import EditHeader from "../components/reusables/Header";
import AvatarSection from "../components/useredit/AvatarSection";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Toast from "react-native-toast-message";
import { checkEmail, responsiveSizes } from "../constants/reusableFunctions";
import { BlurView } from "expo-blur";
import ChangePasswordModal from "../components/useredit/ChangePasswordModal";
import DeleteUserModal from "../components/useredit/DeleteUserModal";
import consumer from "../consumer/consumer";
const { height } = Dimensions.get("window");
const Edit = ({ navigation, currentUser, notificationChannel }) => {
  const [bio, setBio] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState([]);
  const [newLocation, setNewLocation] = useState(null);
  const [newInstruments, setNewInstruments] = useState([]);
  const [newGenres, setNewGenres] = useState([]);
  const [newFavoriteArtists, setNewFavoriteArtists] = useState([]);
  const [newFavoriteSongs, setNewFavoriteSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  useEffect(() => {
    updateEditUser(currentUser);
  }, []);
  const updateEditUser = (user) => {
    setLocation(user.location?.city);
    setBio(user.bio);
    setUserName(user.username);
    setName(user.name);
    setEmail(user.email);
    setNewInstruments(user.instruments);
    setNewGenres(user.genres);
    setNewFavoriteArtists(user.favoriteartists);
    setNewFavoriteSongs(user.favoritesongs);
  };

  const toNewBand = () => {
    navigation.navigate("NewBand");
  };
  const toBlockedUsers = () => {
    navigation.navigate("BlockedUsers");
  };
  const logUserOut = async () => {
    store.dispatch({ type: "LOG_USER_OUT" });
    await AsyncStorage.removeItem("jwt");
  };
  const getAddress = (text) => {
    setLocation(text);
    if (text.length > 2 && location !== text) {
      fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${location}&apiKey=YOQNPW6X0YomatyblsMiCWD7m2F_sirWAV4upk3e0l4`
      )
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.items && resp.items.length) {
            let mappedResult = resp.items.map((item) => ({
              city: item.address.city,
              stateCode: item.address.stateCode,
              latitude: item.position.lat,
              longitude: item.position.lng,
            }));
            if (mappedResult.length) {
              setResult(mappedResult);
            }
          }
        })
        .catch((err) => showToast("error", err.message));
    }
  };
  const selectNewLocation = (item) => {
    setLocation(`${item.city}, ${item.stateCode}`);
    setNewLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      city: `${item.city}, ${item.stateCode}`,
    });
    setResult([]);
  };

  const updateUser = async () => {
    Keyboard.dismiss();
    let updatedObj = {};

    if (currentUser.username !== userName) {
      if (userName.includes(" ")) {
        showToast("error", "No space allowed in usernames.");
        return;
      }
      if (userName.length < 8) {
        showToast("error", "Username too short.");
        return;
      }
      updatedObj.username = userName;
    }
    if (currentUser.name !== name) {
      updatedObj.name = name.trim();
    }

    if (currentUser.email !== email) {
      if (checkEmail(email)) {
        updatedObj.email = email.trim();
      } else {
        showToast("error", "email is not valid.");
        return;
      }
    }
    if (currentUser.bio !== bio) {
      updatedObj.bio = bio;
    }
    if (newLocation) {
      updatedObj.location = newLocation;
    }
    if (checkInstrumentsAndGenres(currentUser.instruments, newInstruments)) {
      updatedObj.instruments = [];
      let mapped = currentUser.instruments.map((inst) => inst.id);
      for (let i = 0; i < newInstruments.length; i++) {
        if (!mapped.includes(newInstruments[i].id)) {
          updatedObj.instruments.push(newInstruments[i].name.trim());
        }
      }
    }
    if (checkInstrumentsAndGenres(currentUser.genres, newGenres)) {
      updatedObj.genres = [];
      let mapped = currentUser.genres.map((genr) => genr.id);
      for (let i = 0; i < newGenres.length; i++) {
        if (!mapped.includes(newGenres[i].id)) {
          updatedObj.genres.push(newGenres[i].name.trim());
        }
      }
    }

    if (checkFavorites(currentUser.favoriteartists, newFavoriteArtists)) {
      updatedObj.favoriteartists = [];
      let mapped = currentUser.favoriteartists.map((item) => item.name);
      for (let i = 0; i < newFavoriteArtists.length; i++) {
        if (!mapped.includes(newFavoriteArtists[i].name)) {
          updatedObj.favoriteartists.push(newFavoriteArtists[i].name.trim());
        }
      }
    }

    if (checkSongFavorite(currentUser.favoritesongs, newFavoriteSongs)) {
      updatedObj.favoritesongs = [];
      for (let i = 0; i < newFavoriteSongs.length; i++) {
        let found = currentUser.favoritesongs.find(
          (song) =>
            song.name === newFavoriteSongs[i].name &&
            song.artist_name === newFavoriteSongs[i].artist_name
        );
        if (!found) {
          updatedObj.favoritesongs.push(newFavoriteSongs[i]);
        }
      }
    }
    setLoading(true);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/users/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedObj),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        updateEditUser(resp.user);
        setNewLocation(null);
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: resp.user,
        });
        showToast("success", "Profile updated.");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast("error", err.message);
      });
  };

  const showToast = (type, first, second) => {
    Toast.show({
      type: type,
      text1: first,
      text2: second,
    });
  };
  const checkInstrumentsAndGenres = (userItems, newItems) => {
    let mapped = userItems.map((item) => item.id);
    for (let i = 0; i < newItems.length; i++) {
      if (!mapped.includes(newItems[i].id)) {
        return true;
      }
    }
  };

  const checkFavorites = (userFavorites, newFavorites) => {
    let mapped = userFavorites.map((item) => item.name);
    for (let i = 0; i < newFavorites.length; i++) {
      if (!mapped.includes(newFavorites[i].name)) {
        return true;
      }
    }
  };

  const checkSongFavorite = (userFavorites, newFavoriteSongs) => {
    for (let i = 0; i < newFavoriteSongs.length; i++) {
      let found = userFavorites.find(
        (song) =>
          song.name === newFavoriteSongs[i].name &&
          song.artist_name === newFavoriteSongs[i].artist_name
      );
      if (!found) {
        return true;
      }
    }
  };
  const checkSaveButton = () => {
    if (
      currentUser.name !== name ||
      currentUser.email !== email ||
      currentUser.bio !== bio ||
      currentUser.username !== userName ||
      newLocation ||
      checkInstrumentsAndGenres(currentUser.genres, newGenres) ||
      checkInstrumentsAndGenres(currentUser.instruments, newInstruments) ||
      checkFavorites(currentUser.favoriteartists, newFavoriteArtists) ||
      checkSongFavorite(currentUser.favoritesongs, newFavoriteSongs)
    ) {
      return true;
    }
    return false;
  };

  const renderHeader = () => {
    return (
      <EditHeader
        title="settings"
        actionLabel="save"
        action={updateUser}
        displayAction={checkSaveButton()}
        goBack={navigation.goBack}
        loading={loading}
      />
    );
  };

  const renderLogout = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={{
            margin: 10,
            padding: 5,
            borderRadius: 10,
            borderWidth: responsiveSizes[height].borderWidth,
            borderColor: "gray",
          }}
          onPress={() => setDeleteModalVisible(true)}
        >
          <Text
            style={{
              fontSize: responsiveSizes[height].sliderItemFontSize,
              color: "white",
            }}
          >
            delete account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            margin: 10,
            padding: 5,
            borderRadius: 10,
            borderWidth: responsiveSizes[height].borderWidth,
            borderColor: "#9370DB",
          }}
          onPress={() => logUserOut()}
        >
          <Text
            style={{
              fontSize: responsiveSizes[height].sliderItemFontSize,
              color: "white",
            }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const openCameraPics = async () => {
    let token = await AsyncStorage.getItem("jwt");

    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll denied!");
      return;
    }
    let pickedPic = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (pickedPic.canceled) {
      return;
    }
    setLoading(true);
    let formData = new FormData();

    let splitted = pickedPic.assets[0].uri.split(".");
    let fileEnding = splitted[splitted.length - 1];
    formData.append("avatar", {
      uri: pickedPic.assets[0].uri,
      type: `${pickedPic.assets[0].type}/${fileEnding}`,
      name: `upload.${fileEnding}`,
    });

    formData.append("user_id", currentUser.id);
    await axios
      .post(`http://${API_ROOT}/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        let updatedCurrentUser = { ...currentUser, avatar: resp.data.avatar };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
        showToast("success", "Avatar changed.");
      })
      .catch((err) => showToast("error", err.message));
    setLoading(false);
  };
  const renderPasswordSection = () => {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "gray",
          marginTop: 5,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>password</Text>
          </View>
          <View style={{ flex: 2, justifyContent: "flex-start" }}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                borderWidth: 1,
                borderColor: "gray",
                padding: 5,
                borderRadius: 10,
              }}
              onPress={() => setPasswordModalVisible(true)}
            >
              <Text
                style={{
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                  color: "white",
                  fontWeight: "300",
                }}
              >
                change password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: "#2e2e2e", display: "flex", flex: 1 }}>
      {renderHeader()}
      <ChangePasswordModal
        passwordModalVisible={passwordModalVisible}
        setPasswordModalVisible={setPasswordModalVisible}
      />
      <DeleteUserModal
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
      />
      <KeyboardAvoidingView behavior="padding">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView keyboardShouldPersistTaps={"always"}>
            <AvatarSection
              openCameraPics={openCameraPics}
              pic={currentUser.avatar}
            />
            <EditSection
              label="location"
              currentValue={location}
              updateValue={getAddress}
              result={result}
              selectNewLocation={selectNewLocation}
            />
            <EditSection
              label="username"
              currentValue={userName}
              updateValue={setUserName}
            />
            {renderPasswordSection()}
            <EditSection
              label={"name"}
              currentValue={name}
              updateValue={setName}
            />
            <EditSection
              label="email"
              currentValue={email}
              updateValue={setEmail}
            />
            <EditSection label="bio" currentValue={bio} updateValue={setBio} />
            <InstrumentEdit
              setNewInstruments={setNewInstruments}
              newInstruments={newInstruments}
              setNewGenres={setNewGenres}
              newGenres={newGenres}
              setNewFavoriteArtists={setNewFavoriteArtists}
              newFavoriteArtists={newFavoriteArtists}
              setNewFavoriteSongs={setNewFavoriteSongs}
              newFavoriteSongs={newFavoriteSongs}
              toNewBandPage={toNewBand}
              toBlockedUsers={toBlockedUsers}
            />
            <View style={{ height: 350 }}>{renderLogout()}</View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  notificationChannel: state.notificationChannel,
});

export default connect(mapStateToProps)(Edit);
