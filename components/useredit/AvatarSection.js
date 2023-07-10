import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-elements";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const AvatarSection = ({ openCameraPics, pic }) => {
  return (
    <View style={styles.section}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={responsiveSizes[height].sectionTitle}>avatar</Text>

        {!pic ? (
          <View style={{ height: 1, width: 1 }}></View>
        ) : (
          <Avatar
            avatarStyle={{ borderRadius: 10 }}
            source={{
              uri: pic,
            }}
            size={responsiveSizes[height].avatar - 40}
            containerStyle={{ alignSelf: "center" }}
          />
        )}

        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            borderWidth: responsiveSizes[height].borderWidth,
            borderColor: "gray",
            padding: 5,
            borderRadius: 10,
          }}
          onPress={() => openCameraPics()}
        >
          <Text
            style={{
              fontSize: responsiveSizes[height].sliderItemFontSize,
              color: "white",
              fontWeight: "300",
            }}
          >
            {pic ? "edit" : "add"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2e2e",
  },
  section: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    // margin: 10,
  },
  title: {
    color: "white",
    fontSize: responsiveSizes[height].header,
    fontWeight: "600",
    marginLeft: 10,
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    alignSelf: "flex-end",
    marginBottom: 5,
  },
});

export default AvatarSection;
