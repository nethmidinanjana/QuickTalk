import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { NGROK_URL } from "@env";

SplashScreen.preventAutoHideAsync();

export default function UploadProfilePic() {
  const logoPath = require("../assets/images/logo.png");
  const addIcon = require("../assets/images/addImg.png");
  const [image, setImage] = useState(addIcon);

  const param = useLocalSearchParams();

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
          <View>
            <Text style={styles.chooseTxt}>Choose Profile Picture</Text>
          </View>

          <Pressable
            style={styles.uploadImgBtn}
            onPress={async () => {
              const formData = new FormData();
              formData.append("mobile", param.mobile);
              formData.append("profileImage", {
                name: "profileImage",
                type: "image/png",
                uri: image,
              });

              const response = await fetch(`${NGROK_URL}/UploadProfilePic`, {
                method: "POST",
                body: formData,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });

              if (response.ok) {
                const json = await response.json();

                console.log(json);

                if (json.success) {
                  router.replace("/SignIn");
                } else {
                  Alert.alert("Error", json.message);
                }
              }
            }}
          >
            <Text style={styles.uploadImgBtnText}>Upload</Text>
            <FontAwesome5 name="upload" size={19} color="white" />
          </Pressable>

          <Pressable
            style={styles.skipPressable}
            onPress={() => {
              router.replace("/Home");
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "IstokWeb-Regular",
                fontWeight: "medium",
              }}
            >
              Skip
            </Text>
            <FontAwesome5 name="forward" size={19} color="black" />
          </Pressable>
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
  uploadImgBtn: {
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
  uploadImgBtnText: {
    fontSize: 19,
    fontFamily: "RobotoMono-Regular",
    color: "#FFFFFF",
  },
  chooseTxt: {
    fontSize: 22,
    fontFamily: "IstokWeb-Regular",
  },
  skipPressable: {
    height: 45,
    flexDirection: "row",
    columnGap: 13,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 15,
  },
  imagePicker: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderColor: "gray",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
  },
  uploadedImg: {
    height: 195,
    width: 195,
    borderRadius: 100,
  },
});
