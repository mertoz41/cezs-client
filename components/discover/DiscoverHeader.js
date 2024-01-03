import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
import store from "../../redux/store";
import { connect } from "react-redux";

import { BlurView } from "expo-blur";

const EventsHeader = ({
  population,
  gigCount,
  sectionDisplay,
  setSelectedAddress,
  changeSection,
  setNewEvent,
  newEvent,
  selectedMarker,
  currentUser,
  selectedEvent,
}) => {
  const clearState = () => {
    if (selectedMarker) {
      store.dispatch({
        type: "SELECT_MARKER",
        selectedMarker: null,
        markerAccounts: [],
        markerPosts: [],
      });
    }
    if (selectedEvent) {
      store.dispatch({
        type: "SELECT_EVENT",
        selectedEvent: null,
      });
    }
    setNewEvent(false);
    setSelectedAddress(null);
  };

  const newEventAction = () => {
    if (newEvent) {
      setNewEvent(false);
    } else {
      setNewEvent(true);
    }
  };
  const singleOption = (count, type) => {
    return (
      <TouchableOpacity
        onPress={() => changeSection(type)}
        style={{
          borderRadius: 10,
          marginLeft: 5,
        }}
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          <BlurView
            intensity={30}
            tint="dark"
            style={{
              display: "flex",
              backgroundColor:
                sectionDisplay === type
                  ? "rgba(147,112,219, .3)"
                  : "transparent",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              padding: 3,
            }}
          >
            <Text
              style={{
                fontWeight: "500",
                fontSize: 23,
                color: sectionDisplay === type ? "white" : "black",
                paddingHorizontal: 5,
                alignSelf: "center",
              }}
            >
              {type !== "all" && !newEvent && !selectedMarker && !selectedEvent
                ? `${count} `
                : null}
              {`${type}${selectedEvent ? `'s upcoming gig` : ""}`}
            </Text>
          </BlurView>
        </View>
      </TouchableOpacity>
    );
  };
  const renderFilterOptions = () => {
    const renderNewButton = () => {
      return (
        <TouchableOpacity
          onPress={() => newEventAction()}
          style={{
            alignSelf: "flex-end",
            marginRight: 5,
          }}
        >
          <View
            style={{
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <BlurView
              intensity={sectionDisplay === "musicians" ? 0 : 30}
              tint="dark"
              style={{
                display: "flex",
                backgroundColor:
                  sectionDisplay === "musicians"
                    ? "transparent"
                    : "rgba(147,112,219, .3)",

                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                padding: 3,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 23,
                  color: "white",
                  paddingHorizontal: 5,
                  alignSelf: "center",
                }}
              >
                {newEvent ? "cancel" : "new"}
              </Text>
            </BlurView>
          </View>
        </TouchableOpacity>
      );
    };

    const mapSelectionHeader = (title) => {
      return (
        <View
          style={{
            borderRadius: 10,
            marginLeft: 5,
          }}
        >
          <View
            style={{
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <BlurView
              intensity={30}
              tint="dark"
              style={{
                display: "flex",
                backgroundColor: "transparent",

                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                padding: 3,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 23,
                  color: "black",
                  paddingHorizontal: 5,
                  alignSelf: "center",
                }}
              >
                {title}
              </Text>
            </BlurView>
          </View>
        </View>
      );
    };

    const renderCloseButton = () => {
      return (
        <TouchableOpacity
          onPress={() => clearState()}
          style={{
            alignSelf: "flex-end",
            marginRight: 5,
          }}
        >
          <View
            style={{
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <BlurView
              intensity={30}
              tint="dark"
              style={{
                display: "flex",
                backgroundColor:
                  sectionDisplay === "musicians"
                    ? "transparent"
                    : "rgba(147,112,219, .3)",

                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                padding: 3,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 23,
                  color: "white",
                  paddingHorizontal: 5,
                  alignSelf: "center",
                }}
              >
                clear
              </Text>
            </BlurView>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {newEvent ? mapSelectionHeader("new gig") : null}
              {selectedMarker ? mapSelectionHeader(selectedMarker.city) : null}
              {selectedEvent
                ? mapSelectionHeader(
                    `${
                      selectedEvent.user
                        ? selectedEvent.user.username
                        : selectedEvent.band.name
                    }'s upcoming gig`
                  )
                : null}
              {newEvent || selectedMarker || selectedEvent ? null : (
                <>
                  {singleOption("0", "all")}
                  {singleOption(population, "musicians")}
                  {singleOption(gigCount, "gigs")}
                </>
              )}
            </View>
            {selectedMarker || selectedEvent ? renderCloseButton() : null}
            {sectionDisplay === "gigs" && !selectedEvent
              ? renderNewButton()
              : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.header}>
      {currentUser.location ? renderFilterOptions() : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    height: responsiveSizes[height].header,
    // width: "100%",
    // alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    zIndex: 1,
  },
  menuItems: {
    padding: 5,
  },
  menuWriting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  selectedMenuWriting: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
  },
});
const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  selectedMarker: state.selectedMarker,
  selectedEvent: state.selectedEvent,
});

export default connect(mapStateToProps)(EventsHeader);
