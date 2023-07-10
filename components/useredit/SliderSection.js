import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import { ListItem } from "react-native-elements";
import Avatar from "../reusables/Avatar";
import { AntDesign } from "@expo/vector-icons";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const SliderSection = ({
  label,
  search,
  searching,
  select,
  remove,
  selected,
  searchResult,
  clearSearchResult,
}) => {
  const placeholderText = (label) => {
    switch (label) {
      case "genres":
        return "add the genres you play";
      case "instruments":
        return "add the instruments you play";
      case "favorite artists":
        return "add your favorite artists";
    }
  };
  const renderAvatarItem = (item, index) => {
    return (
      <View style={styles.instrumentItem} key={index}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            avatar={item.avatar}
            size={responsiveSizes[height].bandMemberAvatar}
            withRadius={true}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              zIndex: 1,
              padding: 3,
              backgroundColor: "#9370DB",
              borderRadius: "50%",
              right: 0,
            }}
            onPress={() => remove(item)}
          >
            <AntDesign
              name="close"
              size={responsiveSizes[height].backwardIcon}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            color: "white",
            textAlign: "center",
            borderWidth: responsiveSizes[height].borderWidth,
            borderColor: "gray",
            borderRadius: 10,
            padding: 5,
          }}
        >
          {item.username ? item.username : item.name}
        </Text>
      </View>
    );
  };

  const renderMusicItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.instrumentItem}
        key={index}
        onPress={() => remove(item)}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        ></View>
        <Text
          style={{
            fontSize: responsiveSizes[height].sliderItemFontSize,
            color: "white",
            textAlign: "center",
            borderWidth: responsiveSizes[height].borderWidth,
            borderColor: "gray",
            borderRadius: 10,
            padding: 5,
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.section}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={responsiveSizes[height].sectionTitle}>{label}</Text>
        </View>
        <View style={{ flex: 2 }}>
          {searching.length > 3 && label !== "members" ? (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 0,
                borderRadius: "50%",
                zIndex: 1,
              }}
              onPress={() => select({ name: searching })}
            >
              <AntDesign name="plus" size={27} color="gray" />
            </TouchableOpacity>
          ) : null}
          <TextInput
            onBlur={() => clearSearchResult()}
            multiline
            placeholder={placeholderText(label)}
            placeholderTextColor="gray"
            value={searching}
            autoCapitalize="none"
            style={{
              fontSize: responsiveSizes[height].sliderItemFontSize,
              color: "white",
              fontWeight: "300",
              marginBottom: 5,
            }}
            onChangeText={(text) => search(text)}
          />
          {searchResult?.length ? (
            <ScrollView
              keyboardShouldPersistTaps={"always"}
              style={{
                borderTopWidth: "1px",
                borderTopColor: "#9370DB",
                height: 200,
              }}
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
                  {label === "members" && (
                    <Avatar avatar={item.avatar} size={50} withRadius={true} />
                  )}

                  <ListItem.Content>
                    <ListItem.Title style={{ color: "white" }}>
                      {item.username ? item.username : item.name}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              ))}
            </ScrollView>
          ) : null}
        </View>
      </View>
      <ScrollView style={styles.instrumentsBox} horizontal={true}>
        {selected.map((item, index) => {
          return label === "instruments" ||
            label === "genres" ||
            label === "favorite artists"
            ? renderMusicItem(item, index)
            : renderAvatarItem(item, index);
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  instrumentItem: {
    padding: 5,
    justifyContent: "center",
    marginRight: 4,
  },

  section: {
    marginBottom: 0,
    marginLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    margin: 10,
  },

  instrumentsBox: {
    height: "auto",
  },
});

export default SliderSection;
