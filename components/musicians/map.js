import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import store from "../../redux/store";
import { API_ROOT } from "../../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { width, height } = Dimensions.get("window");

const Map = ({
  displayedEvents,
  currentUser,
  newAudition,
  locationMarkers,
  sectionDisplay,
  navigateToPerformer,
  notiEvent,
  selectedAddress,
  newEvent,
  selectedMarker,
  _map,
}) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // only handling notifications
    // if (notiEvent && notiEvent.event_id) {
    //   toSelectedAddress(notiEvent);
    // } else if (notiEvent && notiEvent.audition_id) {
    //   let obj = {
    //     id: notiEvent.location_id,
    //     latitude: notiEvent.latitude,
    //     longitude: notiEvent.longitude,
    //     city: notiEvent.city,
    //   };
    //   fetchAuditions(obj);
    // }
  }, []);

  const toSelectedAddress = (address) => {
    _map.current.animateToRegion(
      {
        latitude: address.latitude + 0.0,
        longitude: address.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      5000
    );
  };
  const fetchMarker = async (marker) => {
    setLoading(true);
    let token = await AsyncStorage.getItem("jwt");
    _map.current.animateToRegion(
      {
        latitude: marker.latitude - 0.0,
        longitude: marker.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.01,
      },
      1000
    );

    fetch(`http://${API_ROOT}/locations/${marker.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let combinedPosts = [];
        resp.users.forEach((user) => {
          user.posts.forEach((post) => combinedPosts.push(post));
        });
        resp.bands.forEach((band) => {
          band.posts.forEach((post) => combinedPosts.push(post));
        });
        let sorted = combinedPosts.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        let joinedAccounts = resp.users.concat(resp.bands);

        store.dispatch({
          type: "SELECT_MARKER",
          selectedMarker: marker,
          markerAccounts: joinedAccounts,
          markerPosts: sorted,
        });
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const renderSelectedMarker = (event) => {
    _map.current.animateToRegion(
      {
        latitude: event.latitude,
        longitude: event.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.01,
      },
      1000
    );
    store.dispatch({ type: "SELECT_EVENT", selectedEvent: event });
  };

  const markerDisplay = (evnt, index) => {
    return (
      <Marker
        coordinate={{
          latitude: evnt.latitude,
          longitude: evnt.longitude,
        }}
        onPress={() => renderSelectedMarker(evnt)}
        key={index}
      ></Marker>
    );
  };
  return (
    <View style={styles.map}>
      <MapView
        style={styles.map}
        ref={_map}
        initialRegion={{
          latitude: parseFloat(currentUser.location.latitude),
          longitude: parseFloat(currentUser.location.longitude),
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}
      >
        {sectionDisplay == "musicians" && !newEvent
          ? locationMarkers.map((mark, i) => {
              return (
                <Marker
                  key={i}
                  coordinate={{
                    latitude: mark.latitude,
                    longitude: mark.longitude,
                  }}
                  onPress={() => fetchMarker(mark)}
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
                        height: responsiveSizes[height].locationButtonHeight,
                        width: responsiveSizes[height].locationButtonWidth,
                        backgroundColor: "rgba(147,112,219, .3)",
                        justifyContent: "center",
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator size="large" />
                      ) : (
                        <Text style={styles.markerWriting}>
                          {mark.musician_count}
                        </Text>
                      )}
                    </BlurView>
                  </View>
                </Marker>
              );
            })
          : null}
        {!newEvent && !newAudition && sectionDisplay !== "musicians"
          ? displayedEvents.map((audition, index) =>
              markerDisplay(audition, index)
            )
          : null}
        {selectedAddress ? (
          <Marker
            coordinate={{
              latitude: selectedAddress.latitude,
              longitude: selectedAddress.longitude,
            }}
          />
        ) : null}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  markerWriting: {
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: responsiveSizes[height].locationButtonFontSize,
  },
});
const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  selectedMarker: state.selectedMarker,
});
export default connect(mapStateToProps)(Map);
