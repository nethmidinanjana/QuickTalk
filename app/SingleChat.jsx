import * as SplashScreen from "expo-splash-screen";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Link, useLocalSearchParams } from "expo-router";
import { NGROK_URL } from "@env";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";

SplashScreen.preventAutoHideAsync();

export default function SingleChat() {
  const [chatArray, setChatArray] = useState({});
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState();

  const props = useLocalSearchParams();

  console.log(props.uid);
  console.log(props.loggedUserId);

  const selectedUserId = props.uid;
  const loggededUserId = props.loggedUserId;

  const avatar = require("../assets/images/profilepics/avatar2.jpg");

  const [loaded, error] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });
  console.log(NGROK_URL);
  useEffect(() => {
    console.log(`${NGROK_URL}/chatSocket`);

    const webSocket = new WebSocket(`${NGROK_URL}/chatSocket`);

    webSocket.onopen = () => {
      console.log("Connectd to websocket server");
      console.log(loggededUserId);

      if (loggededUserId && selectedUserId) {
        webSocket.send(`USER_ID:${loggededUserId}:${selectedUserId}`);
      }
    };

    webSocket.onmessage = (event) => {
      const receivedMessage = event.data;
      console.log("Received message: " + receivedMessage);

      try {
        const parsedMessage = JSON.parse(receivedMessage);
        console.log("Parsed chatArray: ", parsedMessage);

        setChatArray((prevChatArray) => {
          return {
            ...prevChatArray,
            ...parsedMessage,
          };
        });
      } catch (error) {
        console.log("Error: " + error);
      }
    };

    webSocket.onclose = () => {
      console.log("Disconnected from websocket server");
    };

    webSocket.onerror = (error) => {
      console.log("WebSocket error: " + error.message);
    };

    setWs(webSocket);

    return () => {
      webSocket.close();
    };
  }, []);

  useEffect(() => {
    async function loadChats() {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);
      setUserId(user.id);

      const response = await fetch(
        `${NGROK_URL}/LoadChats?logged_user_id=${user.id}&selected_user_id=${props.uid}`
      );

      if (response.ok) {
        const chatArray = await response.json();
        console.log(chatArray);
        setChatArray(chatArray);
      }
    }

    // setInterval(() => {
    loadChats();
    // }, 5000);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const sendMessage = () => {
    if (ws && message) {
      const formattedMessage = `${userId}:${selectedUserId}:${message}`;
      ws.send(formattedMessage);
      setMessage("");
    }
  };

  if (!loaded && !error) {
    return null;
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerView1}>
          <Link href={"/Home"} asChild>
            <FontAwesome5 name={"chevron-left"} color={"gray"} size={25} />
          </Link>
          {props.usernameLetters == undefined ? (
            <Image
              source={NGROK_URL + "/profile-images/" + props.mobile + ".png"}
              style={styles.dpImage}
            />
          ) : (
            <View style={[styles.dpImage, { backgroundColor: "#FFECC8" }]}>
              <Text style={{ fontSize: 20, color: "black" }}>
                {props.usernameLetters}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.name}>{props.username}</Text>
            <Text style={styles.online}>
              {props.status == 1 ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View style={styles.callContainer}>
          <Pressable>
            <FontAwesome5 name={"video"} color={"black"} size={20} />
          </Pressable>
          <Pressable>
            <FontAwesome5 name={"phone"} color={"black"} size={20} />
          </Pressable>
        </View>
      </View>

      {/* Header */}

      {/* Chat part */}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        {Object.keys(chatArray).length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlashList
              data={Object.keys(chatArray)}
              renderItem={({ item: date }) => {
                const messages = chatArray[date];

                return (
                  <View>
                    <View style={styles.dateView}>
                      <Text style={{ color: "gray" }}>{date}</Text>
                    </View>

                    {messages.map((message, index) => {
                      return (
                        <View key={index} style={styles.scrollViewContent}>
                          {message.side === "left" ? (
                            <View style={styles.msgBox1}>
                              <Text style={{ fontSize: 16 }}>
                                {message.message}
                              </Text>
                              <Text style={styles.timeText}>
                                {message.time}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.msgBox2}>
                              <Text style={{ fontSize: 16 }}>
                                {message.message}
                              </Text>
                              <Text style={styles.timeText}>
                                {message.time}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              }}
              estimatedItemSize={200}
            />
          </View>
        ) : (
          <Text style={styles.noChatsText}>Say Hi! 😀</Text>
        )}
      </KeyboardAvoidingView>
      {/* Chat part */}

      {/* Send mesg part */}
      <View style={styles.bottomView}>
        <TextInput
          type={"text"}
          style={styles.msginput}
          onChangeText={setMessage}
          value={message}
        />
        <Pressable style={styles.send} onPress={sendMessage}>
          <FontAwesome5 name={"paper-plane"} color={"white"} size={20} />
        </Pressable>
      </View>

      {/* Send mesg part */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "rgba(0, 0, 0, 0.09)",
    borderWidth: 1,
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dpImage: {
    width: 56,
    height: 56,
    borderColor: "rgba(0, 0, 0, 0.09)",
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerView1: {
    flexDirection: "row",
    columnGap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
  },
  online: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
  },
  callContainer: {
    flexDirection: "row",
    columnGap: 25,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  bottomView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 7,
    paddingHorizontal: 20,
    backgroundColor: "#FDC9D4",
    alignItems: "center",
    justifyContent: "space-between",
  },
  msginput: {
    flex: 8,
    height: 43,
    borderColor: "rgba(0, 0, 0, 0.33)",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  send: {
    flex: 1,
    borderColor: "#F70B3C",
    borderRadius: 20,
    borderWidth: 1,
    height: 43,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F70B3C",
  },
  msgBox1: {
    alignSelf: "flex-start",
    backgroundColor: "#F1EDED",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "80%",
    marginTop: 5,
  },
  msgBox2: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(247, 11, 60, 0.14)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "80%",
    marginTop: 5,
  },
  timeText: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "gray",
  },
  dateView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 6,
  },
  noChatsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
