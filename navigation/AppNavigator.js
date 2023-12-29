import React, { useRef, useEffect, Fragment } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ImageBackground, View, Dimensions, Text } from "react-native";
import consumer from "../consumer/consumer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  FontAwesome,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Logo from "../assets/cezslogo.png";
import Timeline from "../screens/Timeline";
import { StatusBar } from "react-native";
import { API_ROOT } from "../constants";
import ProfileScreen from "../screens/Profile";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { connect } from "react-redux";
import BandEdit from "../screens/BandEdit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cam from "../screens/Cam";
import Upload from "../screens/Upload";
import store from "../redux/store";
import UserScreen from "../screens/User";
import SearchScreen from "../screens/Search";
import MessagesScreen from "../screens/Messages";
import MessageScreen from "../screens/Message";
import EditScreen from "../screens/Edit";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import ArtistScreen from "../screens/Artist";
import SongScreen from "../screens/Song";
import CommentScreen from "../screens/Comment";
import Follow from "../screens/Follow";
import NotificationScreen from "../screens/Notifications";
import NewBand from "../screens/NewBand";
import BandScreen from "../screens/Band";
import Posts from "../screens/Posts";
import Discover from "../screens/Discover";
// import * as Notifications from "expo-notifications";
import BlockedUsers from "../screens/BlockedUsers";
import { setUpChatrooms } from "../constants/reusableFunctions";
import {
  responsiveSizes,
  getUnseenMessagesNumber,
  getUnseenNotificationsNumber,
} from "../constants/reusableFunctions";
const { height } = Dimensions.get("window");
const EntryStack = createStackNavigator();
const EntryScreens = () => {
  return (
    <EntryStack.Navigator screenOptions={{ headerShown: false }}>
      <EntryStack.Screen name="Login" component={Login} />
      <EntryStack.Screen name="Register" component={Register} />
    </EntryStack.Navigator>
  );
};

const MessagesStack = createStackNavigator();
const MessagesScreens = () => (
  <MessagesStack.Navigator screenOptions={{ headerShown: false }}>
    <MessagesStack.Screen name="AllMessages" component={MessagesScreen} />
    <MessagesStack.Screen name="Message" component={MessageScreen} />
  </MessagesStack.Navigator>
);

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

