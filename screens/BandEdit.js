import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Text,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import AvatarSection from "../components/useredit/AvatarSection";
import EditSection from "../components/useredit/EditSection";
import SliderSection from "../components/useredit/SliderSection";
import { API_ROOT } from "../constants";
import store from "../redux/store";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Toast from "react-native-toast-message";
import { HERE_API_KEY } from "@env";
import { connect } from "react-redux";
import { responsiveSizes } from "../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const BandEdit = ({ route, navigation, currentUser }) => {
  const [searchingMember, setSearchingMember] = useState("");
  const [memberResults, setMemberResults] = useState([]);
  const [locationResult, setLocationResult] = useState([]);

  const [bandName, setBandName] = useState(route.params.name);
  const [location, setLocation] = useState(route.params.location.city);
  const [bandPic, setBandPic] = useState(route.params.picture);
  const [picDetails, setPicDetails] = useState(null);
  const [bandBio, setBandBio] = useState(route.params.bio);

  const [selectedMembers, setSelectedMembers] = useState(route.params.members);
  const [newLocation, setNewLocation] = useState(null);
  const [removedMembers, setRemovedMembers] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [genreSearching, setGenreSearching] = useState("");
  const [genreResult, setGenreResult] = useState([]);
  const [newGenres, setNewGenres] = useState(route.params.genres);
  const [removedGenres, setRemovedGenres] = useState([]);
  useEffect(() => {
    return () => {};
  }, []);

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

    // let formData = new FormData();
    let splitted = pickedPic.assets[0].uri.split(".");
    let fileEnding = splitted[splitted.length - 1];
    formData.append("picture", {
      uri: pickedPic.assets[0].uri,
      type: `${pickedPic.assets[0].type}/${fileEnding}`,
      name: `upload.${fileEnding}`,
    });

    formData.append("band_id", currentUser.id);
    await axios
      .post(`http://${API_ROOT}/picture`, formData, {
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
    // setPicDetails({
    //   uri: pickedPic.assets[0].uri,
    //   type: `${pickedPic.assets[0].type}/${fileEnding}`,
    //   name: `upload.${fileEnding}`,
    // });
    // setBandPic(pickedPic.assets[0].uri);
  };
  const selectMember = (member) => {
    let updatedMembers = [...selectedMembers, member];
    setSelectedMembers(updatedMembers);
    setMemberResults([]);
    setSearchingMember("");
  };

  const removeMember = (member) => {
    let updatedRemovedMembers = [...removedMembers, member];
    setRemovedMembers(updatedRemovedMembers);
    let filteredMembers = selectedMembers.filter(
      (membr) => membr.id !== member.id
    );
    setSelectedMembers(filteredMembers);
  };

  const memberSearch = async (text) => {
    setSearchingMember(text);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/followedusers`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ searching: text }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let filtered = resp.users.filter(
          (user) => !selectedMembers.find((usr) => usr.id === user.id)
        );
        setMemberResults(filtered);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const selectNewGenre = (item) => {
    setNewGenres([...newGenres, item]);
    setGenreSearching("");
    setGenreResult([]);
  };
  const clearGenreResult = () => {
    // setGenreResult([]);
  };
  const deleteGenre = (genre) => {
    setRemovedGenres([...removedGenres, genre]);
    let filteredGenres = newGenres.filter((genr) => genr.id !== genre.id);
    setNewGenres(filteredGenres);
  };

  const getAddress = (text) => {
    setLocation(text);
    if (text.length > 2) {
      fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${text}&apiKey=${HERE_API_KEY}`
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
              setLocationResult(mappedResult);
            }
          }
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    }
  };

  const selectNewLocation = (item) => {
    setLocation(`${item.city}, ${item.stateCode}`);
    setNewLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      city: `${item.city}, ${item.stateCode}`,
    });
    setLocationResult([]);
  };
  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const updateBand = async () => {
    let token = await AsyncStorage.getItem("jwt");
    let formData = new FormData();

    if (route.params.name !== bandName) {
      formData.append("name", bandName);
    }
    if (route.params.bio !== bandBio) {
      formData.append("bio", bandBio);
    }
    if (picDetails) {
      formData.append("picture", picDetails);
    }
    if (newLocation) {
      formData.append("locationLatitude", newLocation.latitude);
      formData.append("locationLongitude", newLocation.longitude);
      formData.append("city", newLocation.city);
    }
    if (picDetails) {
      formData.append("picture", picDetails);
    }
    if (checkNewMember(route.params.members)) {
      let filtered = selectedMembers
        .filter((member) => !band.members.find((usr) => usr.id === member.id))
        .map((member) => member.id);
      for (let i = 0; i < filtered.length; i++) {
        formData.append("members[]", filtered[i]);
      }
    }
    if (removedMembers.length) {
      let mapped = removedMembers.map((member) => member.id);
      for (let i = 0; i < mapped.length; i++) {
        formData.append("removedMembers[]", mapped[i]);
      }
    }
    if (newGenres.length) {
      let mapped = route.params.genres.map((genr) => genr.id);
      for (let i = 0; i < newGenres.length; i++) {
        if (!mapped.includes(newGenres[i].id)) {
          formData.append("genres[]", newGenres[i].name.trim());
        }
      }
    }
    if (removedGenres.length) {
      let mapped = removedGenres.map((genr) => genr.id);
      for (let i = 0; i < mapped.length; i++) {
        formData.append("removedGenres[]", mapped[i]);
      }
    }

    await axios
      .put(`http://${API_ROOT}/bands/${route.params.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
        },
      })
      .then((resp) => {
        if (
          removedMembers.map((member) => member.id).includes(currentUser.id)
        ) {
          Toast.show({
            type: "success",
            text1: `You are removed from ${bandName}.`,
          });
          let updatedBands = currentUser.bands.filter(
            (band) => band.id !== route.params.id
          );
          let updatedCurrentUser = { ...currentUser, bands: updatedBands };
          store.dispatch({
            type: "UPDATE_CURRENT_USER",
            currentUser: updatedCurrentUser,
          });
          navigation.goBack();
        } else {
          Toast.show({
            type: "success",
            text1: `${bandName} updated.`,
          });
          navigation.goBack();
        }
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const renderHeader = () => {
    const renderLeftSide = () => {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5
              name="backward"
              size={responsiveSizes[height].backwardIcon}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      );
    };

    const renderMiddle = () => {
      const titleSize = (title) => {
        if (title.length >= 17) {
          return 22;
        } else {
          return 30;
        }
      };
      return (
        <View
          style={{ flex: 3, flexDirection: "row", justifyContent: "center" }}
        >
          <Text
            style={{
              fontSize: responsiveSizes[height].screenTitle,
              color: "white",
              alignSelf: "center",
            }}
          >
            {bandName}
          </Text>
        </View>
      );
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
          {checkSaveButton() ? (
            <TouchableOpacity
              onPress={() => updateBand()}
              style={{
                paddingHorizontal: 5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                  color: "white",
                  textAlign: "center",
                  borderWidth: responsiveSizes[height].borderWidth,
                  borderColor: "#9370DB",
                  borderRadius: 10,
                  padding: 3,
                }}
              >
                save
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    };
    return (
      <View
        style={{
          height: 80,
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
          {renderMiddle()}
          {renderRightSide()}
        </View>
      </View>
    );
  };

  const checkNewMember = (members) => {
    let mapped = members.map((member) => member.id);
    for (let i = 0; i < selectedMembers.length; i++) {
      if (!mapped.includes(selectedMembers[i].id)) {
        return true;
      }
    }
  };

  const checkSaveButton = () => {
    if (
      route.params.bio !== bandBio ||
      route.params.name !== bandName ||
      checkNewMember(route.params.members) ||
      removedMembers.length ||
      newLocation ||
      picDetails ||
      removedGenres.length ||
      route.params.genres.length < newGenres.length
    ) {
      return true;
    }
    return false;
  };
  const deleteBand = async (id) => {
    setDeleteModal(false);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/bands/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let filteredBands = [...currentUser.bands].filter(
          (band) => band.id !== id
        );
        let updatedCurrentUser = { ...currentUser, bands: filteredBands };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
        Toast.show({
          type: "success",
          text1: "band deleted.",
        });
        navigation.navigate("Social");
      });
  };
  const renderModal = (visible, type, deleteAction, id) => {
    return (
      <Modal animationType="fade" transparent={true} visible={visible}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(46,46,46, .8)",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              width: "100%",
              marginTop: 100,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 28,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Confirm to delete {type}.
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 50,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "#9370DB",
                }}
                onPress={() => deleteAction(id)}
              >
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 28 }}
                >
                  confirm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeleteModal(false)}
                style={{
                  padding: 5,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "gray",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 28 }}
                >
                  cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const searchGenres = async (text) => {
    setGenreSearching(text);
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
  };

  return (
    <View style={{ opacity: 1 }}>
      {renderHeader()}
      {renderModal(deleteModal, "band", deleteBand, route.params.id)}

      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <AvatarSection openCameraPics={openCameraPics} pic={bandPic} />
          <EditSection
            label={"name"}
            currentValue={bandName}
            updateValue={setBandName}
          />
          <EditSection
            label="location"
            currentValue={location}
            updateValue={getAddress}
            result={locationResult}
            selectNewLocation={selectNewLocation}
          />
          <EditSection
            label="bio"
            currentValue={bandBio}
            updateValue={setBandBio}
          />
          <SliderSection
            label="genres"
            search={searchGenres}
            searching={genreSearching}
            select={selectNewGenre}
            remove={deleteGenre}
            selected={newGenres}
            searchResult={genreResult}
            clearSearchResult={clearGenreResult}
          />
          <SliderSection
            label="members"
            search={memberSearch}
            searching={searchingMember}
            select={selectMember}
            remove={removeMember}
            selected={selectedMembers}
            searchResult={memberResults}
            clearSearchResult={hideKeyboard}
          />
          <View style={{ height: 300 }}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                marginTop: 50,
                margin: 10,
                padding: 5,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#9370DB",
              }}
              onPress={() => setDeleteModal(true)}
            >
              <Text style={{ fontSize: 22, color: "white" }}>delete band</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(BandEdit);
