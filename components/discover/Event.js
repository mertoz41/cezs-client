import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  Animated,
  TouchableOpacity,
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

import Toast from "react-native-toast-message";
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
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      >
        {types.map((type) => (
          <View
            key={type.id}
            style={{
              padding: 2,
              justifyContent: "center",
              marginRight: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                borderWidth: 1,
                borderColor: "#9370DB",
                borderRadius: 10,
                padding: 5,
              }}
            >
              {type.name}
            </Text>
          </View>
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
        <TouchableOpacity
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
        </TouchableOpacity>
        <View style={{ position: "absolute", right: 0 }}>
          <OptionsButton
            deleteAction={deleteEvent}
            item={selectedEvent}
            update={updateAllEvents}
            usage="event"
            color="gray"
          />
        </View>
      </View>
    );
  };

  const renderInstrumentsGenres = () => {
    return (
      <View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              textAlign: "left",
              textDecorationLine: "underline",
              textDecorationColor: "#9370DB",
              margin: 10,
              alignSelf: "center",
            }}
          >
            instruments
          </Text>
          {renderMusicTypes(selectedEvent.instruments)}
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              alignSelf: "center",
              textAlign: "left",
              textDecorationLine: "underline",
              textDecorationColor: "#9370DB",
              margin: 10,
            }}
          >
            genres
          </Text>
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
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              textDecorationLine: "underline",
              textDecorationColor: "#9370DB",
            }}
          >
            address
          </Text>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            horizontal
          >
            <Text style={{ fontSize: 19 }}>{selectedEvent.address}</Text>
          </ScrollView>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              textDecorationLine: "underline",
              textDecorationColor: "#9370DB",
            }}
          >
            time & date
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 19 }}>
              {selectedEvent.event_time} {""}
            </Text>
            <Text style={{ fontSize: 19 }}>
              {getDate(selectedEvent.event_date)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        top: 80,
        width: "96%",
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
          {renderHeader()}
          <View style={{ flexDirection: "row", padding: 10 }}>
            <Avatar
              size={100}
              avatar={
                selectedEvent.user
                  ? selectedEvent.user.avatar
                  : selectedEvent.band.picture
              }
              withRadius={true}
            />
            <Text
              style={{
                fontSize: 23,
                width: "100%",
                flex: 1,
                flexWrap: "wrap",
                marginLeft: 10,
              }}
            >
              {selectedEvent.description}
            </Text>
          </View>
          {renderInstrumentsGenres()}
          {renderTimePlace()}
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
