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
  setTheItem,
  favoriteItems,
  setPosts,
  loading,
}) => {
  const [display, setDisplay] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [genreSelections, setGenreSelections] = useState([]);
  const [allInstruments, setAllInstruments] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    // ACCESS USERS FAVORITE FROM CONTENT
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
  }, [accountPosts, content]);
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

  const renderSkeleton = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ borderRadius: 10, backgroundColor: "rgba(147,112,219, .3)" }}
        >
          <Text style={styles.skeletonWriting}>instruments</Text>
        </View>
        <View
          style={{
            marginLeft: 5,
            borderRadius: 10,
            backgroundColor: "rgba(147,112,219, .3)",
          }}
        >
          <Text style={styles.skeletonWriting}>genres</Text>
        </View>
      </View>
    );
  };

  const renderFilterItems = () => {
    return content ? (
      <ScrollView horizontal={true} style={{ marginVertical: 5 }}>
        {accountPosts.length ? (
          <TouchableOpacity
            onPress={() => clearFilter()}
            style={{ marginLeft: 5 }}
          >
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
        ) : null }

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
    ) : (
      <ScrollView horizontal={true} style={{ marginVertical: 5 }}>
        {[1, 2, 3, 4, 5].map((i) => itemSkeleton(i))}
      </ScrollView>
    );
  };

  const itemSkeleton = (i) => {
    return (
      <View
        key={i}
        style={{
          marginLeft: 5,
          borderRadius: 10,
          backgroundColor: "rgba(147,112,219, .3)",
        }}
      >
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            color: "transparent",
            textAlign: "center",
            padding: 5,
          }}
        >
          skeleton
        </Text>
      </View>
    );
  };

  const renderFilterTypes = () => {
    return loading ? (
      renderSkeleton()
    ) : accountPosts.length ? (
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
    );
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
        {renderFilterTypes()}
        <MusicInteraction
          content={content}
          favoriteItems={favoriteItems}
          title={title}
          setTheItem={setTheItem}
        />
      </View>
      {renderFilterItems()}
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

  skeletonWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "transparent",
    textAlign: "center",

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
