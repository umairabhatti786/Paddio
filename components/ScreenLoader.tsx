import sizeHelper from "@/constants/Helpers";
import LottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";

const ScreenLoader = ({backgroundColor}:any) => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        zIndex: 999999,
        position: "absolute",
        backgroundColor:backgroundColor || 'rgba(0,0,0,.2)',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
         <LottieView
          style={{
            width: sizeHelper.calWp(350),
            height:sizeHelper.calWp(350),
          }}
          source={require("../assets/json/loading.json")}
          renderMode="HARDWARE"
          autoPlay
          loop
        />
      {/* <ActivityIndicator size="large" color={theme.colors.primary} /> */}
    </View>
  );
};

export default ScreenLoader;
