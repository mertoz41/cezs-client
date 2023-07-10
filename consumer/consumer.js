import AsyncStorage from "@react-native-async-storage/async-storage";
import ActionCableJwt from "react-native-action-cable-jwt";
import { API_ROOT } from "../constants";
const actionCableJwt = ActionCableJwt.createConnection(async () => {
  const token = await AsyncStorage.getItem("jwt");
  return token;
});

const consumer = actionCableJwt.createConsumer(`ws://${API_ROOT}/cable`);

export default consumer;
