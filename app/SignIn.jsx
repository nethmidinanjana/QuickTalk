import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { registerRootComponent } from "expo";
import { Link } from "expo-router";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

SplashScreen.preventAutoHideAsync();

export default function SignIn() {
  const logoPath = require("../assets/images/logo.png");

  const [loaded, error] = useFonts({
    "IstokWeb-Regular": require("../assets/fonts/IstokWeb-Regular.ttf"),
    "RobotoMono-Regular": require("../assets/fonts/RobotoMono-Regular.ttf"),
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
          <View style={styles.logoView}>
            <Image source={logoPath} style={styles.logoImage} />
            <Text style={styles.logoText}>QuickTalk</Text>
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputNameText}>Mobile</Text>
            <TextInput
              style={styles.inputFields}
              placeholder={"Enter your mobile..."}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputNameText}>Password</Text>
            <TextInput
              style={styles.inputFields}
              placeholder={"Enter a password..."}
            />
          </View>
          <Link href="/Home" asChild>
            <Pressable style={styles.signUpBtn}>
              <FontAwesome5 name="user-alt" size={19} color="white" />
              <Text style={styles.signUpBtnText}>Sign In</Text>
            </Pressable>
          </Link>

          <Pressable style={styles.toggleSignInBtn}>
            <Text style={styles.toggleSignInTxt}>
              New User? <Text style={styles.signinLink}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// registerRootComponent(SignIn);

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
  logoView: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: 10,
  },
  logoText: {
    fontSize: 27,
    fontFamily: "IstokWeb-Regular",
    marginBottom: 17,
  },
  inputView: {
    width: "100%",
    rowGap: 10,
  },
  inputNameText: {
    fontSize: 17,
    fontFamily: "RobotoMono-Regular",
    fontWeight: "semibold",
  },
  inputFields: {
    borderWidth: 2,
    width: "100%",
    borderRadius: 18,
    height: 49,
    borderColor: "rgba(0, 0, 0, 0.56)",
    paddingHorizontal: 10,
    paddingStart: 20,
    fontSize: 17,
  },
  signUpBtn: {
    flexDirection: "row",
    width: "100%",
    height: 49,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F70B3C",
    marginTop: 10,
    columnGap: 16,
  },
  signUpBtnText: {
    fontSize: 19,
    fontFamily: "RobotoMono-Regular",
    color: "#FFFFFF",
  },
  toggleSignInBtn: {
    marginBottom: 20,
  },
  toggleSignInTxt: {
    fontSize: 19,
    fontFamily: "RobotoMono-Regular",
    textAlign: "center",
  },
  signinLink: {
    color: "#F70B3C",
  },
});
