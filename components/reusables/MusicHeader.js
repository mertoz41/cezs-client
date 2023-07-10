import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { connect } from "react-redux";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");

const MusicHeader = ({ item, goBack, navigate }) => {
  return (
    <View
      style={{
        height: responsiveSizes[height].header,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={() => goBack()}>
            <FontAwesome5
              name="backward"
              size={responsiveSizes[height].backwardIcon}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {item ? (
          <View
            style={{
              display: "flex",
              flex: 5,
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              marginRight: 5,
            }}
          >
            <Text
              style={{
                textAlign: "right",
                color: "white",
                fontSize: responsiveSizes[height].postItemSongFont,
              }}
            >
              {item.name}{" "}
            </Text>
            {item.artist_name || item.album_name ? (
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    textAlign: "right",
                    color: "lightgray",
                    fontSize: responsiveSizes[height].postItemArtistFont,
                    alignSelf: "flex-end",
                  }}
                  onPress={() =>
                    navigate.push("Artist", {
                      name: item.artist_name,
                      id: item.artist_id,
                    })
                  }
                >
                  {item.artist_name}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(MusicHeader);
