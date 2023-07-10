import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import MusicInteraction from "./MusicInteraction";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const Filters = ({
  accountPosts,
  content,
  title,
  follows,
  setTheItem,
  setFollows,
  favoriteItems,
  setPosts,
  setUsersFavorite,
  usersFavorite,
}) => {
  const [display, setDisplay] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [genreSelections, setGenreSelections] = useState([]);
  const [allInstruments, setAllInstruments] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (accountPosts?.length) {
      setDisplay("instruments");
      let sorted = accountPosts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setAllPosts(sorted);
      let instFilter = [];
      let genreFilter = [];
      sorted.forEach((post) => {
        post.instruments.forEach((inst) => {
          if (!instFilter.includes(inst.name)) {
            instFilter.push(inst.name);
          }
        });
        if (!genreFilter.includes(post.genre.name)) {
          genreFilter.push(post.genre.name);
        }
      });
      setAllGenres(genreFilter);
      setAllInstruments(instFilter);
    }
  }, []);
  const clearFilter = () => {
    setPosts(accountPosts);
    setGenreSelections([]);
    setSelectedInstruments([]);
  };
  const instSelect = (inst) => {
    if (selectedInstruments.includes(inst)) {
      // remove inst, update posts
      let filtered = selectedInstruments.filter((instru) => instru !== inst);
      setSelectedInstruments(filtered);
      if (!filtered.length && !genreSelections.length) {
        clearFilter();
      } else {
        updatePosts(filtered, genreSelections);
      }
    } else {
      // add inst to selected, update posts
      let updated = [...selectedInstruments, inst];
      setSelectedInstruments(updated);
      updatePosts(updated, genreSelections);
    }
  };
  const genrSelect = (genr) => {
    if (genreSelections.includes(genr)) {
      let filtered = genreSelections.filter((genre) => genre !== genr);
      setGenreSelections(filtered);
      if (!filtered.length && !selectedInstruments.length) {
        clearFilter();
      } else {
        updatePosts(filtered, selectedInstruments);
      }
    } else {
      let updated = [...genreSelections, genr];
      setGenreSelections(updated);
      updatePosts(selectedInstruments, updated);
    }
  };
  const updatePosts = (remainingInstruments, remainingGenres) => {
    let updated = allPosts.filter((post) => {
      return post.instruments.some(
        (inst) =>
          remainingInstruments.includes(inst.name) ||
          remainingGenres.includes(post.genre.name)
      );
    });
    setPosts(updated);
  };
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 5,
        }}
      >
        {accountPosts?.length ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => setDisplay("instruments")}>
              <Text
                style={
                  display == "instruments"
                    ? styles.selectedItemWriting
                    : styles.itemWriting
                }
              >
                instruments
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 5 }}
              onPress={() => setDisplay("genres")}
            >
              <Text
                style={
                  display == "genres"
                    ? styles.selectedItemWriting
                    : styles.itemWriting
                }
              >
                genres
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}
        <MusicInteraction
          content={content}
          setFollows={setFollows}
          follows={follows}
          favoriteItems={favoriteItems}
          title={title}
          setTheItem={setTheItem}
          setUsersFavorite={setUsersFavorite}
          usersFavorite={usersFavorite}
        />
      </View>
      {accountPosts?.length ? (
        <ScrollView horizontal={true} style={{ marginVertical: 5 }}>
          <TouchableOpacity onPress={() => clearFilter()}>
            <Text
              style={
                !genreSelections.length && !selectedInstruments.length
                  ? styles.selectedItemWriting
                  : styles.itemWriting
              }
            >
              all
            </Text>
          </TouchableOpacity>
          {display == "instruments"
            ? allInstruments.map((inst, i) => (
                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  key={i}
                  onPress={() => instSelect(inst)}
                >
                  <Text
                    style={
                      selectedInstruments.includes(inst)
                        ? styles.selectedItemWriting
                        : styles.itemWriting
                    }
                  >
                    {inst}
                  </Text>
                </TouchableOpacity>
              ))
            : null}
          {display == "genres"
            ? allGenres.map((genr, i) => (
                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  onPress={() => genrSelect(genr)}
                  key={i}
                >
                  <Text
                    style={
                      genreSelections.includes(genr)
                        ? styles.selectedItemWriting
                        : styles.itemWriting
                    }
                  >
                    {genr}
                  </Text>
                </TouchableOpacity>
              ))
            : null}
        </ScrollView>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 6,
  },
  selectedItemWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
    textAlign: "center",
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "#9370DB",
    borderRadius: 10,
    padding: 5,
  },
  itemWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
    textAlign: "center",
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },
});

export default Filters;