function AppNavigator({
  currentUser,
  loggedIn,
  notis,
  chatrooms,
  notifications,
}) {
  const navigationRef = useRef(null);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  const kablo = useRef(null);

  useEffect(() => {
    if (loggedIn && currentUser) {
      connectToCable(currentUser.id);
    }
    return () => {
      if (kablo.current) {
        kablo.current.unsubscribe();
        // console.log(`unsubscribed from notifications channel`);
      }
    };
    // This listener is fired whenever a notification is received while the app is foregrounded
    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener((notification) => {
    //     if (notification.request.content.data.last_message) {
    //       // message notification
    //       let filteredUsers = notification.request.content.data.users.filter(
    //         (user) => user.id !== currentUser.id
    //       );
    //       let updatedChatroom = {
    //         ...notification.request.content.data,
    //         users: filteredUsers,
    //       };
    //       let filteredRooms = chatrooms.filter(
    //         (room) => room.id !== notification.request.content.data.id
    //       );
    //       let updatedRooms = [updatedChatroom, ...filteredRooms];
    //       store.dispatch({ type: "CHATROOMS", chatrooms: updatedRooms });
    //       // update chatrooms
    //     } else {
    //       let resp = notification.request.content.data;
    //       console.log("INCOMING NOTI", resp);
    //       let updatedComments = [...commentNotifications];
    //       let updatedApplauds = [...applaudNotifications];
    //       let updatedEvents = [...eventNotifications];
    //       let updatedAuditions = [...auditionNotifications];
    //       if (resp.audition_id) {
    //         // audition notification
    //         updatedAuditions.unshift(resp);
    //       } else if (resp.event_id) {
    //         // gig notification
    //         updatedEvents.unshift(resp);
    //       } else if (resp.applaud_id) {
    //         // applaud notification
    //         updatedApplauds.unshift(resp);
    //       } else {
    //         // comment notification
    //         updatedComments.unshift(resp);
    //       }
    //       store.dispatch({
    //         type: "NOTIFICATION_IDS_FOR_MARKING_SEEN",
    //         commentNotifications: updatedComments,
    //         followNotifications: followNotifications,
    //         eventNotifications: updatedEvents,
    //         auditionNotifications: updatedAuditions,
    //         applaudNotifications: updatedApplauds,
    //       });
    //       let updatedNotis = [notification.request.content.data, ...notis];
    //       store.dispatch({ type: "NOTIFICATIONS", notis: updatedNotis });
    //     }
    //   });

    // // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     // console.log(response.notification.request.content.data)
    //     let newResponse = response.notification.request.content.data;
    //     if (newResponse.last_message) {
    //       //   message notification
    //       let chatroom = newResponse;
    //       let filteredUsers = chatroom.users.filter(
    //         (user) => user.id !== currentUser.id
    //       );
    //       let updatedChatroom = { ...chatroom, users: filteredUsers };

    //       navigationRef.current.navigate("Message", { room: updatedChatroom });
    //     } else if (newResponse.latitude) {
    //       //   gig notification
    //       seeGigNotification(newResponse);
    //       navigationRef.current.navigate("Discover", newResponse);
    //     } else if (newResponse.follow_notification) {
    //       //  follow notification
    //       seeFollowNoti(newResponse);
    //       navigationRef.current.navigate("User", {
    //         id: newResponse.action_user_id,
    //         avatar: newResponse.action_user_avatar,
    //         username: newResponse.action_username,
    //       });
    //     } else if (newResponse.audition_id) {
    //       // audition notification
    //       seeAuditNoti(newResponse);
    //       navigationRef.current.navigate("Discover", newResponse);
    //     } else if (newResponse.playlist_id) {
    //       seePlaylistNoti(newResponse);
    //       navigationRef.current.navigate("Playlist", newResponse);
    //     } else {
    //       //   applaud or comment noti
    //       handleIncomingNotification(newResponse);
    //     }
    //   });
    // return () => {
    //   Notifications.removeNotificationSubscription(
    //     notificationListener.current
    //   );
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, [loggedIn, notifications, chatrooms]);

  const Tabs = createBottomTabNavigator();
  const HomeScreens = () => {
    return (
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Discover") {
              return (
                <SimpleLineIcons
                  name="globe"
                  size={responsiveSizes[height].backwardIcon}
                  color={color}
                />
              );
            } else if (route.name === "Search") {
              return (
                <FontAwesome
                  name="search"
                  size={responsiveSizes[height].backwardIcon}
                  color={color}
                />
              );
            } else if (route.name === "Social") {
              return (
                <View>
                  {getUnseenMessagesNumber(chatrooms, currentUser) +
                    getUnseenNotificationsNumber(notifications) >
                  0 ? (
                    <View
                      style={{
                        borderRadius: "50%",
                        height: 15,
                        width: 15,
                        backgroundColor: "red",
                        right: 0,
                        position: "absolute",
                        zIndex: 1,
                      }}
                    >
                      <Text style={{ textAlign: "center", color: "white" }}>
                        {getUnseenMessagesNumber(chatrooms, currentUser) +
                          getUnseenNotificationsNumber(notifications)}
                      </Text>
                    </View>
                  ) : null}
                  <MaterialCommunityIcons
                    name="playlist-music"
                    size={responsiveSizes[height].backwardIcon + 7}
                    color={color}
                  />
                </View>
              );
            } else if (route.name === "Profile") {
              return (
                <FontAwesome
                  name="user-o"
                  size={responsiveSizes[height].backwardIcon}
                  color={color}
                />
              );
            }
          },
          tabBarStyle: {
            backgroundColor: "#2e2e2e",
            height: responsiveSizes[height].bottomNavigatorHeight,
            flexDirection: "column",
          },
          tabBarActiveTintColor: "#9370DB",
          tabBarInactiveTintColor: "darkgray",
        })}
      >
        <Tabs.Screen
          name="Social"
          component={Timeline}
          options={({ route }) => ({
            tabBarVisible: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";
              if (routeName === "Edit") {
                return false;
              } else if (routeName === "NewBand") {
                return false;
              } else if (routeName === "EventsMap") {
                return false;
              } else if (routeName === "Comment") {
                return false;
              }
              return true;
            })(route),
          })}
        />
          <Tabs.Screen
            name="Discover"
            component={Discover}
            options={({ route }) => ({
              tabBarVisible: ((route) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                if (routeName === "Comment") {
                  return false;
                } else if (routeName === "EventsMap") {
                  return false;
                } else if (routeName === "Messages") {
                  return false;
                } else if (routeName === "Message") {
                  return false;
                } else if (routeName === "Discover") {
                  return false;
                } else if (routeName === "Upload") {
                  return false;
                }
                return true;
              })(route),
            })}
          />

        <Tabs.Screen
          name="Search"
          component={SearchScreen}
          options={({ route }) => ({
            tabBarVisible: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";
              if (routeName === "EventsMap") {
                return false;
              } else if (routeName === "Comment") {
                return false;
              }
              return true;
            })(route),
          })}
        />

        
        <Tabs.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ route }) => ({
            tabBarVisible: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";
              if (routeName === "Edit") {
                return false;
              } else if (routeName === "NewBand") {
                return false;
              } else if (routeName === "EventsMap") {
                return false;
              } else if (routeName === "Comment") {
                return false;
              }
              return true;
            })(route),
          })}
        />
      </Tabs.Navigator>
    );
  };
  const connectToCable = (id) => {
    let cable = consumer.subscriptions.create(
      { channel: "NotificationsChannel", user_id: id },
      {
        connected() {
          // console.log("connected to notifications channel" + id);
        },
        received(data) {
          // HANDLE MESSAGE FOR EXISTING CHAT
          let oldChatrooms = store.getState().chatrooms;
          let navRef = navigationRef;
          if (data.chatroom_id) {
            // message notification
            if (
              navRef.current?.getCurrentRoute().name === "Message" &&
              navRef.current?.getCurrentRoute().params.room.id ===
                data.chatroom_id
            ) {
              return;
            }
            let updatedChatrooms = [...oldChatrooms];
            let found = updatedChatrooms.find(
              (croom) => croom.id == data.chatroom_id
            );
            let index = updatedChatrooms.indexOf(found);
            let updatedRoom = { ...found, last_message: data };
            updatedChatrooms.splice(index, 1, updatedRoom);
            Toast.show({
              type: "success",
              text1: `${data.username}: ${data.content}`,
            });
            store.dispatch({
              type: "CHATROOMS",
              chatrooms: updatedChatrooms,
            });
          } else if (data.last_message) {
            // // HANDLE NEW MESSAGE
            let updatedChatroom = {
              ...data,
              users: data.users.filter((user) => user.id !== currentUser.id),
            };
            Toast.show({
              type: "success",
              text1: `${
                data.users.filter((user) => user.id !== currentUser.id)[0]
                  .username
              }: ${data.last_message.content}`,
            });
            store.dispatch({
              type: "CHATROOMS",
              chatrooms: [updatedChatroom, ...oldChatrooms],
            });
          } else {
            Toast.show({
              type: "success",
              text1: data.message,
            });
            let oldNotifications = [...store.getState().notifications];
            let updatedNotifications = [data, ...oldNotifications];
            store.dispatch({
              type: "NOTIFICATIONS",
              notifications: updatedNotifications,
            });
          }
        },
      }
    );
    // cable
    kablo.current = cable;
    store.dispatch({
      type: "NOTIFICATION_CHANNEL",
      notificationChannel: cable,
    });
  };

  // seeGigNotification = async (noti) => {
  //   // marks gig noti seen
  //   updateNotifications(noti);
  //   let token = await AsyncStorage.getItem("jwt");
  //   fetch(`http://${API_ROOT}/seegignoti/${noti.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // };
  // seePlaylistNoti = async (noti) => {
  //   // marks playlist noti seen
  //   updateNotifications(noti);
  //   let token = await AsyncStorage.getItem("jwt");
  //   fetch(`http://${API_ROOT}/seeplaylistnoti/${noti.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // };

  // seeAuditNoti = async (noti) => {
  //   // marks audition noti seen
  //   updateNotifications(noti);
  //   let token = await AsyncStorage.getItem("jwt");
  //   fetch(`http://${API_ROOT}/seeauditnoti/${noti.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // };
  // seeFollowNoti = async (noti) => {
  //   // marks follow noti seen
  //   updateNotifications(noti);
  //   let token = await AsyncStorage.getItem("jwt");
  //   fetch(`http://${API_ROOT}/seefollownoti/${noti.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // };

  const updateNotifications = (noti) => {
    // updates notification redux
    let filteredNotifications = notis.filter((notifi) => notifi.id !== noti.id);
    let updatedNoti = { ...noti, seen: true };
    let updatedNotis = [updatedNoti, ...filteredNotifications];
    store.dispatch({ type: "NOTIFICATIONS", notis: updatedNotis });
  };

  const handleIncomingNotification = async (noti) => {
    updateNotifications(noti);

    let token = await AsyncStorage.getItem("jwt");

    if (noti.applaud_noti) {
      // marks applaud noti seen then navigates to content
      fetch(`http://${API_ROOT}/seeapplaudnoti/${noti.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          navigationRef.current.navigate("Posts", {
            posts: [resp],
            postIndex: 0,
            destination: `${currentUser.username}${
              currentUser.username[currentUser.username.length - 1] == "s"
                ? "'"
                : "'s"
            } post`,
          });
        });
    } else {
      // marks comment noti seen then navigates to content
      fetch(`http://${API_ROOT}/seecommentnoti/${noti.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          navigationRef.current.navigate("Posts", {
            posts: [resp],
            postIndex: 0,
            destination: `${currentUser.username}${
              currentUser.username[currentUser.username.length - 1] == "s"
                ? "'"
                : "'s"
            } post`,
          });
        });
    }
  };

  // registerForPushNotificationsAsync = async () => {
  //   let token;
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       alert("Failed to get push token for push notification!");
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     if (currentUser && currentUser.notification_token !== token) {
  //       let updatedCurrentUser = { ...currentUser, notification_token: token };
  //       store.dispatch({
  //         type: "UPDATE_CURRENT_USER",
  //         currentUser: updatedCurrentUser,
  //       });

  //       let userToken = await AsyncStorage.getItem("jwt");

  //       fetch(`http://${API_ROOT}/usertoken`, {
  //         method: "POST",
  //         headers: {
  //           "Content-type": "application/json",
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //         body: JSON.stringify({ user_id: currentUser.id, expo_token: token }),
  //       })
  //         .then((resp) => resp.json())
  //         .then((resp) => {
  //           console.log(resp);
  //         });
  //       // create or update users notification token
  //     }
  //   } else {
  //     alert("Must use physical device for Push Notifications");
  //   }
  //   return token;
  // };
  const RootStack = createStackNavigator();

  return (
    <View style={{ flex: 1, backgroundColor: "#2e2e2e" }}>
      <ImageBackground
        source={Logo}
        resizeMode="contain"
        imageStyle={{ opacity: 0.2 }}
        style={{ flex: 1 }}
      >
        <NavigationContainer
          ref={navigationRef}
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: "transparent",
            },
          }}
        >
          <StatusBar barStyle="light-content" backgroundColor="#00BCD4" />
          <RootStack.Navigator
            initialRouteName="App"
            screenOptions={{ headerShown: false }}
          >
            {loggedIn ? (
              <>
                <RootStack.Screen name="App" component={HomeScreens} />
                <RootStack.Screen name="User" component={UserScreen} />
                <RootStack.Screen name="Song" component={SongScreen} />
                <RootStack.Screen name="Artist" component={ArtistScreen} />
                <RootStack.Screen name="Band" component={BandScreen} />
                <RootStack.Screen name="BandEdit" component={BandEdit} />
                <RootStack.Screen name="Follow" component={Follow} />
                <RootStack.Screen name="Posts" component={Posts} />
                <RootStack.Screen name="Comment" component={CommentScreen} />
                <RootStack.Screen name="Messages" component={MessagesScreens} />
                <RootStack.Screen name="Message" component={MessageScreen} />

                <RootStack.Screen
                  name="BlockedUsers"
                  component={BlockedUsers}
                />
                <RootStack.Screen
                  name="Notifications"
                  component={NotificationScreen}
                />
                <RootStack.Screen
                  name="Camera"
                  component={Cam}
                  options={{ headerShown: false }}
                />
                <RootStack.Screen
                  name="Upload"
                  component={Upload}
                  options={{ title: "Upload" }}
                />
                <RootStack.Screen name="Edit" component={EditScreen} />
                <RootStack.Screen name="NewBand" component={NewBand} />
              </>
            ) : (
              <RootStack.Screen name="Auth" component={EntryScreens} />
            )}
          </RootStack.Navigator>
        </NavigationContainer>
      </ImageBackground>
    </View>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  loggedIn: state.loggedIn,
  notis: state.notis,
  chatrooms: state.chatrooms,
  notifications: state.notifications,
});
const connectComponent = connect(mapStateToProps);
export default connectComponent(AppNavigator);
