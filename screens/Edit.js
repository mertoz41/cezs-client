import React from "react";
import { View } from "react-native";

import EditField from "../components/useredit/EditField";
const Edit = ({ navigation }) => {
  return (
    <View style={{ backgroundColor: "#2e2e2e", display: "flex", flex: 1 }}>
      <EditField navigation={navigation} />
    </View>
  );
};

export default Edit;
