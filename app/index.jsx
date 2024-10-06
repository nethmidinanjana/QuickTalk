import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const logoPath = require("../assets/images/logo.png");
  const gif = require("../assets/gifs/chatanimation.gif");

  const [loaded, error] = useFonts({
    "IstokWeb-Regular": require("../assets/fonts/IstokWeb-Regular.ttf"),
    "RobotoMono-Regular": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await AsyncStorage.getItem("user");

        if (user != null) {
          router.replace("/Home");
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkUser();
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Image source={logoPath} style={styles.logoImage} />
          <View style={styles.textView}>
            <Text style={styles.mainText}>Welcome to QuickTalk</Text>
            <Text style={styles.subText}>
              Connect with friends, family, or anyone, anytime, and enjoy
              seamless chats in one simple place!
            </Text>
          </View>
          {/* <Image source={gif} style={styles.gif} /> */}
          <Link href="/SignUp" asChild>
            <Pressable style={styles.Btn}>
              <Text style={styles.BtnTxt}>Get Started</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 15,
  },
  logoImage: {
    width: 92,
    height: 100,
  },
  textView: {
    marginTop: 20,
    rowGap: 6,
    alignItems: "center",
  },
  mainText: {
    fontSize: 30,
    fontFamily: "IstokWeb-Regular",
    textAlign: "center",
  },
  subText: {
    fontSize: 20,
    fontFamily: "IstokWeb-Regular",
    textAlign: "center",
  },
  gif: {
    width: 90,
    height: 90,
    marginTop: 20,
  },
  Btn: {
    width: "100%",
    height: 49,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F70B3C",
    marginTop: 30,
  },
  BtnTxt: {
    fontSize: 19,
    fontFamily: "RobotoMono-Regular",
    color: "#FFFFFF",
  },
});
