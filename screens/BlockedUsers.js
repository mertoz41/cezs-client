import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from "react-native-elements";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { API_ROOT } from "../constants";
import store from "../redux/store";
import Header from "../components/reusables/Header";
import Toast from "react-native-toast-message";

const BlockedUsers = ({ currentUser, navigation }) => {
  const [users, setUsers] = useState([]);
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBlockedAccounts();
  }, []);

  const getBlockedAccounts = async () => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${API_ROOT}/userblocks`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setUsers(resp.users);
        setBands(resp.bands);
        setLoading(false);
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const unblockAccount = async (account) => {
    let token = await AsyncStorage.getItem("jwt");
    fetch(
      `http://${API_ROOT}/unblock${account.username ? "user" : "band"}/${
        account.id
      }`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        Toast.show({ type: "success", text1: "account unblocked." });
        let accounts = account.username ? users : bands;
        let filteredAccounts = accounts.filter(
          (acct) => acct.id !== account.id
        );
        if (account.username) {
          setUsers(filteredAccounts);
        } else {
          setBands(filteredAccounts);
        }
        let updatedCurrentUser = {
          ...currentUser,
          blocked_account_count: currentUser.blocked_account_count - 1,
        };
        store.dispatch({
          type: "UPDATE_CURRENT_USER",
          currentUser: updatedCurrentUser,
        });
      })
      .catch((err) => Toast.show({ type: "error", text1: err.message }));
  };

  const goBack = () => {
    navigation.goBack();
  };

  const renderBlockedAccounts = (list) => {
    return (
      <View>
        {list.map((acct, i) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
              borderBottomWidth: 1,
              borderBottomColor: "darkgray",
              paddingBottom: 5,
            }}
            key={i}
          >
            <View style={{ flexDirection: "row" }}>
              <Avatar
                source={{ uri: acct.avatar ? acct.avatar : acct.picture }}
                avatarStyle={{ borderRadius: 10 }}
                size={"medium"}
              />
              <Text
                style={{
                  fontSize: 22,
                  alignSelf: "center",
                  marginLeft: 10,
                  fontWeight: "600",
                  color: "white",
                }}
              >
                {acct.username ? acct.username : acct.name}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                borderColor: "#9370DB",
                borderWidth: 1,
                alignSelf: "center",
                padding: 5,
                borderRadius: 10,
              }}
              onPress={() => unblockAccount(acct)}
            >
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: "center",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                unblock
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="blocked accounts" goBack={goBack} />
      {loading ? (
        <ActivityIndicator
          color="gray"
          size="large"
          style={{ marginTop: 10 }}
        />
      ) : null}
      {renderBlockedAccounts(users)}
      {renderBlockedAccounts(bands)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2e2e",
  },
});
const mapStateToProps = (state) => ({ currentUser: state.currentUser });

export default connect(mapStateToProps)(BlockedUsers);
