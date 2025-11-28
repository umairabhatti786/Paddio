import * as ImagePicker from "expo-image-picker";
import { Alert, Linking, Platform } from "react-native";

const UsePermission = () => {
  const requestGalleryPermission = async () => {
    // 1️⃣ Check permission
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

    // 2️⃣ Request if not granted
    if (status !== "granted") {
      const { status: newStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (newStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photo library to continue.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return false;
      }
    }

    return true;
  };

  return { requestGalleryPermission };
};

export { UsePermission };
