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
import Avatar from "../components/reusables/Avatar";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../constants/index";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import { responsiveSizes } from "../../constants/reusableFunctions";
import MusicFilters from "./MusicFilters";

const SearchResults = () => {
  return (
    <ScrollView>
      {searchingFor !== "posts" ? renderInputSection() : null}
      {dataLoading ? (
        <ActivityIndicator
          color="gray"
          size="large"
          style={{ marginTop: 10 }}
        />
      ) : null}
      {/* {renderMusicFilters()} */}
      {searchingFor === "posts" ||
      searchingFor === "users" ||
      searchingFor === "bands" ? (
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={responsiveSizes[height].sectionTitle}>
              {selectedInstruments.length || selectedGenres.length
                ? "result"
                : "most recent"}
            </Text>
            {loading ? (
              <ActivityIndicator style={{ marginRight: 10 }} size={"small"} />
            ) : null}
          </View>
          {renderPostResults()}
        </View>
      ) : null}
      {searchingFor === "artists"
        ? displayNotFound
          ? renderNotFoundMessage()
          : result.length
          ? renderMusicResult(result, toArtistPage)
          : renderMostSection(artistViews, artistPosts, toArtistPage)
        : null}
      {searchingFor === "songs"
        ? displayNotFound
          ? renderNotFoundMessage()
          : result.length
          ? renderMusicResult(result, selection)
          : renderMostSection(songViews, songPosts, selection)
        : null}
    </ScrollView>
  );
};

export default SearchResults;
