import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Avatar from "../reusables/Avatar";
import { BlurView } from "expo-blur";
import { connect } from "react-redux";
// import { Avatar } from "react-native-elements";
import dateFormat from "dateformat";
import { API_ROOT } from "../../constants";
import store from "../../redux/store";
import OptionsButton from "../reusables/OptionsButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveSizes } from "../../constants/reusableFunctions";
import Toast from "react-native-toast-message";
const { height } = Dimensions.get("window");
import BlurryBubble from "../reusables/BlurryBubble";
const Event = ({
  selectedEvent,
  updateAllEvents,
  navigateToPerformer,
  currentUser,
}) => {
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);
  const getDate = (date) => {
    const deyt = dateFormat(date, "fullDate").split(", ");
    return `${deyt[0]}, ${deyt[1]}`;
  };
  const renderMusicTypes = (types) => {
    return (
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          alignSelf: "center",
        }}
      >
        {types.map((type) => (
          <BlurryBubble
            marginRight={10}
            key={type.id}
            marginLeft={0}
            radius={10}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,

                  padding: 5,
                }}
              >
                {type.name}
              </Text>
            </View>
          </BlurryBubble>
        ))}
      </ScrollView>
    );
  };
  const deleteEvent = async (event) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/events/${event.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        updateAllEvents(event);
        if (currentUser.upcoming_event?.id === event.id) {
          let updatedCurrentUser = { ...currentUser, upcoming_event: null };
          store.dispatch({
            type: "UPDATE_CURRENT_USER",
            currentUser: updatedCurrentUser,
          });
        }
        Toast.show({
          type: "success",
          text1: "Your event is deleted.",
        });
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const renderHeader = () => {
    return (
      <View style={{ justifyContent: "center" }}>
        {/* <TouchableOpacity
          onPress={() =>
            navigateToPerformer(
              selectedEvent.user ? selectedEvent.user : selectedEvent.band
            )
          }
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "500",
              textDecorationLine: "underline",
              textAlign: "center",

              textDecorationColor: "#9370DB",
            }}
          >
            {selectedEvent.user
              ? selectedEvent.user.username
              : selectedEvent.band.name}
          </Text>
        </TouchableOpacity> */}
        <View style={{ position: "absolute", right: 0 }}></View>
      </View>
    );
  };

  const renderInstrumentsGenres = () => {
    return (
      <View style={{marginLeft: 10, marginTop: 10}}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={responsiveSizes[height].sectionTitleDark}>
            instruments
          </Text>
          {renderMusicTypes(selectedEvent.instruments)}
        </View>
        <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
          <Text style={responsiveSizes[height].sectionTitleDark}>genres</Text>
          {renderMusicTypes(selectedEvent.genres)}
        </View>
      </View>
    );
  };
  const renderTimePlace = () => {
    return (
      <View style={{ marginTop: 5, margin: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={responsiveSizes[height].sectionTitleDark}>address</Text>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
            }}
            horizontal
          >
            <BlurryBubble marginRight={0} marginLeft={10} radius={10}>
              <Text style={{ fontSize: 19, padding: 5 }}>
                {selectedEvent.address}
              </Text>
            </BlurryBubble>
          </ScrollView>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={responsiveSizes[height].sectionTitleDark}>
            time & date
          </Text>
          <BlurryBubble marginRight={0} marginLeft={10} radius={10}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 19, padding: 5 }}>
                {selectedEvent.event_time} {""}
              </Text>
              <Text style={{ fontSize: 19, padding: 5 }}>
                {getDate(selectedEvent.event_date)}
              </Text>
            </View>
          </BlurryBubble>
        </View>
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        top: 80,
        width: "97%",
        alignSelf: "center",
        position: "absolute",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        borderRadius: 10,
        zIndex: 1,
        opacity: translation,
      }}
    >
      <BlurView intensity={20} tint="dark">
        <View
          style={{
            flex: 1,
          }}
        >
          <View style={{ paddingTop: 20 }}>
            <View
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                right: 6,
                // marginRight: 10,
              }}
            >
              <OptionsButton
                deleteAction={deleteEvent}
                item={selectedEvent}
                update={updateAllEvents}
                usage="event"
                color="gray"
              />
            </View>

            <TouchableOpacity
              onPress={() =>
                navigateToPerformer(
                  selectedEvent.user ? selectedEvent.user : selectedEvent.band
                )
              }
            >
              <Avatar
                size={responsiveSizes[height].avatar}
                avatar={
                  selectedEvent.user
                    ? selectedEvent.user.avatar
                    : selectedEvent.band.picture
                }
                withRadius={true}
              />
            </TouchableOpacity>
            <View style={{ height: 10 }}></View>
            <BlurryBubble marginRight={10} marginLeft={10} radius={20}>
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: 600,
                  margin: 10,
                  flexWrap: "wrap",
                }}
              >
                {selectedEvent.description}
              </Text>
            </BlurryBubble>
            {renderInstrumentsGenres()}
            {renderTimePlace()}
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const mapStateToProps = (state) => ({
  selectedEvent: state.selectedEvent,
  currentUser: state.currentUser,
});
export default connect(mapStateToProps)(Event);
