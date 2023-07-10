import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { reusableStyles } from "../../themes";
import { BlurView } from "expo-blur";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const EventFilters = ({
  sectionDisplay,
  setDisplayedEvents,
  allGigs,
  allAuditions,
}) => {
  const [display, setDisplay] = useState("instruments");
  const [selectedFilters, setSelectedFilters] = useState({
    genres: [],
    instruments: [],
    dates: [],
  });

  const [gigInstruments, setGigInstruments] = useState([]);
  const [gigGenres, setGigGenres] = useState([]);
  const [gigDates, setGigDates] = useState([]);

  const [auditionInstruments, setAuditionInstruments] = useState([]);
  const [auditionGenres, setAuditionGenres] = useState([]);
  const [auditionDates, setAuditionDates] = useState([]);
  // get all gigs and auditions and filter inside this component, then update displayedEvents
  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (allGigs.length) {
      let filters = generateFilters(allGigs);
      setGigInstruments(filters.instruments);
      setGigDates(filters.dates);
      setGigGenres(filters.genres);
    }
    if (allAuditions.length) {
      let filters = generateFilters(allAuditions);
      setAuditionInstruments(filters.instruments);
      setAuditionDates(filters.dates);
      setAuditionGenres(filters.genres);
    }
    if (sectionDisplay === "gigs" || sectionDisplay === "auditions") {
      Animated.timing(translation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [allGigs, allAuditions]);

  generateFilters = (array) => {
    let genreFilters = [];
    let instrumentFilters = [];
    let dateFilters = [];
    for (let i = 0; i < array.length; i++) {
      if (!dateFilters.includes(new Date(array[i].event_date).toDateString())) {
        dateFilters.push(new Date(array[i].event_date).toDateString());
      }
      for (let k = 0; k < array[i].genres.length; k++) {
        if (!genreFilters.includes(array[i].genres[k].name)) {
          genreFilters.push(array[i].genres[k].name);
        }
      }
      for (let k = 0; k < array[i].instruments.length; k++) {
        if (!instrumentFilters.includes(array[i].instruments[k].name)) {
          instrumentFilters.push(array[i].instruments[k].name);
        }
      }
    }
    return {
      genres: genreFilters,
      instruments: instrumentFilters,
      dates: dateFilters,
    };
  };

  today = (date) => {
    let today = new Date();
    if (today.toDateString() == date) {
      return "today";
    } else {
      return date;
    }
  };

  renderSelectedFilter = (
    filterOptions,
    filterSelections,
    func,
    isDate,
    usage
  ) => {
    return filterOptions.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => func(item, filterSelections, usage)}
        style={{ padding: 5 }}
      >
        <View
          style={
            filterSelections.includes(item)
              ? responsiveSizes[height].selectedItem
              : responsiveSizes[height].regularItem
          }
        >
          <Text
            style={
              filterSelections.includes(item)
                ? responsiveSizes[height].selectedItemWriting
                : responsiveSizes[height].itemWriting
            }
          >
            {isDate ? today(item) : item}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };
  renderFilterType = (type) => {
    return (
      <TouchableOpacity
        onPress={() => setDisplay(type)}
        style={{ marginRight: 5 }}
      >
        <View
          style={
            display === type
              ? responsiveSizes[height].selectedItem
              : responsiveSizes[height].regularItem
          }
        >
          <Text
            style={
              display === type
                ? responsiveSizes[height].selectedItemWriting
                : responsiveSizes[height].itemWriting
            }
          >
            {type}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  filterAction = (item, filterArray, usage) => {
    if (filterArray.includes(item)) {
      let filtered = filterArray.filter((itm) => itm !== item);
      let updatedFilters = { ...selectedFilters, [usage]: filtered };
      setSelectedFilters(updatedFilters);
      if (
        !updatedFilters.instruments.length &&
        !updatedFilters.genres.length &&
        !updatedFilters.dates.length
      ) {
        let sectionEvents =
          sectionDisplay === "gigs" ? [...allGigs] : [...allAuditions];
        setDisplayedEvents(sectionEvents);
      } else {
        updateEvents(updatedFilters);
      }
    } else {
      let updatedArray = [...filterArray, item];
      let updatedFilters = { ...selectedFilters, [usage]: updatedArray };
      setSelectedFilters(updatedFilters);
      updateEvents(updatedFilters);
    }
  };

  updateEvents = (filters) => {
    let sectionEvents =
      sectionDisplay === "gigs" ? [...allGigs] : [...allAuditions];
    let filteredEvents = sectionEvents.filter((event) => {
      return (
        event.instruments.some((inst) =>
          filters.instruments.includes(inst.name)
        ) ||
        filters.dates.includes(new Date(event.event_date).toDateString()) ||
        event.genres.some((genr) => filters.genres.includes(genr.name))
      );
    });
    setDisplayedEvents(filteredEvents);
  };

  return (
    <Animated.View
      style={{
        height: "auto",
        top: responsiveSizes[height].discoverEventFilterMargin,
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
        <View style={reusableStyles.discoverBackground}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", margin: 5, marginBottom: 0 }}>
              {renderFilterType("instruments")}
              {renderFilterType("genres")}
              {renderFilterType("dates")}
            </View>
          </View>
          <ScrollView horizontal={true}>
            {display == "instruments" &&
              renderSelectedFilter(
                sectionDisplay === "gigs"
                  ? gigInstruments
                  : auditionInstruments,
                selectedFilters.instruments,
                filterAction,
                false,
                "instruments"
              )}
            {display === "genres" &&
              renderSelectedFilter(
                sectionDisplay === "gigs" ? gigGenres : auditionGenres,
                selectedFilters.genres,
                filterAction,
                false,
                "genres"
              )}
            {display === "dates" &&
              renderSelectedFilter(
                sectionDisplay === "gigs" ? gigDates : auditionDates,
                selectedFilters.dates,
                filterAction,
                true,
                "dates"
              )}
          </ScrollView>
        </View>
      </BlurView>
    </Animated.View>
  );
};

export default EventFilters;
