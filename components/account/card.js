import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Avatar from "../reusables/Avatar";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const Card = ({ avatar }) => {
  return (
    <View style={styles.container}>
      <Avatar
        avatar={avatar}
        size={responsiveSizes[height].avatar}
        withRadius={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    paddingBottom: 10,
    width: "100%",
  },
});

export default React.memo(Card);
