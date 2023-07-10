import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Tooltip } from "react-native-elements";
import { BlurView } from "expo-blur";
import {
  MaterialIcons,
  FontAwesome,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { connect } from "react-redux";
import ReportModal from "./ReportModal";
import { responsiveSizes } from "../../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const OptionsButton = ({
  deleteAction,
  item,
  currentUser,
  usage,
  blockAction,
  color,
  update,
  goBack,
}) => {
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const toolTip = useRef();
  const closeTooltip = () => {
    if (toolTip.current) {
      toolTip.current.toggleTooltip();
    }
    setReportModalVisible(false);
  };

  const renderDeleteOption = () => {
    const currentUsersBand = () => {
      let found = currentUser.bands.find((band) => band.id === item.band_id);
      if (found) {
        return true;
      }
      return false;
    };
    return (item?.user_id && item.user_id == currentUser.id) ||
      (item?.band_id && currentUsersBand()) ? (
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
        onPress={() => deleteAction(item)}
      >
        <FontAwesome name="trash-o" size={24} color="white" />

        <Text
          style={{
            fontSize: 24,
            color: "white",
            marginLeft: 5,
          }}
        >
          delete
        </Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={{ display: "flex", flexDirection: "row" }}
        onPress={() => setReportModalVisible(true)}
      >
        <MaterialIcons name="report-problem" size={24} color="white" />

        <Text style={{ fontSize: 24, color: "white", marginLeft: 5 }}>
          report
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <Tooltip
      ref={toolTip}
      popover={
        <View
          style={{
            overflow: "hidden",
            borderRadius: 10,
            left: 50,
            bottom: 40,
          }}
        >
          <BlurView
            intensity={20}
            tint="light"
            style={{
              padding: 5,
              backgroundColor: "rgba(147,112,219, .3)",
            }}
          >
            {renderDeleteOption()}

            {usage === "user" || usage === "band" ? (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                onPress={() => blockAction(item)}
              >
                <FontAwesome
                  name="trash-o"
                  size={responsiveSizes[height].backwardIcon}
                  color="white"
                />

                <Text
                  style={{
                    fontSize: 24,
                    color: "white",
                    marginLeft: 5,
                  }}
                >
                  block
                </Text>
              </TouchableOpacity>
            ) : null}
          </BlurView>
          <ReportModal
            visible={reportModalVisible}
            update={update}
            item={item}
            id={item?.id}
            type={usage}
            close={() => closeTooltip()}
            goBack={goBack}
          />
        </View>
      }
      containerStyle={{
        backgroundColor: "transparent",
        alignItems: "center",
      }}
      highlightColor="transparent"
      withPointer={false}
      height={90}
      withOverlay={false}
    >
      <SimpleLineIcons
        name="options"
        size={22}
        color={color}
        style={{
          paddingHorizontal: 5,
          alignSelf: "center",
        }}
      />
    </Tooltip>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});
export default connect(mapStateToProps)(OptionsButton);
