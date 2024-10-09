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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, router } from "expo-router";
import { NGROK_URL } from "@env";

SplashScreen.preventAutoHideAsync();

export default function SignUp() {
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disable, setDisable] = useState(false);

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
    <SafeAreaView>
      <ScrollView>
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
            <Text style={styles.inputNameText}>Username</Text>
            <TextInput
              style={styles.inputFields}
              placeholder={"Enter a username..."}
              onChangeText={setUsername}
              inputMode={"text"}
              onEndEditing={async () => {
                const response = await fetch(
                  `${NGROK_URL}/CheckUsernameAvailable?username=${username}`
                );

                if (response.ok) {
                  const json = await response.json();

                  if (json.success) {
                    Alert.alert("Error", json.message);
                  }
                }
              }}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputNameText}>Password</Text>
            <TextInput
              style={styles.inputFields}
              placeholder={"Enter a password..."}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <Pressable
            disabled={disable}
            style={styles.signUpBtn}
            onPress={async () => {
              const mobileRegex = /^07[01245678]{1}[0-9]{7}$/;
              const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

              if (mobile.trim() === "") {
                Alert.alert("Error", "Mobile number cannot be empty");
              } else if (!mobileRegex.test(mobile)) {
                Alert.alert(
                  "Error",
                  "Invalid mobile number format. Please enter a valid number."
                );
              } else if (username.trim() === "") {
                Alert.alert("Error", "Username cannot be empty");
              } else if (password.trim() === "") {
                Alert.alert("Error", "Password cannot be empty");
              } else if (!passwordRegex.test(password)) {
                Alert.alert(
                  "Error",
                  "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=)."
                );
              } else {
                const response = await fetch(`${NGROK_URL}/SignUp`, {
                  method: "POST",
                  body: JSON.stringify({
                    mobile: mobile,
                    username: username,
                    password: password,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                setDisable(true);

                if (response.ok) {
                  const json = await response.json();
                  console.log(json);

                  if (json.success) {
                    Alert.alert("Success", json.message);
                    router.replace("/UploadProfilePic?mobile=" + mobile);
                  } else {
                    Alert.alert("Error", json.message);
                    setDisable(false);
                  }
                }
              }
            }}
          >
            {/* <FontAwesome5 name="user-alt" size={19} color="white" /> */}
            <Text style={styles.signUpBtnText}>Sign Up</Text>
          </Pressable>

          <Pressable style={styles.toggleSignInBtn}>
            <Text style={styles.toggleSignInTxt}>
              Already have an account?{" "}
            </Text>
            <Text style={[styles.toggleSignInTxt, styles.signinLink]}>
              <Link href="/SignIn">Sign In</Link>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// registerRootComponent(SignUp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 22,
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
    borderWidth: 1,
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
