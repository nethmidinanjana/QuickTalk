import * as SplashScreen from "expo-splash-screen";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { registerRootComponent } from "expo";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { BottomBar } from "../components/BottomBar";
import { StoryContainer } from "../components/StoryContainer";

SplashScreen.preventAutoHideAsync();

export default function Stories() {
  const avatar1 = require("../assets/images/profilepics/avatar.jpg");
  const avatar2 = require("../assets/images/profilepics/avatar2.jpg");
  const avatar3 = require("../assets/images/profilepics/avatar3.png");

  const storyImg1 = require("../assets/images/storyImgs/man-with-camera-near-river.jpg");
  const storyImg2 = require("../assets/images/storyImgs/beautiful-butterfly-nature.jpg");
  const storyImg3 = require("../assets/images/storyImgs/photorealistic-view-tree-nature-with-branches-trunk.jpg");

  const [loaded, error] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

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
        <Pressable style={styles.plusIconContainer}>
          <FontAwesome5 name={"plus"} color={"white"} size={17} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <StoryContainer
          text={
            "Your full overlay text goes here. Add more text to make it longer.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa."
          }
          imagePath={avatar1}
          storyImg={storyImg1}
        />
        <StoryContainer
          text={"Your full overlay text goes here."}
          imagePath={avatar2}
          storyImg={storyImg2}
        />
        <StoryContainer
          text={
            "Your full overlay text goes here. Add more text to make it longer.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, "
          }
          imagePath={avatar3}
          storyImg={storyImg3}
        />
      </ScrollView>

      <BottomBar />
    </SafeAreaView>
  );
}

// registerRootComponent(Stories);

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

  scrollViewContent: {
    paddingBottom: 90,
  },
  storyContainer: {
    width: "100%",
    borderRadius: 5,
  },
});
