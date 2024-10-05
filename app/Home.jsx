import * as SplashScreen from "expo-splash-screen";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { registerRootComponent } from "expo";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { MessageContainer } from "../components/MessageContainer";
import { BottomBar } from "../components/BottomBar";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const dots = require("../assets/images/3dots.png");

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
        <Text style={styles.headerMainTxt}>Chats</Text>
        <Pressable>
          <Image source={dots} style={styles.dots} />
        </Pressable>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          type={"text"}
          placeholder="Search..."
          placeholderTextColor="gray"
        />
        <Pressable>
          <FontAwesome5 name="search" size={20} color="gray" />
        </Pressable>
      </View>

      <ScrollView
        style={{ marginTop: 20 }}
        contentContainerStyle={styles.scrollViewContent}
      >
        <MessageContainer />
        <MessageContainer />
        <MessageContainer />
        <MessageContainer />
        <MessageContainer />
        <MessageContainer />
      </ScrollView>
      <BottomBar />
    </SafeAreaView>
  );
}

// registerRootComponent(Home);

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
  },
  headerMainTxt: {
    fontFamily: "Roboto-Regular",
    fontSize: 36,
    fontWeight: "medium",
  },
  dots: {
    width: 30,
    height: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    height: 45,
    backgroundColor: "rgba(217, 217, 217, 0.21)",
    marginTop: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 9,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
});
