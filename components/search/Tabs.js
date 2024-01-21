import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { responsiveSizes } from "../../constants/reusableFunctions";
import MusicFilters from "./MusicFilters";
import SearchResults from "./SearchResults";
const { height } = Dimensions.get("window");

const Tabs = ({
  searchFilters,
  updateResult,
  getFilterSearch,
  filterPosts,
  filterBands,
  filterUsers,
  loading,
  dataLoading,
  navigation,
}) => {
  const [index, setIndex] = useState(0);
  const routes = [
    { key: "posts", title: "posts" },
    { key: "bands", title: "bands" },
    { key: "users", title: "users" },
    { key: "songs", title: "songs" },
    { key: "artists", title: "artists" },
  ];
  const renderTabBar = (props) => {
    const optionButton = (name, i) => {
      return (
        <TouchableOpacity
          style={index === i ? styles.selectedFilterItem : styles.filterItem}
          onPress={() => setIndex(i)}
          key={i}
        >
          <Text
            style={
              index === i ? styles.selectedItemWriting : styles.itemWriting
            }
          >
            {name}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <View
          style={{
            height: responsiveSizes[height].header,
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {props.navigationState.routes.map((route, i) => {
            return optionButton(route.title, i);
          })}
        </View>
        {index === 3 || index === 4 ? null : filters}
      </View>
    );
  };
  const filters = useMemo(() => {
    return (
      <MusicFilters
        index={index}
        searchFilters={searchFilters}
        updateResult={updateResult}
        getFilterSearch={getFilterSearch}
      />
    );
  }, [searchFilters, index]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "posts":
        return (
          <SearchResults
            result={filterPosts}
            loading={loading}
            selectedLength={true}
            dataLoading={dataLoading}
            navigation={navigation}
            index={index}
          />
        );
      case "bands":
        return (
          <SearchResults
            result={filterBands}
            loading={loading}
            selectedLength={true}
            dataLoading={dataLoading}
            navigation={navigation}
            index={index}
          />
        );
      case "users":
        return (
          <SearchResults
            result={filterUsers}
            loading={loading}
            selectedLength={true}
            dataLoading={dataLoading}
            navigation={navigation}
            index={index}
          />
        );
      case "songs":
        return (
          <View style={[styles.container, { backgroundColor: "#ff4081" }]} />
        );
      case "artists":
        return <View style={[styles.container, { backgroundColor: "red" }]} />;
      default:
        return null;
    }
  };
  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    height: 50,
  },

  searchType: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "flex-end",
    padding: 5,
  },

  sectionItem: {
    fontSize: 22,
    fontWeight: "300",
    color: "silver",
  },
  filterItem: {
    height: "auto",
    width: "auto",

    borderColor: "gray",
    borderRadius: 10,
    borderWidth: responsiveSizes[height].borderWidth,
    paddingHorizontal: 4,
  },
  selectedFilterItem: {
    height: "auto",
    width: "auto",

    borderColor: "#9370DB",
    borderRadius: 10,
    borderWidth: responsiveSizes[height].borderWidth,

    paddingHorizontal: 4,
  },
  itemWriting: {
    fontSize: responsiveSizes[height].searchOptionFont,
    color: "silver",
    fontWeight: "300",
  },
  selectedItemWriting: {
    fontSize: responsiveSizes[height].searchOptionFont,
    color: "#9370DB",
    fontWeight: "300",
  },

  header: {
    height: 40,
  },
  searching: {
    fontSize: 24,
    color: "white",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },

  exploreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    marginLeft: 10,
  },

  primaryText: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "white",
  },

  secondaryText: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    color: "gray",
  },
});

export default Tabs;
