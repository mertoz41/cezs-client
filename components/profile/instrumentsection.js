import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Avatar from "../reusables/Avatar";
import { connect } from "react-redux";
import Favorites from "./Favorites";
const { height } = Dimensions.get("window");
import { responsiveSizes } from "../../constants/reusableFunctions";
import BlurryBubble from "../reusables/BlurryBubble";
const InstrumentSection = ({
  toBandPage,
  toUserPage,
  instruments,
  genres,
  bands,
  members,
  theUser,
}) => {
  renderTitle = (title, items) => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ justifyContent: "space-between" }}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>{title}</Text>
          </View>
          <View style={{ flex: 3 }}>
            <ScrollView horizontal={true}>
              {items.map((item, index) => {
                return (
                  <BlurryBubble marginRight={0} radius={10} key={index} marginLeft={10}>
                    <View style={styles.instrumentItem}>
                      <Text style={responsiveSizes[height].sliderItem}>
                        {item.name}
                      </Text>
                    </View>
                  </BlurryBubble>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };
  renderWithAvatar = (title, items) => {
    isBand = () => {
      return title === "bands" ? true : false;
    };
    return (
      <View style={styles.section}>
        <View style={{ justifyContent: "space-between" }}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitle}>{title}</Text>
          </View>

          <View style={{ flex: 3 }}>
            <ScrollView horizontal={true}>
              {items.map((item, index) => (
                <BlurryBubble marginRight={0} key={index} radius={10} marginLeft={10}>
                  <TouchableOpacity
                    style={styles.instrumentItem}
                    onPress={() =>
                      item.username ? toUserPage(item) : toBandPage(item)
                    }
                  >
                    <View style={styles.itemTop}>
                      <Avatar
                        avatar={item.picture ? item.picture : item.avatar}
                        size={responsiveSizes[height].bandMemberAvatar}
                        withRadius={true}
                      />
                    </View>
                    <View style={styles.itemBottom}>
                      <Text
                        style={{
                          fontSize: responsiveSizes[height].sliderItemFontSize,
                          color: "white",
                          textAlign: "center",
                          borderWidth: responsiveSizes[height].borderWidth,
                          borderColor: "gray",
                          borderRadius: 10,
                          padding: 5,
                        }}
                      >
                        {item.username ? item.username : item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </BlurryBubble>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection:
            instruments?.length > 2 && genres?.length > 2 ? "column" : "row",
        }}
      >
        {instruments?.length ? renderTitle("instruments", instruments) : null}
        {genres?.length ? renderTitle("genres", genres) : null}
      </View>
      {!members?.length ? (
        theUser?.favoritesongs.length || theUser?.favoriteartists.length ? (
          <Favorites theUser={theUser} toMusicPage={() => {}} />
        ) : null
      ) : null}

      {bands?.length ? renderWithAvatar("bands", bands) : null}
      {members?.length ? renderWithAvatar("members", members) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
  },
  itemTop: {
    height: "auto",
    alignSelf: "center",
    zIndex: 1
  },
  instrumentItem: {
    // marginLeft: 5,
  },
  itemBottom: {
    // backgroundColor: "yellow",
    // alignSelf: "center",
    zIndex: 5
  },

  section: {
    marginBottom: 0,
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(InstrumentSection);
