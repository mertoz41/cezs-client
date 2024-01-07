import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");

const MusicFilters = ({
  searchingFor,
  accountInstruments,
  accountGenres,
  postInstruments,
  postGenres,
  updateResult,
  getFilterSearch,
}) => {
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [displayedGenres, setDisplayedGenres] = useState([]);
  const [displayedInstruments, setDisplayedInsturments] = useState([]);

  useEffect(() => {
    if (searchingFor === "users" || searchingFor === "bands") {
      setDisplayedGenres(accountGenres);
      setDisplayedInsturments(accountInstruments);
    } else {
      setDisplayedGenres(postGenres);
      setDisplayedInsturments(postInstruments);
    }
  }, [
    accountInstruments,
    accountGenres,
    postInstruments,
    postGenres,
    searchingFor,
  ]);
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

  const filterItem = (item, list, action, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={{
          height: "auto",
          width: "auto",
          marginLeft: 10,

          borderColor: list.includes(item) ? "#9370DB" : "gray",
          borderRadius: 10,
          borderWidth: responsiveSizes[height].borderWidth,
          paddingHorizontal: 4,
        }}
        onPress={() => action(item)}
      >
        <Text
          style={
            list.includes(item)
              ? {
                  fontSize: responsiveSizes[height].searchItem,
                  fontWeight: "300",
                  color: "#9370DB",
                }
              : {
                  fontSize: responsiveSizes[height].searchItem,
                  fontWeight: "300",
                  color: "silver",
                }
          }
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFilterSection = (
    title,
    allItems,
    selectedItems,
    selectAction
  ) => {
    return (
      <View>
        <View style={{ marginTop: 5 }}>
          <Text style={responsiveSizes[height].sectionTitle}>{title}</Text>
        </View>
        <ScrollView horizontal={true}>
          {allItems?.length
            ? allItems.map((inst, i) =>
                filterItem(inst, selectedItems, selectAction, i)
              )
            : [1, 2, 3, 4, 5].map((i) => renderPlaceholder(i))}
        </ScrollView>
      </View>
    );
  };
  const renderPlaceholder = (i) => {
    return (
      <TouchableOpacity
        key={i}
        style={{
          height: "auto",
          width: "auto",
          marginLeft: 10,
          backgroundColor: "rgba(147,112,219, .3)",
          borderColor: "transparent",
          borderRadius: 10,
          borderWidth: responsiveSizes[height].borderWidth,
          paddingHorizontal: 4,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "300",
            color: "transparent",
          }}
        >
          bass guitar
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginTop: 0 }}>
      {renderFilterSection(
        "instruments",
        displayedInstruments,
        selectedInstruments,
        selectInstrument
      )}
      {renderFilterSection(
        "genres",
        displayedGenres,
        selectedGenres,
        selectGenre
      )}
    </View>
  );
};

export default MusicFilters;
