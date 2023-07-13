import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { ListItem } from "react-native-elements";
import { reusableStyles } from "../../themes";
const { height } = Dimensions.get("window");
import { responsiveSizes } from "../../constants/reusableFunctions";
const EditSection = ({
  label,
  currentValue,
  updateValue,
  result,
  selectNewLocation,
}) => {
  const checkCharacter = (text) => {
    if (label === "bio" && text.length >= 101) {
      return;
    } else if (label === "username" && text.length === 18) {
      return;
    }
    updateValue(text);
  };
  return (
    <View style={styles.section}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={responsiveSizes[height].sectionTitle}>{label}</Text>
        </View>
        <View style={{ flex: 2, justifyContent: "flex-start" }}>
          <TextInput
            multiline
            placeholder={
              label === "bio" ? "add your bio" : `enter ${label}`
            }
            placeholderTextColor="gray"
            value={currentValue}
            autoCapitalize="none"
            style={{
              fontSize: responsiveSizes[height].sliderItemFontSize,
              color: "white",
              fontWeight: "300",
              marginBottom: 5,
            }}
            onChangeText={(text) => checkCharacter(text)}
          />
          {label === "bio" && (
            <Text
              style={{
                position: "absolute",
                color: "white",
                right: 0,
                backgroundColor: "rgba(46,46,46, .6)",
              }}
            >
              {currentValue?.length}/100
            </Text>
          )}

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
                  onPress={() => selectNewLocation(item)}
                  containerStyle={{
                    backgroundColor: "transparent",
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title
                      style={{
                        color: "white",
                        fontSize: responsiveSizes[height].sliderItemFontSize,
                      }}
                    >
                      {item.city}, {item.stateCode}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              ))}
            </ScrollView>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginTop: 5,
  },
});

export default EditSection;
