import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { connect } from "react-redux";
import { ListItem } from "react-native-elements";
import { getTiming, responsiveSizes } from "../constants/reusableFunctions";
import { Feather } from "@expo/vector-icons";
import ActionHeader from "../components/reusables/ActionHeader";
import Avatar from "../components/reusables/Avatar";
const { height } = Dimensions.get("window");
const Messages = ({ navigation, currentUser, chatrooms }) => {
  toNewMessage = () => {
    navigation.navigate("Message");
  };

  toMessageScreen = (chatroom) => {
    navigation.navigate("Message", { room: chatroom });
  };

  navigateBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <ActionHeader
        title="messages"
        goBack={navigation.goBack}
        actionLabel="new"
        displayAction={true}
        action={toNewMessage}
      />
      <ScrollView>
        {chatrooms.map((room, index) => {
          return (
            <ListItem
              bottomDivider
              key={index}
              onPress={() => toMessageScreen(room)}
              containerStyle={{ backgroundColor: "transparent" }}
            >
              {room.users.length ? (
                room.users.map((user, i) => (
                  <View key={i} style={{ flexDirection: "row" }}>
                    <Avatar
                      avatar={user.avatar}
                      size={responsiveSizes[height].newEventAvatarSize}
                      withRadius={true}
                    />
                    <ListItem.Content
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flex: 2 }}>
                        <ListItem.Title
                          style={{
                            color: "white",
                            marginLeft: 10,
                            fontSize:
                              responsiveSizes[height].sliderItemFontSize,
                          }}
                        >
                          {user.username}
                          {!room.last_message.seen &&
                          room.last_message.user_id !== currentUser.id ? (
                            <View
                              style={{
                                height: 15,
                                width: 15,
                                backgroundColor: "red",
                                borderRadius: "50%",
                              }}
                            ></View>
                          ) : null}
                        </ListItem.Title>
                        <ListItem.Subtitle
                          style={{
                            color: "darkgray",
                            marginLeft: 10,
                            fontSize:
                              responsiveSizes[height].sliderItemFontSize - 5,
                          }}
                        >
                          {room.last_message.content}
                        </ListItem.Subtitle>
                      </View>
                      <View
                        style={{
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <ListItem.Subtitle
                          style={{ color: "darkgray", flex: 1 }}
                        >
                          {getTiming(room.last_message.created_at)}
                        </ListItem.Subtitle>
                      </View>
                    </ListItem.Content>
                  </View>
                ))
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <Avatar
                    avatar={null}
                    size={responsiveSizes[height].newEventAvatarSize}
                    withRadius={true}
                  />
                  <ListItem.Content
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 2 }}>
                      <ListItem.Title
                        style={{
                          color: "white",
                          marginLeft: 10,
                          fontSize: responsiveSizes[height].sliderItemFontSize,
                        }}
                      >
                        deleted user
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{
                          color: "darkgray",
                          marginLeft: 10,
                          fontSize:
                            responsiveSizes[height].sliderItemFontSize - 5,
                        }}
                      >
                        {room.last_message.content}
                      </ListItem.Subtitle>
                    </View>
                    <View
                      style={{
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <ListItem.Subtitle style={{ color: "darkgray", flex: 1 }}>
                        {getTiming(room.last_message.created_at)}
                      </ListItem.Subtitle>
                    </View>
                  </ListItem.Content>
                </View>
              )}
            </ListItem>
          );
        })}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  chatrooms: state.chatrooms,
});
export default connect(mapStateToProps)(Messages);
