import store from "../redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROOT } from ".";
const ipadSizes = {
  header: 75,
  logoHeight: 60,
  logoWidth: 155,
  discoverEventFilterMargin: 80,
  sliderItemFontSize: 28,
  borderWidth: 2,
  iconSize: 40,
  settingsIcon: 40,
  bottomNavigatorHeight: 85,
  displayLabels: false,
  favoriteIcon: 43,
  thumbnailContainerHeight: 1300,
  backwardIcon: 34,
  bandMemberAvatar: 250,
  bioMaxWidth: 710,
  locationAvatarFit: 46,
  postItemAccountFontSize: 35,
  postItemTimeFont: 22,
  postItemSongFont: 35,
  postItemArtistFont: 26,
  postItemAvatar: 50,
  postItemVideo: 900,
  postItemLowerVidFont: 29,
  postItemApplaud: 40,
  locationContent: 450,

  newEventAvatarSize: 150,
  locationButtonHeight: 70,
  locationButtonWidth: 70,
  locationButtonFontSize: 45,

  itemWriting: {
    fontSize: 28,
    color: "black",
    fontWeight: "500",
    textAlign: "center",
  },
  selectedItemWriting: {
    fontSize: 28,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },

  selectedItem: {
    backgroundColor: "rgba(147,112,219, .3)",

    // backgroundColor: "rgba(147,112,219, .6)",
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    borderColor: "rgba(147,112,219, .3)",
  },

  regularItem: {
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
    borderColor: "gray",
  },

  inputFontSize: 34,
  messageFontSize: 30,
  sliderItem: {
    fontSize: 28,
    color: "white",
    textAlign: "center",
    fontWeight: "500",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },

  screenTitle: 34,
  sectionTitle: {
    color: "white",
    marginLeft: 10,
    fontSize: 30,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    marginBottom: 5,
  },

  sectionTitleDark: {
    fontSize: 30,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    marginBottom: 5,
  },

  discoverFilterSize: 31,
  discoverAddButton: 60,
  avatar: 550,
};

const iphoneSizes = {
  header: 75,
  logoHeight: 40,
  logoWidth: 105,
  sliderItemFontSize: 18,
  borderWidth: 1,
  iconSize: 27,
  discoverEventFilterMargin: 80,

  settingsIcon: 30,
  bottomNavigatorHeight: 80,
  displayLabels: true,
  favoriteIcon: 33,
  backwardIcon: 24,
  bandMemberAvatar: 100,
  bioMaxWidth: 510,
  thumbnailContainerHeight: 700,
  locationAvatarFit: 16,
  postItemAccountFontSize: 25,
  postItemTimeFont: 12,
  postItemSongFont: 25,
  postItemArtistFont: 16,
  postItemAvatar: 40,
  postItemVideo: 600,
  postItemLowerVidFont: 19,
  postItemApplaud: 30,
  locationContent: 250,
  newEventAvatarSize: 50,
  locationButtonHeight: 45,
  locationButtonWidth: 45,
  locationButtonFontSize: 25,

  itemWriting: {
    fontSize: 18,
    color: "black",
    fontWeight: "500",
    textAlign: "center",
  },

  selectedItemWriting: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },

  selectedItem: {
    backgroundColor: "rgba(147,112,219, .4)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    borderColor: "rgba(147,112,219, .6)",
  },

  regularItem: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    borderColor: "gray",
  },

  inputFontSize: 24,
  messageFontSize: 20,
  sliderItem: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
  },

  screenTitle: 24,
  sectionTitle: {
    color: "white",
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    marginBottom: 5,
  },

  sectionTitleDark: {
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#9370DB",
    marginBottom: 5,
  },

  discoverFilterSize: 17,
  discoverAddButton: 40,
  avatar: 300,
};

const smallerIphoneSizes = {
  ...iphoneSizes,
  header: 60,
  bottomNavigatorHeight: 55,
  discoverFilterSize: 18,
  locationAvatarFit: 18,
};

