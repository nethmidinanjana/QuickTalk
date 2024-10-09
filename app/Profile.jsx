import * as SplashScreen from "expo-splash-screen";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomBar } from "../components/BottomBar";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { NGROK_URL } from "@env";

SplashScreen.preventAutoHideAsync();

export default function Profile() {
  const addIcon = require("../assets/images/addImg.png");

  const [selectedDistrict, setSelectedDistrict] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [userName, setUserName] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function loadUser() {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);
      setUserId(user.id);

      const response = await fetch(`${NGROK_URL}/LoadUser?id=${user.id}`);

      if (response.ok) {
        const json = await response.json();

        if (json.success) {
          setMobile(json.mobile);
          setUserName(json.userName);
          setProfilePic(
            `${NGROK_URL}/profile-images/${
              json.mobile
            }.png?timestamp=${new Date().getTime()}`
          );
        }
      }
    }
    loadUser();
  }, []);

  const [loaded, error] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
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
      <View style={styles.header}>
        <Text style={styles.headerMainTxt}>Your Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageContainer}>
          <Image source={profilePic} style={styles.profileImage} />

          <View style={styles.overlayContainer}>
            <Pressable
              style={styles.overlayButton}
              onPress={async () => {
                let result = await ImagePicker.launchImageLibraryAsync({});

                if (!result.canceled) {
                  setProfilePic(result.assets[0].uri);
                }
              }}
            >
              <Text style={styles.overlayButtonText}>Select Image</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ marginTop: 10, rowGap: 10 }}>
          <Text style={styles.textName}>Username</Text>
          <TextInput
            type={"text"}
            style={styles.textinput}
            value={userName}
            onChangeText={setUserName}
          />
        </View>
        <View style={{ marginTop: 10, rowGap: 10 }}>
          <Text style={styles.textName}>Mobile Number</Text>
          <TextInput
            type={"text"}
            style={styles.textinput}
            value={mobile}
            editable={false}
          />
        </View>
        <View style={{ marginTop: 10, rowGap: 10 }}>
          <Text style={styles.textName}>District</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedDistrict}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDistrict(itemValue)
              }
            >
              <Picker.Item label="Ratnapura" value="Ratnapura" />
              <Picker.Item label="Colombo" value="Colombo" />
              <Picker.Item label="Kandy" value="Kandy" />
              <Picker.Item label="Galle" value="Galle" />
            </Picker>
          </View>
        </View>

        <View style={{ marginTop: 10, rowGap: 10 }}>
          <Text style={styles.textName}>City</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCity(itemValue)
              }
            >
              <Picker.Item label="Ratnapura" value="Ratnapura" />
              <Picker.Item label="Colombo" value="Colombo" />
              <Picker.Item label="Kandy" value="Kandy" />
              <Picker.Item label="Galle" value="Galle" />
            </Picker>
          </View>
        </View>

        <Pressable
          style={[styles.Btn, { backgroundColor: "#F70B3C" }]}
          onPress={async () => {
            const formData = new FormData();
            formData.append("username", userName);
            formData.append("userId", userId);
            formData.append("profilePic", {
              name: "profilePic",
              type: "image/png",
              uri: profilePic,
            });
            const response = await fetch(`${NGROK_URL}/UpdateProfile`, {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const json = await response.json();

              if (json.success) {
                router.replace("/Profile");
              } else {
                Alert.alert("Error", json.message);
              }
            }
          }}
        >
          <Text style={styles.BtnText}>Update Profile</Text>
        </Pressable>
        <Pressable
          style={[styles.Btn, { backgroundColor: "black" }]}
          onPress={async () => {
            const response = await fetch(
              `${NGROK_URL}/SetOffline?id=${userId}`
            );

            if (response.ok) {
              const json = await response.json();

              if (json.success) {
                AsyncStorage.removeItem("user");
                router.replace("/");
              }
            }
          }}
        >
          <Text style={styles.BtnText}>Logout</Text>
        </Pressable>
      </ScrollView>

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
  scrollViewContent: {
    paddingBottom: 90,
  },
  imageContainer: {
    width: "100%",
    borderRadius: 8,
    position: "relative",
    marginTop: 25,
    marginBottom: 10,
  },
  profileImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.22)",
    borderRadius: 8,
  },
  overlayButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "rgba(217, 217, 217, 0.57)",
    borderRadius: 5,
  },
  overlayButtonText: {
    fontFamily: "Roboto-Regular",
    fontSize: 20,
    fontWeight: "bold",
  },
  textName: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    fontWeight: "medium",
  },
  textinput: {
    borderColor: "rgba(0, 0, 0, 0.35)",
    borderWidth: 1,
    height: 55,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  picker: {
    borderColor: "rgba(0, 0, 0, 0.35)",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },

  Btn: {
    width: "100%",
    height: 49,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  BtnText: {
    fontSize: 19,
    fontFamily: "RobotoMono-Regular",
    color: "#FFFFFF",
  },
});
