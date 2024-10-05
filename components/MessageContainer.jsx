import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Link } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function MessageContainer() {
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
    <Link href="/SingleChat" asChild>
      <Pressable style={styles.mainContainer}>
        <View>
          <Image source={avatar} style={styles.dpImage} />
        </View>
        <View style={styles.chatRow}>
          {/* Message Container */}
          <View style={{ flex: 1, rowGap: 6 }}>
            <Text style={styles.name}>Tashi Gamage</Text>
            <Text style={[styles.name, { fontSize: 16 }]} numberOfLines={1}>
              Hello Kevin.hello
              helooo...........................................
            </Text>
          </View>

          {/* Time and Count Container */}
          <View style={styles.rightSection}>
            <View style={styles.countContainer}>
              <Text style={styles.countTxt}>3</Text>
            </View>
            <Text>11:34 AM</Text>
          </View>
        </View>
      </Pressable>
    </Link>
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
    borderColor: "#2A8B46",
    borderWidth: 3,
    borderRadius: 50,
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
    backgroundColor: "#F70B3C",
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
  },
});
