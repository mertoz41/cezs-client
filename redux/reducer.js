const initialState = {
  currentUser: null,
  recordedVideo: null,
  loggedIn: false,
  timeline: [],
  selectedMarker: null,
  selectedEvent: null,
  markerAccounts: [],
  markerPosts: [],
  notifications: [],
  chatrooms: [],
  newFollowedPosts: [],
  notificationChannel: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_LOGGED_IN":
      return { ...state, loggedIn: true };
    case "LOG_USER_OUT":
      return {
        ...state,
        loggedIn: false,
        chatrooms: [],
        notificationChannel: null,
      };
    case "UPDATE_CURRENT_USER":
      return { ...state, currentUser: action.currentUser };
    case "VIDEO_INCOMING":
      return { ...state, recordedVideo: action.recordedVideo };
    case "VIDEO_UPLOADED":
      return { ...state, recordedVideo: null, timeline: action.timeline };
    case "NOTIFICATION_CHANNEL":
      return { ...state, notificationChannel: action.notificationChannel };
    case "SELECT_MARKER":
      return {
        ...state,
        selectedMarker: action.selectedMarker,
        markerAccounts: action.markerAccounts,
        markerPosts: action.markerPosts,
      };
    case "SELECT_EVENT":
      return {
        ...state,
        selectedEvent: action.selectedEvent,
      };
    case "UPDATE_MARKER":
      return {
        ...state,
        markerAccounts: action.markerAccounts
      }
    case "CLEAR_MARKER":
      return {
        ...state,
        selectedMarker: null,
        markerAccounts: [],
        markerPosts: [],
      };
    case "CLEAR_AUDITION_MARKER":
      return { ...state, markerAuditions: [], auditionMarker: null };
    case "NOTIFICATIONS":
      return { ...state, notifications: action.notifications };
    case "CHATROOMS":
      return { ...state, chatrooms: action.chatrooms };
    case "UPDATE_TIMELINE":
      return { ...state, timeline: action.timeline };
    case "UPDATE_NEW_FOLLOWED_POSTS":
      return { ...state, newFollowedPosts: action.newFollowedPosts };
    default:
      return state;
  }
}
export default reducer;
