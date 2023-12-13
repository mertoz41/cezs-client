import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../../constants";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import { responsiveSizes } from "../../constants/reusableFunctions";

const MusicFilters = () => {
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    let musicInstruments;
    let musicGenres;
    switch (searchingFor) {
      case "users":
        musicInstruments = accountInstruments;
        musicGenres = accountGenres;
        break;
      case "bands":
        musicInstruments = accountInstruments;
        musicGenres = accountGenres;
        break;
      case "posts":
        musicInstruments = postInstruments;
        musicGenres = postGenres;
        break;
    }
  }, []);
  const selectInstrument = (inst) => {
    let found = selectedInstruments.find(
      (instrument) => instrument.id === inst.id
    );
    if (found) {
      let filtered = selectedInstruments.filter(
        (instru) => instru.id !== inst.id
      );
      setSelectedInstruments(filtered);

      updateResult(selectedGenres, filtered);
    } else {
      let updated = [...selectedInstruments, inst];
      setSelectedInstruments(updated);
      getFilterSearch(selectedGenres, updated);
    }
  };

  const selectGenre = (genr) => {
    let found = selectedGenres.find((genre) => genre.id === genr.id);
    if (found) {
      let filtered = selectedGenres.filter((genre) => genre.id !== genr.id);
      setSelectedGenres(filtered);
      updateResult(filtered, selectedInstruments);
    } else {
      let updated = [...selectedGenres, genr];
      setSelectedGenres(updated);
      getFilterSearch(updated, selectedInstruments);
    }
  };

  const getFilterSearch = async (genres, instruments) => {
    setLoading(true);
    let genreIds = genres.map((genr) => genr.id);
    let instrumentIds = instruments.map((inst) => inst.id);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/${searchingFor}filtersearch`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ genres: genreIds, instruments: instrumentIds }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        // setResult(sortPosts(resp));
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  // let musicInstruments;
  // let musicGenres;
  // switch (searchingFor) {
  //   case "users":
  //     musicInstruments = accountInstruments;
  //     musicGenres = accountGenres;
  //     break;
  //   case "bands":
  //     musicInstruments = accountInstruments;
  //     musicGenres = accountGenres;
  //     break;
  //   case "posts":
  //     musicInstruments = postInstruments;
  //     musicGenres = postGenres;
  //     break;
  // }
  return (
    <View style={{ marginTop: 0 }}>
      {musicInstruments?.length ? (
        <View>
          <Text style={responsiveSizes[height].sectionTitle}>instruments</Text>
          <ScrollView horizontal={true}>
            {musicInstruments.map((inst, i) => (
              <TouchableOpacity
                key={i}
                style={styles.filterItem}
                onPress={() => selectInstrument(inst)}
              >
                <Text
                  style={
                    selectedInstruments.includes(inst)
                      ? styles.selectedItemWriting
                      : styles.sectionItem
                  }
                >
                  {inst.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}
      {musicGenres?.length ? (
        <View>
          <Text style={responsiveSizes[height].sectionTitle}>genres</Text>
          <ScrollView horizontal={true}>
            {musicGenres.map((genr, i) => (
              <TouchableOpacity
                style={styles.filterItem}
                key={i}
                onPress={() => selectGenre(genr)}
              >
                <Text
                  style={
                    selectedGenres.includes(genr)
                      ? styles.selectedItemWriting
                      : styles.itemWriting
                  }
                >
                  {genr.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

export default MusicFilters;
