import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import dateFormat from "dateformat";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const UpcomingEvent = ({ gig }) => {
  getDate = (date) => {
    return dateFormat(date, "fullDate");
  };
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={responsiveSizes[height].sectionTitle}>
          upcoming {gig.is_audition ? "audition" : "gig"}
        </Text>
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <View style={styles.item}>
          <Text style={styles.description}>{gig.description}</Text>
          <Text style={styles.address}>{gig.address}</Text>
          <Text style={styles.address}>
            {getDate(gig.event_date)} @ {gig.event_time}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    marginBottom: 5,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    marginBottom: 5,
  },
  item: {
    borderWidth: responsiveSizes[height].borderWidth,
    borderColor: "#9370DB",
    width: "100%",
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
  },
  description: {
    fontSize: responsiveSizes[height].sliderItemFontSize,
    paddingBottom: 5,
    color: "white",
  },
  address: {
    fontSize: responsiveSizes[height].sliderItemFontSize - 4,
    color: "darkgray",
  },
});

export default UpcomingEvent;
