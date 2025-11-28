import ScreenLayout from "@/components/ScreenLayout";
import CustomText from "@/components/Text";

import { fonts } from "@/constants/Fonts";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { theme } from "@/constants/Theme";
import { useRouter } from "expo-router";
import { StyleSheet, Image } from "react-native";

const MyEventsScreen = ({ navigation }: any) => {
  const router: any = useRouter();

  return (
    <ScreenLayout
      style={{ alignItems: "center", justifyContent: "center" }}
    >

      <Image
        style={{
          width: sizeHelper.calWp(180),
          height: sizeHelper.calWp(180), tintColor: theme.colors.primary
        }}
        source={images.coming_soon}
      />

    </ScreenLayout>
  );
};
export default MyEventsScreen;

const styles = StyleSheet.create({});
