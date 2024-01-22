import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import DiscoverHeader from "../components/discover/DiscoverHeader";
import Map from "../components/musicians/map";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from "../constants/index";
import { connect } from "react-redux";
import store from "../redux/store";
import EventFilters from "../components/discover/EventFilters";
import SelectedLocation from "../components/discover/SelectedLocation";
import NewEvent from "../components/events/NewEvent";
import Event from "../components/discover/Event";
import Toast from "react-native-toast-message";
import ShareLocation from "../components/discover/ShareLocation";
const Discover = ({
  navigation,
  selectedMarker,
  currentUser,
  selectedEvent,
}) => {
  // user first time sharing location

  const [sectionDisplay, setSectionDisplay] = useState("all");
  // const [displayUsers, setDisplayUsers] = useState(true);

  const [population, setPopulation] = useState(888);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [allAuditions, setAllAuditions] = useState([]);
  // musicians
  const [locationMarkers, setLocationMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  // // new gigs
  const [gigCount, setGigCount] = useState(888);
  // gigs

  const [newEvent, setNewEvent] = useState(false);

  const [gigFilter, setGigFilter] = useState([]);

  // generated from specific content
  const [filterInstruments, setFilterInstruments] = useState([]);
  const [filterGenres, setFilterGenres] = useState([]);
  const [allGigs, setAllGigs] = useState([]);
  // auditions

  const [newAudition, setNewAudition] = useState(false);
  const [auditionCount, setAuditionCount] = useState(888);

  const _map = useRef(null);

  useEffect(() => {
    if (currentUser.location) {
      getLocations();
      getEvents();
    }
  }, [currentUser.location]);
  const getLocations = async () => {
    setLoading(true);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/locations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setPopulation(resp.users_number);
        let filtered = resp.locations.filter((loc) => !loc.musician_count == 0);
        setLocationMarkers(filtered);
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const changeSection = (section) => {
    let dispatchObject;
    if (section == "gigs") {
      setDisplayedEvents(allGigs);

      dispatchObject = {
        type: "SELECT_MARKER",
        selectedMarker: null,
        markerAccounts: [],
        markerPosts: [],
      };
    } else {
      dispatchObject = {
        type: "SELECT_EVENT",
        selectedEvent: null,
      };
    }
    store.dispatch(dispatchObject);
    setSectionDisplay(section);
  };

  const getEvents = async () => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let today = new Date();
        let filter = [];
        resp.events.forEach((gig) => {
          if (today.toDateString() == new Date(gig.event_date).toDateString()) {
            if (!filter.includes(new Date(gig.event_date).toDateString())) {
              filter.unshift(new Date(gig.event_date).toDateString());
            }
          } else {
            if (!filter.includes(new Date(gig.event_date).toDateString())) {
              filter.push(new Date(gig.event_date).toDateString());
            }
          }
        });
        sortGigFilter(filter);
        let auditions = [];
        let musicGigs = [];
        let allEvents = resp.events;
        for (let i = 0; i < allEvents.length; i++) {
          if (allEvents[i].is_audition) {
            auditions.push(allEvents[i]);
          } else {
            musicGigs.push(allEvents[i]);
          }
        }
        // setAllAuditions(auditions);
        setAllGigs(musicGigs);
        setGigCount(musicGigs.length);
        // setAuditionCount(auditions.length);
        setDisplayedEvents(musicGigs);
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const addNewEventToLists = (event) => {
    if (event.is_audition) {
      let updatedAuditions = [...allAuditions, event];
      setAllAuditions(updatedAuditions);
      setDisplayedEvents(updatedAuditions);
      setSectionDisplay("auditions");
      setAuditionCount(updatedAuditions.length);
    } else {
      let updatedGigs = [...allGigs, event];
      setAllGigs(updatedGigs);
      setDisplayedEvents(updatedGigs);
      setSectionDisplay("gigs");
      setGigCount(updatedGigs.length);
    }
    _map.current.animateToRegion(
      {
        latitude: event.latitude + 0.0,
        longitude: event.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      5000
    );
  };
  const sortGigFilter = (dates) => {
    let fixed = dates
      .sort((a, b) => {
        return new Date(b) - new Date(a);
      })
      .reverse();
    setGigFilter(fixed);
  };
  const toUserPage = (user) => {
    let thatUser = {
      username: user.username,
      avatar: user.avatar,
      id: user.id,
    };
    navigation.navigate("User", thatUser);
  };

  const toBandPage = (band) => {
    let thatBand = {
      bandname: band.name,
      picture: band.picture,
      id: band.id,
    };
    navigation.navigate("Band", thatBand);
  };

  const updateGenreInstrumentFilters = (gig) => {
    let updatedInstruments = [...filterInstruments];
    let updatedGenres = [...filterGenres];
    gig.instruments.forEach((inst) => {
      if (!filterInstruments.includes(inst.name)) {
        updatedInstruments.push(inst.name);
      }
    });
    gig.genres.forEach((genr) => {
      if (!filterGenres.includes(genr.name)) {
        updatedGenres.push(genr.name);
      }
    });
    setFilterInstruments(updatedInstruments);
    setFilterGenres(updatedGenres);
  };

  const navigateToPerformer = (performer) => {
    if (performer.name) {
      toBandPage(performer);
    } else {
      toUserPage(performer);
    }
  };

  const renderHeader = () => {
    return (
      <>
        <DiscoverHeader
          auditionCount={auditionCount}
          setNewAudition={setNewAudition}
          newAudition={newAudition}
          setNewEvent={setNewEvent}
          newEvent={newEvent}
          population={population}
          changeSection={changeSection}
          sectionDisplay={sectionDisplay}
          navigation={navigation}
          gigCount={gigCount}
          setSelectedAddress={setSelectedAddress}
        />
        {newAudition || newEvent ? (
          <NewEvent
            _map={_map}
            newAudition={newAudition}
            setNewEvent={setNewEvent}
            setNewAudition={setNewAudition}
            allGigs={allGigs}
            setAllGigs={setAllGigs}
            newEvent={newEvent}
            addNewEventToLists={addNewEventToLists}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            updateGenreInstrumentFilters={updateGenreInstrumentFilters}
            gigFilter={gigFilter}
            sortGigFilter={sortGigFilter}
          />
        ) : null}
      </>
    );
  };
  const renderMap = () => {
    return (
      <Map
        _map={_map}
        locationMarkers={locationMarkers}
        sectionDisplay={sectionDisplay}
        newEvent={newEvent}
        selectedAddress={selectedAddress}
        displayedEvents={displayedEvents}
      />
    );
  };

  const updateAllEvents = (event) => {
    let updatedEvents = displayedEvents.filter((evnt) => evnt.id !== event.id);
    setDisplayedEvents(updatedEvents);
    if (event.is_audition) {
      setAllAuditions(updatedEvents);
      setAuditionCount(updatedEvents.length);
    } else {
      setGigCount(updatedEvents.length);
      setAllGigs(updatedEvents);
    }
    store.dispatch({ type: "SELECT_EVENT", selectedEvent: null });
  };

  const renderOverlayComponents = () => {
    return (
      <>
        {!newEvent && selectedMarker && sectionDisplay !== "gigs" ? (
          <SelectedLocation
            toUserPage={toUserPage}
            toBandPage={toBandPage}
            navigation={navigation}
          />
        ) : null}
        {sectionDisplay === "gigs" &&
        !selectedEvent &&
        !newEvent &&
        allGigs.length ? (
          <EventFilters
            sectionDisplay={sectionDisplay}
            allGigs={allGigs}
            allAuditions={allAuditions}
            setDisplayedEvents={setDisplayedEvents}
          />
        ) : null}
        {selectedEvent && sectionDisplay !== "musicians" ? (
          <Event
            updateAllEvents={updateAllEvents}
            navigateToPerformer={navigateToPerformer}
          />
        ) : null}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {currentUser.location ? renderMap() : <ShareLocation />}
      {renderOverlayComponents()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  selectedMarker: state.selectedMarker,
  markerPosts: state.markerPosts,
  currentUser: state.currentUser,
  selectedEvent: state.selectedEvent,
});

export default connect(mapStateToProps)(Discover);
