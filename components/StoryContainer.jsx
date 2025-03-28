import * as SplashScreen from "expo-splash-screen";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";

SplashScreen.preventAutoHideAsync();

export function StoryContainer({
  text,
  imagePath,
  storyImg,
  other_username_letter,
}) {
  const [showFullText, setShowFullText] = useState(false);
  const [isTextOverFlowing, setIsTextOverFlowing] = useState(false);
  const [textChecked, setTextChecked] = useState(false);

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

  const handleTextLayout = (e) => {
    if (!textChecked && e.nativeEvent.lines.length > 2) {
      setIsTextOverFlowing(true);
      setTextChecked(true);
    }
  };

  return (
    <View style={styles.storyContainer}>
      <Image source={storyImg} style={styles.storyImg} />

      <View style={styles.topLeftOverlay}>
        {imagePath ? (
          <Image source={imagePath} style={styles.profileImg} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{other_username_letter}</Text>
          </View>
        )}
      </View>

      <View style={styles.overlayContent}>
        {showFullText ? (
          <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>
            <Text style={styles.overlayText}>{text}</Text>
            <Pressable onPress={() => setShowFullText(false)}>
              <Text style={styles.seeMoreText}>See less...</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              onTextLayout={handleTextLayout}
              style={styles.overlayText}
            >
              {text}
            </Text>
            {isTextOverFlowing && (
              <Pressable onPress={() => setShowFullText(true)}>
                <Text style={styles.seeMoreText}>See more...</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  storyContainer: {
    width: "100%",
    borderRadius: 5,
    position: "relative",
    marginTop: 25,
    borderColor: "gray",
    borderWidth: 1,
  },
  storyImg: {
    width: "100%",
    height: 392,
    borderRadius: 5,
  },

  // Top-left overlay styles
  topLeftOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 8,
  },
  topLeftText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  placeholder: {
    width: 66,
    height: 66,
    borderColor: "white",
    borderWidth: 6,
    borderRadius: 50,
    backgroundColor: "gray", // Placeholder background color
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  // Bottom overlay styles
  overlayContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.63)",
    borderRadius: 5,
  },
  scrollView: {
    height: 100,
  },
  overlayText: {
    color: "#000",
    fontSize: 19,
    fontWeight: "semibold",
    textAlign: "center",
    padding: 10,
    fontFamily: "Roboto-Regular",
  },
  seeMoreText: {
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  profileImg: {
    width: 66,
    height: 66,
    borderColor: "white",
    borderWidth: 6,
    borderRadius: 50,
  },
});