const responsiveSizes = {
  1366: ipadSizes,
  // pro 12.9"
  1194: ipadSizes,
  // pro 11"
  1180: ipadSizes,
  // 10th gen
  1112: ipadSizes,
  // pro 2nd gen 10.5"
  1080: ipadSizes,
  // 9th gen, 8th gen, 7th gen,
  1024: ipadSizes,
  // mini,
  926: iphoneSizes,
  // 14 plus, 13 pro max, 12 pro max,
  932: { ...iphoneSizes, header: 90, discoverEventFilterMargin: 95 },
  // 14 pro max,
  896: iphoneSizes,
  // 11 pro max
  852: iphoneSizes,
  // 14 pro,
  844: iphoneSizes,
  // 14, 13 pro, 12, 12 pro
  812: iphoneSizes,
  // 13 mini, 12 mini

  736: smallerIphoneSizes,
  // 8 plus
  // 7 plus
  // 6 plus
  667: smallerIphoneSizes,
  // SE 2nd gen
  // 8
  // 7
  // 6s
};

const getTiming = (created_at) => {
  let _MS_PER_DAY = 1000 * 60 * 60 * 24;
  let timeNow = new Date();
  let created = new Date(created_at);
  // minutes
  let difference = timeNow - created;
  let differenceMinute = Math.floor(difference / 1000 / 60);
  let differenceHour = Math.floor(difference / 1000 / 60 / 60);

  let utcnow = Date.UTC(
    timeNow.getFullYear(),
    timeNow.getMonth(),
    timeNow.getDate()
  );
  let utcitem = Date.UTC(
    created.getFullYear(),
    created.getMonth(),
    created.getDate()
  );

  if (differenceMinute < 60) {
    if (differenceMinute < 1) {
      return "just now";
    } else {
      return `${differenceMinute} ${
        differenceMinute == 1 ? "minute" : "minutes"
      } ago`;
    }
  } else if (differenceHour < 24) {
    if (differenceHour == 1) {
      return `${differenceHour} hour ago`;
    } else {
      return `${differenceHour} hours ago`;
    }
  } else {
    let result = Math.floor((utcnow - utcitem) / _MS_PER_DAY);
    if (result == 1) {
      return `${result} day ago`;
    } else {
      return `${result} days ago`;
    }
  }
};

const removePostsFromTimeline = (type, id) => {
  let filteredTimeline = [...store.getState().timeline].filter(
    (post) => post[type] && post[type] !== id
  );
  store.dispatch({ type: "UPDATE_TIMELINE", timeline: filteredTimeline });
};

const addPostsToTimeline = async (posts) => {
  let token = await AsyncStorage.getItem("jwt");

  const postIds = posts.map((post) => post.id);
  fetch(`http://${API_ROOT}/musicposts`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      posts: postIds,
    }),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      const sortedTimeline = [...resp, ...store.getState().timeline].sort(
        (a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        }
      );
      store.dispatch({ type: "UPDATE_TIMELINE", timeline: sortedTimeline });
    });
};

const preparePostView = (item, posts, title) => {
  let postIds = posts.map((post) => post.id);
  let sliced = postIds.slice(postIds.indexOf(item.id));
  let obj = {
    postId: item.id,
    title: title,
    posts: sliced,
  };
  return obj;
};

const setUpChatrooms = (chatrooms, id) => {
  let updatedChatrooms = chatrooms.map((room) => {
    let users = room.users.filter((user) => user.id !== id);
    return { ...room, users: users };
  });
  let sorted = updatedChatrooms.sort((a, b) => {
    return (
      new Date(b.last_message.created_at) - new Date(a.last_message.created_at)
    );
  });
  store.dispatch({ type: "CHATROOMS", chatrooms: sorted });
};

const checkEmail = (email) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(email);
};

const locationItemWidth = (width) => {
  // return 50;
};
export {
  getTiming,
  preparePostView,
  setUpChatrooms,
  checkEmail,
  responsiveSizes,
  locationItemWidth,
  addPostsToTimeline,
  removePostsFromTimeline,
};
