import * as SplashScreen from "expo-splash-screen";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Link, useLocalSearchParams } from "expo-router";
import { NGROK_URL } from "@env";
import { Image } from "expo-image";

SplashScreen.preventAutoHideAsync();

export default function SingleChat() {
  const props = useLocalSearchParams();

  console.log(props.uid);

  const avatar = require("../assets/images/profilepics/avatar2.jpg");

  const [loaded, error] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
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
        <View style={styles.headerView1}>
          <Link href={"/Home"} asChild>
            <FontAwesome5 name={"chevron-left"} color={"gray"} size={25} />
          </Link>
          {props.usernameLetters == undefined ? (
            <Image
              source={NGROK_URL + "/profile-images/" + props.mobile + ".png"}
              style={styles.dpImage}
            />
          ) : (
            <View style={[styles.dpImage, { backgroundColor: "#FFECC8" }]}>
              <Text style={{ fontSize: 20, color: "black" }}>
                {props.usernameLetters}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.name}>{props.username}</Text>
            <Text style={styles.online}>
              {props.status == 1 ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View style={styles.callContainer}>
          <Pressable>
            <FontAwesome5 name={"video"} color={"black"} size={20} />
          </Pressable>
          <Pressable>
            <FontAwesome5 name={"phone"} color={"black"} size={20} />
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.dateView}>
          <Text>2024/10/02</Text>
        </View>
        <View style={styles.msgBox1}>
          <Text style={{ fontSize: 16 }}>Hi Kevin.</Text>
          <Text style={styles.timeText}>11:05 AM</Text>
        </View>
        <View style={styles.msgBox2}>
          <Text style={{ fontSize: 16 }}>Hi Andrea, how are you?</Text>
          <Text style={styles.timeText}>11:07 AM</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <TextInput type={"text"} style={styles.msginput} />
        <View style={styles.send}>
          <FontAwesome5 name={"paper-plane"} color={"white"} size={20} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "rgba(0, 0, 0, 0.09)",
    borderWidth: 1,
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dpImage: {
    width: 56,
    height: 56,
    borderColor: "rgba(0, 0, 0, 0.09)",
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerView1: {
    flexDirection: "row",
    columnGap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
  },
  online: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
  },
  callContainer: {
    flexDirection: "row",
    columnGap: 25,
  },
  scrollViewContent: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  bottomView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 7,
    paddingHorizontal: 20,
    backgroundColor: "rgba(247, 11, 60, 0.22)",
    alignItems: "center",
    justifyContent: "space-between",
  },
  msginput: {
    flex: 8,
    height: 43,
    borderColor: "rgba(0, 0, 0, 0.33)",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.73)",
  },
  send: {
    flex: 1,
    borderColor: "#F70B3C",
    borderRadius: 20,
    borderWidth: 1,
    height: 43,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F70B3C",
  },
  msgBox1: {
    alignSelf: "flex-start",
    backgroundColor: "#F1EDED",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "80%",
    marginBottom: 10,
  },
  msgBox2: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(247, 11, 60, 0.14)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "80%",
    marginBottom: 10,
  },
  timeText: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "gray",
  },
  dateView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 6,
  },
});
