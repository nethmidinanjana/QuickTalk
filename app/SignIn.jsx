import {
  Alert,
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
import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NGROK_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function SignIn() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

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
              onChangeText={setMobile}
              inputMode={"tel"}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputNameText}>Password</Text>
            <TextInput
              style={styles.inputFields}
              placeholder={"Enter your password..."}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <Pressable
            style={styles.signUpBtn}
            onPress={async () => {
              const mobileRegex = /^07[01245678]{1}[0-9]{7}$/;

              if (mobile.trim() === "") {
                Alert.alert("Error", "Mobile number cannot be empty");
              } else if (!mobileRegex.test(mobile)) {
                Alert.alert(
                  "Error",
                  "Invalid mobile number format. Please enter a valid number."
                );
              } else if (password.trim() === "") {
                Alert.alert("Error", "Password cannot be empty");
              } else {
                const response = await fetch(`${NGROK_URL}/SignIn`, {
                  method: "POST",
                  body: JSON.stringify({
                    mobile: mobile,
                    password: password,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                if (response.ok) {
                  const json = await response.json();

                  if (json.success) {
                    const user = json.user;

                    try {
                      await AsyncStorage.setItem("user", JSON.stringify(user));
                      router.replace("/Home");
                    } catch (error) {
                      Alert.alert("Error", "Unable to process your request.");
                    }
                  } else {
                    Alert.alert("Error", json.message);
                  }
                }
              }
            }}
          >
            <FontAwesome5 name="user-alt" size={19} color="white" />
            <Text style={styles.signUpBtnText}>Sign In</Text>
          </Pressable>

          <Link href={"SignUp"} asChild>
            <Pressable style={styles.toggleSignInBtn}>
              <Text style={styles.toggleSignInTxt}>
                New User? <Text style={styles.signinLink}>Sign Up</Text>
              </Text>
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
