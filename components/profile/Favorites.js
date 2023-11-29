import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
const { height } = Dimensions.get("window");
import { responsiveSizes } from "../../constants/reusableFunctions";
import BlurryBubble from "../reusables/BlurryBubble";
const Favorites = ({ currentUser, theUser, toMusicPage }) => {
  const [likedArtists, setLikedArtists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  useEffect(() => {
    setLikedArtists(theUser.favoriteartists);
    setLikedSongs(theUser.favoritesongs);
  }, [currentUser, theUser]);

  const renderFavorites = (type, items) => {
    const renderFavoriteItem = (item) => {
      return (
        <BlurryBubble marginLeft={10} radius={10}>
          <TouchableOpacity
            style={styles.item}
            key={item.id}
            onPress={() => toMusicPage(item)}
          >
            <Text style={styles.mainWriting}>
              {item.name}
              {item.artist_name && (
                <Text style={styles.secondaryWriting}>
                  <Text
                    style={{
                      fontSize: responsiveSizes[height].sliderItemFontSize,
                      color: "#9370DB",
                      textAlign: "left",
                    }}
                  >
                    {" "}
                    /{" "}
                  </Text>
                  {item.artist_name}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </BlurryBubble>
      );
    };
    return (
      <View style={{ flex: 1 }}>
        <Text style={responsiveSizes[height].sectionTitle}>
          favorite {type}
        </Text>
        <ScrollView horizontal={true}>
          {items.map((item) => renderFavoriteItem(item))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View>
      {likedArtists.length ? renderFavorites("artists", likedArtists) : null}
      {likedSongs.length ? renderFavorites("songs", likedSongs) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
    display: "flex",
    flexDirection: "row",
  },

  item: {
    borderWidth: 1,
    borderColor: "#9370DB",
    flexDirection: "row",
    // marginLeft: 10,
    borderRadius: 10,
    // marginBottom: 10,
    padding: 5,
  },

  title: {
    color: "white",
    marginHorizontal: 10,
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    alignSelf: "left",
  },

  mainWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
  },
  secondaryWriting: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "darkgray",
    textAlign: "left",
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(React.memo(Favorites));
