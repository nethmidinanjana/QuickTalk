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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { BottomBar } from "../components/BottomBar";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { NGROK_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function AddStories() {
  const addIcon = require("../assets/images/addImg.png");
  const [image, setImage] = useState(addIcon);
  const [message, setMessage] = useState("");

  const storyImg1 = require("../assets/images/storyImgs/man-with-camera-near-river.jpg");
  const avatar1 = require("../assets/images/profilepics/avatar.jpg");

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
        <Text style={styles.headerMainTxt}>Add Stories</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Pressable
          style={styles.imagePicker}
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({});

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }}
        >
          <Image
            source={image}
            contentFit={"contain"}
            style={styles.uploadedImg}
          />
        </Pressable>
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={6}
          placeholder="Enter your message..."
          value={message}
          onChangeText={setMessage}
        />

        <Pressable
          style={styles.uploadImgBtn}
          onPress={async (event) => {
            event.persist();
            const userJson = await AsyncStorage.getItem("user");
            const user = JSON.parse(userJson);

            const formData = new FormData();
            formData.append("uid", user.id);
            formData.append("message", message);
            formData.append("storyImage", {
              name: "stoyImage",
              type: "image/png",
              uri: image,
            });

            const response = await fetch(`${NGROK_URL}/AddStories`, {
              method: "POST",
              body: formData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            if (response.ok) {
              const json = await response.json();

              if (json.success) {
                Alert.alert("Success", json.message);
                router.replace("/Stories");
              } else {
                Alert.alert("Error", json.message);
              }
            }
          }}
        >
          <Text style={styles.uploadImgBtnText}>Upload</Text>
          <FontAwesome5 name="upload" size={19} color="white" />
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
  imagePicker: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    // backgroundColor: "gray",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedImg: {
    width: "99%",
    height: 195,
    borderRadius: 10,
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 30,
    fontSize: 15,
    backgroundColor: "rgba(0, 0, 0, 0.11)",
  },
  uploadImgBtn: {
    flexDirection: "row",
    width: "100%",
    height: 49,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F70B3C",
    marginTop: 20,
    columnGap: 16,
  },
  uploadImgBtnText: {
    fontSize: 19,
    fontFamily: "RobotoMono-Regular",
    color: "#FFFFFF",
  },
});
