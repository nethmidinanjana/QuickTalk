import * as SplashScreen from "expo-splash-screen";
import { Image, Pressable, Text, View } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function BottomBar() {
  const chatImg = require("../assets/images/chat.png");
  const posts = require("../assets/images/posts.png");
  const profile = require("../assets/images/profile.png");
  const setting = require("../assets/images/setting.png");

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
    <View style={styles.bottomView}>
      <Link href="/Home" asChild>
        <Pressable style={styles.bottomPressable}>
          <Image source={chatImg} style={styles.bottomImg} />
          <Text style={styles.bottomBarText}>Chat</Text>
        </Pressable>
      </Link>
      <Link href="/Stories" asChild>
        <Pressable style={styles.bottomPressable}>
          <Image source={posts} style={styles.bottomImg} />
          <Text style={styles.bottomBarText}>Stories</Text>
        </Pressable>
      </Link>

      <Pressable style={styles.bottomPressable}>
        <Image source={setting} style={styles.bottomImg} />
        <Text style={styles.bottomBarText}>Setting</Text>
      </Pressable>

      <Link href="/Profile" asChild>
        <Pressable style={styles.bottomPressable}>
          <Image source={profile} style={styles.bottomImg} />
          <Text style={styles.bottomBarText}>Profile</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 7,
    paddingHorizontal: 40,
    backgroundColor: "#F70B3C",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomPressable: {
    rowGap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomImg: {
    width: 26,
    height: 26,
  },
  bottomBarText: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: "white",
  },
});
