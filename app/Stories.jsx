import * as SplashScreen from "expo-splash-screen";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { BottomBar } from "../components/BottomBar";
import { StoryContainer } from "../components/StoryContainer";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NGROK_URL } from "@env";
import { FlashList } from "@shopify/flash-list";

SplashScreen.preventAutoHideAsync();

export default function Stories() {
  const [storiesArray, setStoriesArray] = useState([]);

  const [loaded, error] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  useEffect(() => {
    async function loadStories() {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);
      console.log(user.id);
      const response = await fetch(`${NGROK_URL}/LoadStories`);

      if (response.ok) {
        const json = await response.json();
        console.log(json);
        setStoriesArray(json);
        console.log(storiesArray);
      }
    }
    // setInterval(() => {
    loadStories();
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
        <Text style={styles.headerMainTxt}>Stories</Text>
        <Pressable
          style={styles.plusIconContainer}
          onPress={() => {
            router.push("/AddStories");
          }}
        >
          <FontAwesome5 name={"plus"} color={"white"} size={17} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <FlashList
          data={storiesArray}
          renderItem={({ item }) => (
            <StoryContainer
              text={item.message}
              imagePath={
                NGROK_URL + "/profile-images/" + item.userMobile + ".png"
              }
              storyImg={NGROK_URL + "/story-images/" + item.id + ".png"}
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
    paddingVertical: 5,
  },
  headerMainTxt: {
    fontFamily: "Roboto-Regular",
    fontSize: 36,
    fontWeight: "medium",
  },
  plusIconContainer: {
    width: 40,
    height: 40,
    padding: 10,
    backgroundColor: "#F70B3C",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingBottom: 90,
  },
  storyContainer: {
    width: "100%",
    borderRadius: 5,
  },
});
