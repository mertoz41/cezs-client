import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";
import Avatar from "../reusables/Avatar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HERE_API_KEY } from "@env";
import { connect } from "react-redux";
import { reusableStyles } from "../../themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../../constants/index";
import store from "../../redux/store";
import { BlurView } from "expo-blur";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const NewEvent = ({
  currentUser,
  _map,
  newAudition,
  setNewEvent,
  setNewAudition,
  addNewEventToLists,
  newEvent,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [addressInput, setAddressInput] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [eventInstruments, setEventInstruments] = useState([]);
  const [eventGenres, setEventGenres] = useState([]);
  const [selectedPerformer, setSelectedPerformer] = useState(null);

  const [result, setResult] = useState([]);
  const [searching, setSearching] = useState("");
  const [genreSearch, setGenreSearch] = useState("");
  const [genreResult, setGenreResult] = useState([]);
  const [instrumentResult, setInstrumentResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setSelectedPerformer(currentUser);
  }, []);
  const getAddress = (text) => {
    setAddressInput(text);
    if (addressInput.length > 2) {
      fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${addressInput}&apiKey=${HERE_API_KEY}`
      )
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.items && resp.items.length) {
            let mappedResult = resp.items.map((item) => ({
              houseNumber: item.address.houseNumber,
              street: item.address.street,
              city: item.address.city,
              stateCode: item.address.stateCode,
              countryName: item.address.countryName,
              latitude: item.position.lat,
              longitude: item.position.lng,
            }));
            if (mappedResult.length) {
              setResult(mappedResult);
            }
          }
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    }
  };

  const clearNewEvent = () => {
    setNewAudition(false);
    setNewEvent(false);
    setSelectedAddress(null);
    setAddressInput("");
    setDescription("");
    setTime(new Date());
    setDate(new Date());
  };

  const selectingInstrument = (inst) => {
    newEventInstrument(inst);
    setInstrumentResult([]);
    setSearching("");
    Keyboard.dismiss();
  };

  const newEventInstrument = (inst) => {
    if (eventInstruments.includes(inst)) {
      let filtered = eventInstruments.filter((item) => item !== inst);
      setEventInstruments(filtered);
    } else {
      let updated = [...eventInstruments, inst];
      setEventInstruments(updated);
    }
  };

  const selectingGenre = (genr) => {
    newEventGenre(genr);
    setGenreSearch("");
    setGenreResult([]);
    Keyboard.dismiss();
  };

  const searchInstruments = async (text) => {
    setSearching(text);
    if (text.length) {
      let token = await AsyncStorage.getItem("jwt");

      fetch(`http://${API_ROOT}/instrumentsearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searching: text }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setInstrumentResult(resp.instruments);
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    }
  };

  const searchGenres = async (text) => {
    setGenreSearch(text);
    let token = await AsyncStorage.getItem("jwt");
    if (text.length) {
      fetch(`http://${API_ROOT}/genresearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searching: text }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setGenreResult(resp.genres);
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    }
  };
  const toLocation = (location) => {
    setSelectedAddress(location);
    setAddressInput(
      `${location.houseNumber} ${location.street} ${location.city}, ${location.stateCode}`
    );
    setResult([]);
    _map.current.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.01,
      },
      5000
    );
  };

  const updateDescription = (text) => {
    if (text.length <= 100) {
      setDescription(text);
    }
  };

  const newEventGenre = (genr) => {
    if (eventGenres.includes(genr)) {
      let filtered = eventGenres.filter((item) => item !== genr);
      setEventGenres(filtered);
    } else {
      let updated = [...eventGenres, genr];
      setEventGenres(updated);
    }
  };

  const dateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const timeChange = (event, selectedTime) => {
    setTime(selectedTime);
  };
  const clearSelectedAddress = () => {
    setSelectedAddress(null);
    setAddressInput("");
  };

  const saveEvent = () => {
    if (description.length < 5) {
      alert("description not long enough");
    } else if (currentUser.bands.length && !selectedPerformer) {
      alert("choose a performer");
    } else if (!selectedAddress && newEvent) {
      alert("specify the address");
    } else {
      setLoading(true);
      postEvent();
    }
  };

  const postEvent = async () => {
    let token = await AsyncStorage.getItem("jwt");
    let selectedGenres = eventGenres.map((genr) => genr.name);
    let selectedInstruments = eventInstruments.map((inst) => inst.name);
    let obj = {
      description: description,
      userId: !selectedPerformer?.username ? null : currentUser.id,
      bandId: selectedPerformer?.username ? null : selectedPerformer.id,
      eventDate: date,
      eventTime: `${time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      address: addressInput,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      instruments: selectedInstruments,
      genres: selectedGenres,
      isAudition: newAudition,
    };
    fetch(`http://${API_ROOT}/events`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        // change section display to type of event that is posted,
        // update that event into all store as well as displayedEvents

        Toast.show({
          type: "success",
          text1: "success",
          text2: `Your ${newAudition ? "audition" : "gig"} is posted`,
        });
        addNewEventToLists(resp.event);
        clearNewEvent();

        let updatedCurrentUser = { ...currentUser, upcoming_event: resp.event };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        Toast.show({ type: "error", text1: err.message });
      });
  };

  const renderAddress = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitleDark}>
              address
            </Text>
          </View>
          {selectedAddress ? (
            <View
              style={{
                flex: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    color: "black",
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    fontWeight: "500",
                  }}
                >
                  {selectedAddress.houseNumber} {selectedAddress.street}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                    fontWeight: "500",
                  }}
                >
                  {selectedAddress.city}, {selectedAddress.stateCode},{" "}
                  {selectedAddress.countryName}
                </Text>
              </View>
              <TouchableOpacity onPress={() => clearSelectedAddress()}>
                <MaterialIcons name="close" size={30} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 5 }}>
              <TextInput
                multiline
                placeholder={"search address"}
                placeholderTextColor="gray"
                value={addressInput}
                autoCapitalize="none"
                style={{
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                  // color: "white",
                  fontWeight: "500",
                }}
                onChangeText={(text) => getAddress(text)}
              />
              {result?.length ? (
                <ScrollView
                  keyboardShouldPersistTaps={"always"}
                  style={{
                    borderTopWidth: "1px",
                    borderTopColor: "#9370DB",
                    height: 200,
                  }}
                >
                  {result.map((item, index) => (
                    <ListItem
                      key={index}
                      bottomDivider
                      onPress={() => toLocation(item)}
                      containerStyle={{
                        backgroundColor: "transparent",
                      }}
                    >
                      <ListItem.Content>
                        <ListItem.Title style={{ color: "black" }}>
                          {item.houseNumber} {item.street}
                        </ListItem.Title>
                        <ListItem.Subtitle style={{ color: "gray" }}>
                          {item.city}, {item.stateCode}, {item.countryName}
                        </ListItem.Subtitle>
                      </ListItem.Content>
                    </ListItem>
                  ))}
                </ScrollView>
              ) : null}
            </View>
          )}
        </View>
      </View>
    );
  };
  const renderPerformerOptions = () => {
    return (
      <View style={{ marginLeft: 10 }}>
        {currentUser.bands.length ? (
          <View
            style={{
              zIndex: 1,
              height: "auto",
            }}
          >
            <Text
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                fontWeight: "600",
                textDecorationLine: "underline",
                textDecorationColor: "#9370DB",
              }}
            >
              {newEvent ? "performer" : "for"}
            </Text>
            <ScrollView horizontal={true} style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  alignItems: "center",
                  backgroundColor:
                    selectedPerformer == currentUser
                      ? "rgba(147,112,219, .6)"
                      : "transparent",
                  borderWidth: responsiveSizes[height].borderWidth,
                  borderRadius: 10,
                  padding: 5,
                  borderColor:
                    selectedPerformer == currentUser
                      ? "rgba(147,112,219, .6)"
                      : "transparent",
                }}
                onPress={() => setSelectedPerformer(currentUser)}
              >
                <Avatar
                  avatar={currentUser.avatar}
                  size={responsiveSizes[height].newEventAvatarSize}
                  withRadius={true}
                />

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: responsiveSizes[height].sliderItemFontSize,
                  }}
                >
                  {currentUser.username}
                </Text>
              </TouchableOpacity>
              {currentUser.bands.map((band, i) => (
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    alignItems: "center",
                    borderWidth: responsiveSizes[height].borderWidth,
                    backgroundColor:
                      selectedPerformer == band
                        ? "rgba(147,112,219, .6)"
                        : "transparent",

                    borderRadius: 10,
                    padding: 5,
                    borderColor:
                      selectedPerformer == band
                        ? "rgba(147,112,219, .6)"
                        : "transparent",
                  }}
                  key={i}
                  onPress={() => setSelectedPerformer(band)}
                >
                  <Avatar
                    avatar={band.picture}
                    size={responsiveSizes[height].newEventAvatarSize}
                    withRadius={true}
                  />

                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: responsiveSizes[height].sliderItemFontSize,
                    }}
                  >
                    {band.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
    );
  };

  const removeInstrument = (inst) => {
    let filtered = eventInstruments.filter(
      (instrument) => instrument.name !== inst.name
    );
    setEventInstruments(filtered);
  };

  const removeGenre = (genr) => {
    let filtered = eventGenres.filter((genre) => genre.name !== genr.name);
    setEventGenres(filtered);
  };

  const renderDescription = () => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitleDark}>
              description
            </Text>
          </View>
          <View style={{ flex: 5 }}>
            <TextInput
              multiline
              placeholder={"brief description of the event"}
              placeholderTextColor="gray"
              value={description}
              autoCapitalize="none"
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                fontWeight: "500",
              }}
              onChangeText={(text) => updateDescription(text)}
            />

            <Text
              style={{
                position: "absolute",
                color: "gray",
                right: 0,
              }}
            >
              {description?.length}/100
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const renderMusicSection = (
    title,
    value,
    select,
    search,
    searchResult,
    selected,
    remove
  ) => {
    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <Text style={responsiveSizes[height].sectionTitleDark}>
              {title}
            </Text>
          </View>
          <View style={{ flex: 5 }}>
            {value.length > 3 ? (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  borderRadius: "50%",
                  zIndex: 1,
                }}
                onPress={() => select({ name: value })}
              >
                <AntDesign name="plus" size={27} color="gray" />
              </TouchableOpacity>
            ) : null}
            <TextInput
              multiline
              placeholder={`add ${title}`}
              placeholderTextColor="gray"
              value={value}
              autoCapitalize="none"
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                color: "black",
                fontWeight: "500",
              }}
              onChangeText={(text) => search(text)}
            />
            {searchResult.length ? (
              <ScrollView
                style={{
                  borderTopWidth: "1px",
                  borderTopColor: "#9370DB",
                  height: 200,
                }}
                keyboardShouldPersistTaps={"always"}
              >
                {searchResult.map((item, index) => (
                  <ListItem
                    key={index}
                    bottomDivider
                    onPress={() => select(item)}
                    containerStyle={{
                      backgroundColor: "transparent",
                      justifyContent: "center",
                    }}
                  >
                    <ListItem.Content>
                      <ListItem.Title>
                        {item.username ? item.username : item.name}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>
        <ScrollView style={{ marginVertical: 5 }} horizontal={true}>
          {selected.map((item, index) => (
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(147,112,219, .6)",
                borderRadius: 10,
                padding: 5,
                marginLeft: index === 0 ? 0 : 5,
              }}
              key={index}
              onPress={() => remove(item)}
            >
              <Text
                style={{
                  fontSize: responsiveSizes[height].sliderItemFontSize,
                  textAlign: "center",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderDateTime = () => {
    return (
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={responsiveSizes[height].sectionTitleDark}>
              time & date
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <DateTimePicker
              mode="date"
              display="default"
              value={date}
              onChange={dateChange}
              minimumDate={new Date()}
              themeVariant="light"
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <DateTimePicker
            mode="time"
            display="spinner"
            value={time}
            themeVariant="light"
            style={{ width: "100%", fontSize: 44 }}
            onChange={timeChange}
          />
        </View>
      </View>
    );
  };
  return (
    <Animated.View
      style={{
        height: "auto",
        top: responsiveSizes[height].discoverEventFilterMargin,
        width: "96%",
        position: "absolute",
        alignSelf: "center",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        zIndex: 1,
        opacity: translation,
      }}
    >
      <BlurView intensity={20} tint="dark">
        <View style={styles.box}>
          {renderAddress()}
          {renderDescription()}
          {renderMusicSection(
            "instruments",
            searching,
            selectingInstrument,
            searchInstruments,
            instrumentResult,
            eventInstruments,
            removeInstrument
          )}
          {renderMusicSection(
            "genres",
            genreSearch,
            selectingGenre,
            searchGenres,
            genreResult,
            eventGenres,
            removeGenre
          )}
          {renderDateTime()}
        </View>
        {renderPerformerOptions()}
        {loading ? (
          <ActivityIndicator
            style={{
              alignSelf: "flex-end",
              margin: 10,
              marginRight: 20,
            }}
            color="gray"
            size="large"
          />
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(147,112,219, .4)",
              alignSelf: "flex-end",
              margin: 10,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => saveEvent()}
          >
            <Text
              style={{
                fontSize: responsiveSizes[height].sliderItemFontSize,
                fontWeight: "700",
                color: "white"
              }}
            >
              POST
            </Text>
          </TouchableOpacity>
        )}
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginHorizontal: 10,
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
  },

  box: {
    paddingTop: 5,
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(NewEvent);
