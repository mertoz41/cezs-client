import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import store from "../redux/store";
import { Tooltip } from "react-native-elements";
import { BlurView } from "expo-blur";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const Cam = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [timerSecond, setTimerSecond] = useState(0);
  const [timerDisplay, setTimerDisplay] = useState(0);
  const [loading, setLoading] = useState(false);

  const tooltipRef = useRef(null);

  const cameraRef = useRef(null);

  const displayTimerOptions = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => timerFunction(3)}>
            <Text style={{ fontSize: 25, textAlign: "center", padding: 5 }}>
              3s
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => timerFunction(5)}>
            <Text style={{ fontSize: 25, textAlign: "center", padding: 5 }}>
              5s
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => timerFunction(10)}>
            <Text style={{ fontSize: 25, textAlign: "center", padding: 5 }}>
              10s
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => timerFunction(0)}>
            <Text style={{ fontSize: 25, textAlign: "center", padding: 5 }}>
              none
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const timerFunction = (second) => {
    if (second == 0) {
      setTimerOn(false);
      setTimerSecond(second);
      setTimerDisplay(second);
      tooltipRef.current.toggleTooltip();
    } else {
      setTimerOn(true);
      setTimerSecond(second);
      setTimerDisplay(second);
      tooltipRef.current.toggleTooltip();
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No Access To Camera</Text>;
  }
  const recordVid = () => {
    if (!recording) {
      if (timerOn) {
        let interval = setInterval(() => {
          setTimerDisplay((prev) => {
            if (prev === 1) clearInterval(interval);
            return prev - 1;
          });
        }, 1000);
        setTimeout(() => startRecording(), timerSecond * 1000);
        return () => clearInterval(interval);
      } else {
        startRecording();
      }
    } else {
      setRecording(false);
      setLoading(true);
      stopRecording();
      setTimerOn(false);
      setTimerSecond(0);
      setTimerDisplay(0);
    }
    // if recording hook is true, camera will hit recordasync
    // if
  };
  const openCameraRoll = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll denied!");
      return;
    }
    let pickedVideo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 60,
      quality: 1,
    });
    if (pickedVideo.canceled) {
      return;
    }
    store.dispatch({
      type: "VIDEO_INCOMING",
      recordedVideo: pickedVideo.assets[0],
    });
    navigation.navigate("Upload");
  };
  const startRecording = async () => {
    setRecording(!recording);
    let video;
    if (cameraRef) {
      video = await cameraRef.current.recordAsync({ maxDuration: 60 });
    }
    setLoading(false);
    video.uri.split(".")[1] = "mp4";
    store.dispatch({ type: "VIDEO_INCOMING", recordedVideo: video });
    setTimerOn(!timerOn);
    setTimerSecond(0);
    setTimerDisplay(0);
    navigation.navigate("Upload");
  };
  const stopRecording = () => {
    cameraRef.current.stopRecording();
  };
  const renderBottomButtons = () => {
    return (
      <View style={styles.section}>
        <View
          style={{
            overflow: "hidden",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <BlurView intensity={40} tint="dark" style={styles.bottom}>
            <View style={styles.bottomButton}>
              {recording ? null : loading ? (
                <></>
              ) : (
                <TouchableOpacity onPress={() => openCameraRoll()}>
                  <FontAwesome name="folder-open-o" size={34} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.bottomButton}>
              <TouchableOpacity onPress={() => recordVid()}>
                {recording ? (
                  <Entypo name="controller-stop" size={64} color="#9370DB" />
                ) : loading ? (
                  <></>
                ) : (
                  <Entypo name="controller-record" size={64} color="red" />
                )}
              </TouchableOpacity>
            </View>
            {timerOn && timerSecond !== 0 ? (
              recording ? null : (
                <Text
                  style={{
                    position: "absolute",
                    right: 82,
                    top: 20,
                    zIndex: 10,
                    fontSize: 33,
                    color: "#9370DB",
                  }}
                >
                  {timerDisplay}
                </Text>
              )
            ) : null}

            <View style={styles.bottomButton}>
              {recording || loading ? null : (
                <Tooltip
                  popover={displayTimerOptions()}
                  highlightColor="transparent"
                  pointerColor="white"
                  height={90}
                  backgroundColor="white"
                  closeOnlyOnBackdropPress={false}
                  ref={tooltipRef}
                >
                  {timerOn ? (
                    <MaterialCommunityIcons
                      name="timer-outline"
                      size={38}
                      color="white"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="timer-off-outline"
                      size={38}
                      color="white"
                    />
                  )}
                </Tooltip>
              )}
            </View>
          </BlurView>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {recording || loading ? null : (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 20, top: 50, zIndex: 1 }}
        >
          <FontAwesome5 name="backward" size={34} color="white" />
        </TouchableOpacity>
      )}
      <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <View style={styles.section}>
            <View style={styles.top}></View>
          </View>
          {renderBottomButtons()}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  section: {
    flex: 0.5,
    justifyContent: "flex-end",
    margin: 20,
  },
  top: {
    position: "absolute",
    right: 0,
    height: "100%",
    backgroundColor: "green",
    alignSelf: "stretch",
  },
  bottom: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "red",
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "space-around",
  },

  bottomButton: {
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Cam;
