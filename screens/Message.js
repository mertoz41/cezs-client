import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import Avatar from "../components/reusables/Avatar";
import { connect } from "react-redux";
import store from "../redux/store";
import consumer from "../consumer/consumer";
import { API_ROOT } from "../constants/index";
import {
  setUpChatrooms,
  responsiveSizes,
} from "../constants/reusableFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTiming } from "../constants/reusableFunctions";
import InputField from "../components/account/inputfield";
import Toast from "react-native-toast-message";
const { height } = Dimensions.get("window");
const Message = ({ navigation, route, currentUser, chatrooms }) => {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef();
  const [selectedUser, setSelectedUser] = useState(null);
  const [allMessagesDisplayed, setAllMessagesDisplayed] = useState(false);
  const [existingChat, setExistingChat] = useState(null);
  const [searching, setSearching] = useState("");

  const [deletedUser, setDeletedUser] = useState(false);
  const kablo = useRef(null);

  useEffect(() => {
    if (route.params && route.params.room) {
      setUpExistingChat(route.params.room);
      if (!route.params.room.users.length) {
        setDeletedUser(true);
      }
    } else if (route.params && route.params.newMessage) {
      setSelectedUser(route.params.newMessage);
    } else if (existingChat) {
      setUpExistingChat(existingChat);
    }
    return () => {
      if (kablo.current) {
        kablo.current.unsubscribe();
        // console.log(`unsubscribed from chatroom`);
      }
    };
  }, [existingChat]);
  const setUpExistingChat = (room) => {
    // let filtered = room.users.filter((user) => user.id !== currentUser.id);
    setSelectedUser(room.users[0]);
    setRoom(room);
    setLoading(true);
    getMessages(room.id);
    createSubs(room.id);
  };
  const seeMessages = async (roomId, userId) => {
    // update current chatroom
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/seemessages`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatroom_id: roomId, user_id: userId }),
    }).catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const createSubs = (id) => {
    const cable = consumer.subscriptions.create(
      { channel: "ChatroomsChannel", chatroom_id: id },
      {
        connected() {
          // console.log(currentUser.username + " connected to channel " + id);
        },
        received(data) {
          if (data.user_id !== currentUser.id) {
            setMessages((messages) => messages.concat({ ...data, seen: true }));
            seeMessages(id, data.user_id);
            updateChatrooms({ ...data, seen: true }, id);
          }
        },
      }
    );
    kablo.current = cable;
  };

  const updateChatrooms = (newMessage, roomId) => {
    let found = chatrooms.find((croom) => croom.id == roomId);
    let updatedRoom = { ...found, last_message: newMessage };
    let filteredChatrooms = chatrooms.filter((croom) => croom.id !== roomId);
    let updatedChatrooms = [updatedRoom, ...filteredChatrooms];
    store.dispatch({ type: "CHATROOMS", chatrooms: updatedChatrooms });
  };

  const getMessages = async (id) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/chatrooms/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        // MARK OTHER USERS MESSAGES SEEN
        let unseenMessage = resp.messages.find(
          (message) => message.user_id !== currentUser.id && !message.seen
        );
        if (unseenMessage) {
          let updatedChatrooms = [...chatrooms];
          let found = updatedChatrooms.find(
            (croom) => croom.id == route.params.room.id
          );
          let index = updatedChatrooms.indexOf(found);
          let lastMessage = {
            ...found.last_message,
            seen: true,
            content: resp.messages[resp.messages.length - 1].content,
          };
          let updatedRoom = { ...found, last_message: lastMessage };
          updatedChatrooms.splice(index, 1, updatedRoom);
          store.dispatch({ type: "CHATROOMS", chatrooms: updatedChatrooms });
          seeMessages(id, unseenMessage.user_id);
        }
        setLoading(false);
        setMessages(resp.messages);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };
  const backTo = () => {
    navigation.goBack();
  };

  const sendMessage = async (message) => {
    let token = await AsyncStorage.getItem("jwt");
    let obj = {
      chatroom_id: room.id,
      content: message,
      user_id: currentUser.id,
      other_user_id: selectedUser.id,
    };

    let chatroomMessage = {
      ...obj,
      created_at: new Date().toJSON(),
      seen: false,
    };
    setMessages([...messages, chatroomMessage]);
    updateChatrooms(chatroomMessage, room.id);

    fetch(`http://${API_ROOT}/messages`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    }).catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const fetchUsers = async () => {
    let token = await AsyncStorage.getItem("jwt");

    // setSearching(text)
    setSearchLoading(true);
    fetch(`http://${API_ROOT}/usersearch`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ searching: searching }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let filtered = resp.filter((user) => user.id !== currentUser.id);
        setResult(filtered);
        setSearchLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const handleMessage = (message) => {
    // if there is no room nu message
    if (!room) {
      nuMessage(message);
    } else {
      sendMessage(message);
    }
  };

  const toUserPage = (user) => {
    navigation.navigate("User", user);
  };

  const messaging = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };
  const nuMessage = async (message) => {
    let token = await AsyncStorage.getItem("jwt");

    let obj = {
      user_id: currentUser.id,
      message: message,
      receiver_id: selectedUser.id,
    };

    fetch(`http://${API_ROOT}/chatrooms`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        let filteredUsers = resp.chatroom.users.filter(
          (user) => user.id !== currentUser.id
        );
        let updatedLastMessage = {
          ...resp.chatroom.last_message,
          users: filteredUsers,
        };
        let updatedRoom = {
          ...resp.chatroom,
          last_message: updatedLastMessage,
        };
        setUpChatrooms([updatedRoom, ...chatrooms], currentUser.id);
        setRoom(updatedRoom);
        // // // // update room
        createSubs(updatedRoom.id);
        // // connect to channel

        setMessages([resp.message]);
        // store.dispatch({ type: "CHATROOMS", chatrooms: updatedChatrooms });
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const renderHeader = () => {
    const title = deletedUser
      ? "deleted user"
      : selectedUser
      ? selectedUser.username
      : "new message";
    return (
      <View
        style={{
          height: responsiveSizes[height].header,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 5,
            marginHorizontal: 10,
          }}
        >
          <View style={{ display: "flex", flexDirection: "row", flex: 2 }}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => backTo()}
            >
              <FontAwesome5
                name="backward"
                size={responsiveSizes[height].backwardIcon}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ display: "flex", flex: 4 }}
            onPress={() => (selectedUser ? toUserPage(selectedUser) : null)}
          >
            <Text
              style={{
                fontSize: responsiveSizes[height].screenTitle,
                textAlign: "center",
                color: "white",
              }}
            >
              {title}
            </Text>
          </TouchableOpacity>
          <View
            style={{ display: "flex", flex: 2, justifyContent: "center" }}
          ></View>
        </View>
      </View>
    );
  };

  const getMoreMessages = async (msg) => {
    setRefreshing(true);
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/oldermessages/${msg.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.message) {
          setAllMessagesDisplayed(true);
        } else {
          let updatedMessages = [...resp.messages, ...messages];
          setMessages(updatedMessages);
        }
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));

    setRefreshing(false);
  };
  const selectRecipient = (user) => {
    let found = chatrooms.filter((room) => {
      return room.users.some((usr) => usr.id === user.id);
    });
    if (found[0]) {
      setExistingChat(found[0]);
    } else {
      setSelectedUser(user);
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={{ flex: 1 }}>
        {!selectedUser && !deletedUser ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <TextInput
                autoCapitalize="none"
                style={styles.nameInput}
                placeholderTextColor="gray"
                placeholder="search recipient"
                onChangeText={(text) => setSearching(text)}
                onSubmitEditing={() => fetchUsers()}
                returnKeyType="search"
              />
              {searchLoading ? (
                <ActivityIndicator
                  color="whitesmoke"
                  size="small"
                  style={{ position: "absolute", right: 20, top: 10 }}
                />
              ) : null}
            </View>
          </View>
        ) : null}
        {!selectedUser && result.length ? (
          <ScrollView style={styles.resultBox}>
            {result.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.resultItem}
                onPress={() => selectRecipient(item)}
              >
                <Avatar avatar={item.avatar} size={50} withRadius={true} />
                <Text
                  style={{
                    fontSize: 21,
                    color: "white",
                    alignSelf: "center",
                    marginLeft: 10,
                  }}
                >
                  {item.username}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}

        {messages.length ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                tintColor="white"
                refreshing={refreshing}
                onRefresh={() => getMoreMessages(messages[0])}
              />
            }
            scrollEventThrottle={15}
            style={{ width: "100%" }}
            ref={scrollViewRef}
            onContentSizeChange={(height) =>
              scrollViewRef.current.scrollTo({ y: height })
            }
          >
            {messages.map((message, index) => {
              return (
                <View style={{ marginBottom: 10 }} key={index}>
                  <View style={styles.messageBox}>
                    {message.user_id == currentUser.id ? (
                      <View style={styles.currentUserBox}>
                        <Text
                          style={{
                            fontSize: responsiveSizes[height].messageFontSize,
                            justifyContent: "center",
                            zIndex: 10,
                            color: "white",
                            textAlign: "right",
                            paddingRight: 5,
                          }}
                        >
                          {message.content}
                        </Text>
                        <View style={styles.rightArrow}></View>
                        <View style={styles.rightArrowOverlap}></View>
                      </View>
                    ) : (
                      <View style={styles.receivingUser}>
                        <Text
                          style={{
                            fontSize: responsiveSizes[height].messageFontSize,
                            justifyContent: "center",
                            zIndex: 10,
                            color: "white",
                          }}
                        >
                          {message.content}
                        </Text>
                        <View style={styles.leftArrow}></View>
                        <View style={styles.leftArrowOverlap}></View>
                      </View>
                    )}
                  </View>
                  {index == messages.length - 1 ? (
                    <Text
                      style={{
                        alignSelf:
                          message.user_id == currentUser.id
                            ? "flex-end"
                            : "flex-start",
                        marginRight: 10,
                        marginTop: 10,
                        color: "white",
                        marginLeft: 10,
                      }}
                    >
                      {getTiming(message.created_at)}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </ScrollView>
        ) : loading ? (
          <ActivityIndicator
            color="whitesmoke"
            size="large"
            style={{ marginTop: 30 }}
          />
        ) : null}
      </View>
      {selectedUser ? (
        <InputField
          focusing={messaging}
          handleMessage={handleMessage}
          usage="message"
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultBox: {
    // backgroundColor: "#2e2e2e",
    margin: 10,
    height: "auto",
    // maxHeight: 200,
    borderRadius: 10,
  },
  resultItem: {
    flexDirection: "row",
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  nameInput: {
    fontSize: responsiveSizes[height].inputFontSize,
    color: "white",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    // backgroundColor: "darkgray",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    paddingLeft: 10,
  },
  messageBox: {
    // borderBottomWidth: 5,
    height: "auto",
    // marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    // padding: 10
  },
  currentUserBox: {
    backgroundColor: "#9370DB",
    padding: 10,
    alignSelf: "flex-end",
    maxWidth: "50%",
    borderRadius: 20,
  },

  receivingUser: {
    backgroundColor: "gray",
    padding: 10,
    maxWidth: "50%",
    alignSelf: "flex-start",
    borderRadius: 20,
  },
  rightArrow: {
    position: "absolute",
    backgroundColor: "#9370DB",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#2e2e2e",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -19,
  },
  leftArrow: {
    position: "absolute",
    backgroundColor: "gray",
    // backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },

  leftArrowOverlap: {
    position: "absolute",
    // backgroundColor: "#eeeeee",
    backgroundColor: "#2e2e2e",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -19,
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  newMessages: state.newMessages,
  chatrooms: state.chatrooms,
});

export default connect(mapStateToProps)(Message);
