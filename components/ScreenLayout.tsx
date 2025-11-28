import sizeHelper from "@/constants/Helpers";
import { theme } from "@/constants/Theme";
import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface BackgroundContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: any;
}

const ScreenLayout: React.FC<BackgroundContainerProps> = ({
  children,
  style,
  backgroundColor,
}) => {
  return (
    <SafeAreaView
    edges={['top']}
      style={{
        flex: 1,
        backgroundColor: backgroundColor || theme.colors.white,
        paddingTop:sizeHelper.calHp(20)
      }}
    >
        <StatusBar style="dark" />

         
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: sizeHelper.calWp(30),
    gap:sizeHelper.calHp(20)

  },
});

export default ScreenLayout;
