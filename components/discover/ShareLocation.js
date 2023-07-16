import React, { useState } from "react";
import store from "../../redux/store";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { HERE_API_KEY } from "@env";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_ROOT } from "../../constants";
import { connect } from "react-redux";

const ShareLocation = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);

  const findCoordinates = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      setLoading(false);
      return;
    }
    let location = await Location.getCurrentPositionAsync({});

    let userLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    getCityState(userLocation);
  };
  const getCityState = (location) => {
    fetch(
      `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=YOQNPW6X0YomatyblsMiCWD7m2F_sirWAV4upk3e0l4&mode=retrieveAddresses&prox=${location.latitude},${location.longitude}`
    )
      .then((resp) => resp.json())
      .then((resp) => {
        getCityStateCoords(
          resp.Response.View[0].Result[0].Location.Address.City,
          resp.Response.View[0].Result[0].Location.Address.State,
          resp.Response.View[0].Result[0].Location.Address.City +
            ", " +
            resp.Response.View[0].Result[0].Location.Address.State
        );
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const getCityStateCoords = (city, state, cityStateName) => {
    fetch(
      `https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=YOQNPW6X0YomatyblsMiCWD7m2F_sirWAV4upk3e0l4&searchtext=${city}+${state}`
    )
      .then((resp) => resp.json())
      .then((resp) => {
        saveLocation(
          {
            latitude:
              resp.Response.View[0].Result[0].Location.DisplayPosition.Latitude,
            longitude:
              resp.Response.View[0].Result[0].Location.DisplayPosition
                .Longitude,
          },
          cityStateName
        );
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const saveLocation = async (cityStateCoords, cityStateName) => {
    let locationObj = {
      ...cityStateCoords,
      city: cityStateName,
    };
    let token = await AsyncStorage.getItem("jwt");

    fetch(`http://${API_ROOT}/locations`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(locationObj),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let user = { ...currentUser, location: resp.user.location };
        store.dispatch({ type: "UPDATE_CURRENT_USER", currentUser: user });
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  return (
    <View
      style={{
        top: 80,
        margin: 10,
      }}
    >
      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <TouchableOpacity onPress={() => findCoordinates()}>
          <Text
            style={{
              fontSize: 25,
              color: "white",
              padding: 10,
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <Text style={{ textDecorationLine: "underline" }}>
              share your location{" "}
            </Text>
            to discover musicians and gigs around you
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(ShareLocation);
