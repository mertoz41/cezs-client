import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { API_ROOT } from "../constants/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import InputField from "../components/account/inputfield";
import { getTiming } from "../constants/reusableFunctions";
import { Avatar, ListItem } from "react-native-elements";
import { reusableStyles } from "../themes";
import Toast from "react-native-toast-message";
import OptionsButton from "../components/reusables/OptionsButton";
const Comment = ({ route, navigation, currentUser, timeline }) => {
  const [comments, setComments] = useState([]);
  const [displaying, setDisplaying] = useState("");
  const [loading, setLoading] = useState(false);
  const [applauders, setApplauders] = useState([]);

  useEffect(() => {
    setLoading(true);
    getComments(route.params.id);
  }, []);
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const scrollViewRef = useRef();

  const getComments = async (id) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setComments(resp.comments);
        setApplauders(resp.applauders);
        setDisplaying(route.params.usage);
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const backTo = () => {
    navigation.goBack();
  };

  const deleteComment = async (comment) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/comments/${comment.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let updatedComments = comments.filter(
          (commnt) => commnt.id !== comment.id
        );
        setComments(updatedComments);
        Toast.show({
          type: "success",
          text1: "success",
          text2: "Your comment is deleted.",
        });
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const sendComment = async (comment) => {
    if (!comment.length) {
      alert("invalid comment");
    } else {
      let token = await AsyncStorage.getItem("jwt");
      let obj = {
        user_id: currentUser.id,
        post_id: route.params.id,
        comment: comment,
      };
      fetch(`http://${API_ROOT}/comments`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          let updatedComments = [...comments];
          updatedComments.push(resp.comment);
          setComments(updatedComments);
        })
        .catch((err) => Toast.show({ type: "error", text1: err.message }));
    }
  };

  const commenting = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };
  const renderHeader = () => {
    return (
      <View
        style={{
          height: 80,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1, alignSelf: "flex-end" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 10 }}
          >
            <FontAwesome5 name="backward" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 4,
            alignSelf: "flex-end",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={
              displaying === "comments"
                ? styles.selectedItem
                : styles.regularItem
            }
            onPress={() => setDisplaying("comments")}
          >
            <Text
              style={
                displaying === "comments"
                  ? styles.selectedItemWriting
                  : styles.itemWriting
              }
            >
              comments
            </Text>
          </TouchableOpacity>
          <View style={{ width: 10 }}></View>
          <TouchableOpacity
            style={
              displaying === "applauds"
                ? styles.selectedItem
                : styles.regularItem
            }
            onPress={() => setDisplaying("applauds")}
          >
            <Text
              style={
                displaying === "applauds"
                  ? styles.selectedItemWriting
                  : styles.itemWriting
              }
            >
              applauds
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  };

  const renderComment = (comment) => {
    return (
      <ListItem
        bottomDivider
        key={comment.id}
        containerStyle={{ backgroundColor: "transparent" }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("User", {
              username: comment.username,
              id: comment.user_id,
            })
          }
        >
          {comment.avatar ? (
            <Avatar
              source={{ uri: comment.avatar }}
              avatarStyle={{ borderRadius: 10 }}
              size={40}
            />
          ) : (
            <Feather
              name="user"
              size={40}
              color="gray"
              style={{ alignSelf: "center" }}
            />
          )}
        </TouchableOpacity>
        <ListItem.Content>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <ListItem.Title
              style={{
                fontWeight: "bold",
                paddingBottom: 10,
                color: "white",
              }}
            >
              {comment.username}
            </ListItem.Title>
            <ListItem.Title
              style={{
                fontWeight: "bold",
                paddingBottom: 10,
                fontSize: 10,
                color: "gray",
              }}
            >
              {getTiming(comment.created_at)}
            </ListItem.Title>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <ListItem.Subtitle
              style={{ fontSize: 20, color: "white", width: "90%" }}
            >
              {comment.comment}
            </ListItem.Subtitle>
            <OptionsButton
              deleteAction={deleteComment}
              item={comment}
              usage={"comment"}
              color="gray"
            />
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };
  const renderApplauder = (user) => {
    return (
      <ListItem
        bottomDivider
        key={user.id}
        containerStyle={{ backgroundColor: "#2e2e2e" }}
      >
        {user.avatar ? (
          <Avatar
            source={{ uri: user.avatar }}
            avatarStyle={{ borderRadius: 10 }}
            size={40}
          />
        ) : (
          <Feather
            name="user"
            size={40}
            color="gray"
            style={{ alignSelf: "center" }}
          />
        )}

        <ListItem.Content>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <ListItem.Title
              style={{
                paddingBottom: 10,
                color: "white",
                fontWeight: "bold",
                // fontSize: 25,
              }}
            >
              {user.username}
            </ListItem.Title>
            <ListItem.Subtitle style={{ fontSize: 20, color: "gray" }}>
              {user.location.city}
            </ListItem.Subtitle>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };
  return (
    <View style={styles.container}>
      {renderHeader()}
      {loading ? (
        <ActivityIndicator
          color="gray"
          size="large"
          style={{ marginTop: 10 }}
        />
      ) : null}

      <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {displaying === "comments" &&
          comments.map((comment) => {
            return renderComment(comment);
          })}
        {displaying === "applauds" &&
          applauders.map((user) => {
            return renderApplauder(user);
          })}
      </ScrollView>
      {displaying === "comments" && (
        <InputField
          focusing={commenting}
          sendComment={sendComment}
          usage="comment"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#2e2e2e",
  },
  selectedItem: {
    // backgroundColor: "rgba(147,112,219, .6)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    borderColor: "#9370DB",
  },
  regularItem: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    borderColor: "gray",
  },

  itemWriting: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },
  selectedItemWriting: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },
});
const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  timeline: state.timeline,
});

export default connect(mapStateToProps)(Comment);
