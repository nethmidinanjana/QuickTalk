import { Pressable, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { NGROK_URL } from "@env";

SplashScreen.preventAutoHideAsync();

export function MessageContainer(props) {
  const avatar = require("../assets/images/profilepics/avatar2.jpg");

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
    <Pressable
      style={styles.mainContainer}
      onPress={() => {
        router.push({
          pathname: "/SingleChat",
          params: props,
        });
      }}
    >
      <View>
        {props.dpFound ? (
          <Image
            source={`${NGROK_URL}/profile-images/${
              props.mobile
            }.png?timestamp=${new Date().getTime()}`}
            style={[
              styles.dpImage,
              props.status == 1
                ? { borderColor: "#2A8B46" }
                : { borderColor: "black" },
            ]}
          />
        ) : (
          <View
            style={[
              styles.dpImage,
              { backgroundColor: "#D6A52C" },
              props.status == 1
                ? { borderColor: "#2A8B46" }
                : { borderColor: "black" },
            ]}
          >
            <Text style={{ fontSize: 20, color: "white" }}>
              {props.usernameLetters}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.chatRow}>
        {/* Message Container */}
        <View style={{ flex: 1, rowGap: 6 }}>
          <Text style={styles.name}>{props.username}</Text>
          <Text style={[styles.name, { fontSize: 16 }]} numberOfLines={1}>
            {props.message}
          </Text>
        </View>

        {/* Time and Count Container */}
        <View style={styles.rightSection}>
          {props.msgCount != 0 ? (
            <View
              style={[styles.countContainer, { backgroundColor: "#F70B3C" }]}
            >
              <Text style={styles.countTxt}>{props.msgCount}</Text>
            </View>
          ) : (
            <View style={styles.countContainer}></View>
          )}

          <Text>{props.time}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    columnGap: 15,
    alignItems: "center",
    marginTop: 10,
  },
  dpImage: {
    width: 66,
    height: 66,
    borderWidth: 4,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  chatRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
  },
  countContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  countTxt: {
    color: "white",
  },
  rightSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    rowGap: 4,
  },
});
