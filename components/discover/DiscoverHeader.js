import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
import { Tooltip } from "react-native-elements";
import store from "../../redux/store";
import { connect } from "react-redux";

import { BlurView } from "expo-blur";
import Logo from "../../assets/cezslogo.png";

const EventsHeader = ({
  population,
  gigCount,
  auditionCount,
  newAudition,
  setNewAudition,
  sectionDisplay,
  setSelectedAddress,
  changeSection,
  setNewEvent,
  navigation,
  newEvent,
  selectedMarker,
  currentUser,
  selectedEvent,
}) => {
  const displayRef = useRef(null);
  const composeRef = useRef(null);

  const selectSection = (section) => {
    displayRef.current.toggleTooltip();
    changeSection(section);
  };

  const newPostNavigate = () => {
    composeRef.current.toggleTooltip();
    navigation.navigate("Camera");
  };

  const renderTypeOption = (type) => {
    const getTypeCount = (type) => {
      switch (type) {
        case "musicians":
          return population;
        case "gigs":
          return gigCount;
        case "auditions":
          return auditionCount;
      }
    };
    return (
      <TouchableOpacity
        style={styles.menuItems}
        onPress={() => selectSection(type)}
      >
        <Text
          style={{
            fontSize: responsiveSizes[height].discoverFilterSize,
            fontWeight: "700",
          }}
        >
          {getTypeCount(type)} {type}
        </Text>
      </TouchableOpacity>
    );
  };
  const newGig = () => {
    composeRef.current.toggleTooltip();
    setNewEvent(true);
  };
  const nuAudition = () => {
    composeRef.current.toggleTooltip();
    setNewAudition(true);
  };
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
    setNewAudition(false);
    setNewEvent(false);
    setSelectedAddress(null);
  };
  const renderFilterOptions = () => {
    return (
      <Tooltip
        withOverlay={false}
        ref={displayRef}
        withPointer={false}
        containerStyle={{
          backgroundColor: "transparent",
          left: 0,
          width: "auto",
          height: "auto",
        }}
        popover={
          <View
            style={{
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <BlurView
              intensity={20}
              tint="dark"
              style={{
                padding: 5,
                // backgroundColor: "rgba(147,112,219, .3)",
              }}
            >
              {sectionDisplay === "musicians"
                ? null
                : renderTypeOption("musicians")}
              {sectionDisplay === "gigs" ? null : renderTypeOption("gigs")}
              {sectionDisplay === "auditions"
                ? null
                : renderTypeOption("auditions")}
            </BlurView>
          </View>
        }
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          <BlurView
            intensity={20}
            tint="dark"
            style={{
              padding: 5,
              alignSelf: "flex-start",
              display: "flex",
              flexDirection: "row",
              // backgroundColor: "rgba(147,112,219, .3)",
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: responsiveSizes[height].discoverFilterSize,
                alignSelf: "center",
              }}
            >
              {sectionDisplay === "musicians"
                ? population
                : sectionDisplay === "gigs"
                ? gigCount
                : auditionCount}{" "}
              {sectionDisplay}
            </Text>
          </BlurView>
        </View>
      </Tooltip>
    );
  };
  const renderActionsMenu = () => {
    const actionButton = (action, title) => {
      return (
        <TouchableOpacity style={styles.menuItems} onPress={() => action()}>
          <Text
            style={{
              fontSize: responsiveSizes[height].discoverFilterSize,
              fontWeight: "700",
              textAlign: "right",
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <Tooltip
        ref={composeRef}
        overlayColor="transparent"
        withPointer={false}
        containerStyle={{
          backgroundColor: "transparent",
          right: 0,
          width: "auto",
          height: "auto",
        }}
        pointerColor="rgba(46,46,46, .9)"
        popover={
          <View
            style={{
              overflow: "hidden",
              borderRadius: 10,
              alignSelf: "flex-end",
            }}
          >
            <BlurView
              intensity={20}
              tint="dark"
              style={{
                padding: 5,
                // backgroundColor: "rgba(147,112,219, .3)",
              }}
            >
              {actionButton(newPostNavigate, "post")}
              {currentUser.location ? (
                <>
                  {actionButton(newGig, "gig")}
                  {actionButton(nuAudition, "audition")}
                </>
              ) : null}
            </BlurView>
          </View>
        }
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: "50%",
          }}
        >
          <BlurView
            intensity={20}
            tint="dark"
            style={{
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="add"
              size={responsiveSizes[height].discoverAddButton}
              color={currentUser.location ? "black" : "white"}
            />
          </BlurView>
        </View>
      </Tooltip>
    );
  };
  const renderNewEventLabel = () => (
    <View
      style={{
        backgroundColor: "rgba(147,112,219, .3)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <BlurView
        intensity={20}
        tint="dark"
        style={{
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: responsiveSizes[height].discoverFilterSize,
          }}
        >
          {newEvent ? "new gig" : "new audition"}
        </Text>
      </BlurView>
    </View>
  );
  const renderLeftSide = () => {
    return (
      <>
        {newEvent || newAudition
          ? renderNewEventLabel()
          : renderFilterOptions()}
      </>
    );
  };
  return (
    <View style={styles.header}>
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          display: "flex",
        }}
      >
        {currentUser.location ? renderLeftSide() : null}
      </View>

      <View
        style={{
          display: "flex",
          borderRadius: 10,
          flex: 1,
        }}
      >
        {!currentUser.location ? null : (
          <TouchableOpacity onPress={() => navigation.navigate("Upload")}>
            <Image
              source={Logo}
              style={{
                height: responsiveSizes[height].logoHeight,
                width: responsiveSizes[height].logoWidth,
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "flex-end",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {newEvent ||
        newAudition ||
        selectedEvent ||
        (selectedMarker && sectionDisplay === "musicians") ? (
          <TouchableOpacity
            style={{
              borderRadius: "50%",
              overflow: "hidden",
            }}
            onPress={() => clearState()}
          >
            <BlurView
              intensity={20}
              tint="dark"
              style={{
                justifyContent: "center",
                backgroundColor: "rgba(147,112,219, .4)",
              }}
            >
              <MaterialIcons
                name="close"
                size={responsiveSizes[height].discoverAddButton}
                color="white"
              />
            </BlurView>
          </TouchableOpacity>
        ) : (
          renderActionsMenu()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    height: responsiveSizes[height].header,
    width: "96%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    // backgroundColor: "red",
    justifyContent: "space-between",
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
