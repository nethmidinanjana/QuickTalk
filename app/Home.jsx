import * as SplashScreen from "expo-splash-screen";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { MessageContainer } from "../components/MessageContainer";
import { BottomBar } from "../components/BottomBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NGROK_URL } from "@env";
import { FlashList } from "@shopify/flash-list";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [chatArray, setChatArray] = useState([]);
  const [userId, setUserId] = useState();
  const [text, setText] = useState("");

  const dots = require("../assets/images/3dots.png");

  const [loaded, error] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    async function loadChatList() {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);
      setUserId(user.id);

      console.log(NGROK_URL);
      const response = await fetch(`${NGROK_URL}/LoadChatList?id=${user.id}`);

      if (response.ok) {
        const json = await response.json();

        if (json.success) {
          console.log(json.message);
          setChatArray(JSON.parse(json.jsonChatArray));
        }
      }
    }
    // setInterval(() => {
    loadChatList();
    // }, 5000);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerMainTxt}>Chats</Text>
        <Pressable>
          <Image source={dots} style={styles.dots} />
        </Pressable>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          type={"text"}
          placeholder="Search..."
          placeholderTextColor="gray"
          onChangeText={async (text) => {
            const response = await fetch(
              `${NGROK_URL}/LoadChatList?id=${userId}&query=${text}`
            );

            if (response.ok) {
              const json = await response.json();

              if (json.success) {
                console.log(JSON.parse(json.jsonChatArray));
                setChatArray(JSON.parse(json.jsonChatArray));
              }
            }
          }}
        />
        <Pressable>
          <FontAwesome5 name="search" size={20} color="gray" />
        </Pressable>
      </View>

      <View style={{ flex: 1, marginTop: 20, marginBottom: 70 }}>
        <FlashList
          data={chatArray}
          renderItem={({ item }) => (
            <MessageContainer
              dpFound={item.profile_image_found}
              mobile={item.other_user_mobile}
              username={item.other_user_name}
              {...(item.other_username_letter && {
                usernameLetters: item.other_username_letter,
              })}
              message={item.message}
              time={item.dateTime}
              msgCount={item.unseen_chat_count}
              uid={item.other_user_id}
              status={item.other_user_status}
              loggedUserId={userId}
            />
          )}
          estimatedItemSize={200}
        />
      </View>

      <BottomBar />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerMainTxt: {
    fontFamily: "Roboto-Regular",
    fontSize: 36,
    fontWeight: "medium",
  },
  dots: {
    width: 30,
    height: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    height: 45,
    backgroundColor: "rgba(217, 217, 217, 0.21)",
    marginTop: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 9,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
});
