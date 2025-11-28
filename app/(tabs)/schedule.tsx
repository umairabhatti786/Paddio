import ScreenLayout from "@/components/ScreenLayout";
import CustomText from "@/components/Text";

import { fonts } from "@/constants/Fonts";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { theme } from "@/constants/Theme";
import { useRouter } from "expo-router";
import { Image, StyleSheet } from "react-native";

const ScheduleScreen = ({ navigation }: any) => {
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
export default ScheduleScreen;

const styles = StyleSheet.create({});
