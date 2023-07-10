import React from "react";
import { StyleSheet } from "react-native";

const reusableStyles = StyleSheet.create({
  // selectedItem: {
  //   backgroundColor: "rgba(147,112,219, .6)",
  //   borderWidth: 1,
  //   borderRadius: 10,
  //   padding: 5,
  //   borderColor: "rgba(147,112,219, .6)",
  // },
  // regularItem: {
  //   borderWidth: 1,
  //   padding: 5,
  //   borderRadius: 10,
  //   borderColor: "gray",
  // },

  // itemWriting: {
  //   fontSize: 18,
  //   color: "black",
  //   fontWeight: "500",
  //   textAlign: "center",
  // },
  // selectedItemWriting: {
  //   fontSize: 18,
  //   color: "white",
  //   fontWeight: "500",
  //   textAlign: "center",
  // },
  discoverBackground: {
    borderRadius: 30,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
  },

  // sectionTitle: {
  //   color: "white",
  //   marginLeft: 10,
  //   fontSize: 20,
  //   fontWeight: "600",
  //   textDecorationLine: "underline",
  //   textDecorationColor: "#9370DB",
  //   marginBottom: 5,
  // },
  screenTitle: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
  },
});
const lightGray = "#cfcfcf";

export { reusableStyles, lightGray };
