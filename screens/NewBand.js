import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Keyboard } from "react-native";
import { connect } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import store from "../redux/store";
import { API_ROOT } from "../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ActionHeader from "../components/reusables/ActionHeader";
import EditSection from "../components/useredit/EditSection";
import SliderSection from "../components/useredit/SliderSection";
import RenderAvatarSection from "../components/useredit/AvatarSection";
import Toast from "react-native-toast-message";

const NewBand = ({ navigation, currentUser }) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [memberSearching, setMemberSearching] = useState("");
  const [result, setResult] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [bandPic, setBandPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [genreSearching, setGenreSearching] = useState("");
  const [genreResult, setGenreResult] = useState([]);
  const [newGenres, setNewGenres] = useState([]);

  useEffect(() => {
    setSelectedMembers([...selectedMembers, currentUser]);
    setNewGenres(currentUser.genres);
  }, []);

  const fetchUsers = async (text) => {
    setMemberSearching(text);
    setLoading(!loading);
    let token = await AsyncStorage.getItem("jwt");

    if (text.length > 1) {
      fetch(`http://${API_ROOT}/followedusers`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searching: memberSearching }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setResult(resp.users);
          setLoading(!loading);
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    }
  };

  const selectMember = (member) => {
    if (selectedMembers.includes(member)) {
      alert(`${member.username} is already in this band`);
    } else {
      let updatedSelectedMembers = selectedMembers;
      updatedSelectedMembers.push(member);
      setSelectedMembers(updatedSelectedMembers);
      setResult([]);
      setEditing(!editing);
      setMemberSearching("");
    }
  };
  const removeMember = (member) => {
    let updatedSelectedMembers = selectedMembers.filter(
      (memb) => memb.id !== member.id
    );
    setSelectedMembers(updatedSelectedMembers);
  };

  const openCameraPics = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll denied");
      return;
    }
    let pickedPic = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      videoMaxDuration: 60,
      quality: 1,
    });
    if (pickedPic.canceled) {
      return;
    }
    let splitted = pickedPic.assets[0].uri.split(".");
    let fileEnding = splitted[splitted.length - 1];
    let picObject = {
      uri: pickedPic.assets[0].uri,
      type: `${pickedPic.assets[0].type}/${fileEnding}`,
      name: `upload.${fileEnding}`,
    };
    setBandPic(picObject);
  };

  const createBand = async () => {
    if (name.length > 17) {
      Toast.show({
        type: "error",
        text1: "Name must be less than 17 characters.",
      });
    } else {
      setCreateLoading(true);
      let formData = new FormData();
      let token = await AsyncStorage.getItem("jwt");

      let updatedMembers = selectedMembers.map((member) => member.id);

      formData.append("picture", bandPic);
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("members", JSON.stringify(updatedMembers));
      formData.append(
        "genres",
        JSON.stringify(newGenres.map((genr) => genr.name))
      );
      formData.append("location_id", currentUser.location.id);
      formData.append("user_id", currentUser.id);
      await axios
        .post(`http://${API_ROOT}/bands`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
          let updatedCurrentUser = {
            ...currentUser,
            bands: [...currentUser.bands, resp.data],
          };
          store.dispatch({
            type: "UPDATE_CURRENT_USER",
            currentUser: updatedCurrentUser,
          });

          navigation.goBack();
          setCreateLoading(false);
        })
        .catch((err) => console.log(err));
    }
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

  const checkForm = () => {
    if (name.length > 5 && bandPic && selectedMembers.length >= 2) {
      return true;
    }
    return false;
  };
  const clearResult = () => {
    Keyboard.dismiss();
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
    let filteredGenres = newGenres.filter((genr) => genr.id !== genre.id);
    setNewGenres(filteredGenres);
  };
  return (
    <View style={styles.container}>
      <ActionHeader
        title="new band"
        displayAction={checkForm()}
        actionLabel="create"
        goBack={navigation.goBack}
        action={createBand}
        loading={createLoading}
      />

      <ScrollView>
        <RenderAvatarSection
          openCameraPics={openCameraPics}
          pic={bandPic?.uri}
        />

        <EditSection label={"name"} currentValue={name} updateValue={setName} />
        <EditSection label="bio" currentValue={bio} updateValue={setBio} />
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
          search={fetchUsers}
          searching={memberSearching}
          select={selectMember}
          remove={removeMember}
          selected={selectedMembers}
          searchResult={result}
          clearSearchResult={clearResult}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2e2e",
  },
  section: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "darkgray",
    margin: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    alignSelf: "flex-end",
  },
});

const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(NewBand);
