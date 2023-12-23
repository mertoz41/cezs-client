import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import dateFormat from "dateformat";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
import BlurryBubble from "../reusables/BlurryBubble";
const UpcomingEvent = ({ gig }) => {
  getDate = (date) => {
    return dateFormat(date, "fullDate");
  };
  return (
    <View style={styles.container}>
      <Text style={responsiveSizes[height].sectionTitle}>
        upcoming {gig.is_audition ? "audition" : "gig"}
      </Text>
      <View style={{ marginHorizontal: 10}}>
        <BlurryBubble radius={20} marginLeft={0}>
          <View style={styles.item}>
            <Text style={styles.description}>{gig.description}</Text>
            <Text style={styles.address}>{gig.address}</Text>
            <Text style={styles.address}>
              {getDate(gig.event_date)} @ {gig.event_time}
            </Text>
          </View>
        </BlurryBubble>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
  },
  item: {
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "#9370DB",
    borderRadius: 20,
    padding: 10,
  },
  description: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    // paddingBottom: 5,
    color: "white",
  },
  address: {
    fontSize: responsiveSizes[height].sliderItemFontSize - 4,
    color: "darkgray",
  },
});

export default UpcomingEvent;
