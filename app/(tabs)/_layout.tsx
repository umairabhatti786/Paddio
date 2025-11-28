import CustomText from "@/components/Text";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { theme } from "@/constants/Theme";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabItemProps = {
  focused: boolean;
  title: string;
  img: any;
};

const TabItem = ({ focused, title, img }: TabItemProps) => {
  return (
    <View style={styles.itemStyle}>
      <Image
        resizeMode="contain"
        source={img}
        style={[
          styles.img,
          { tintColor: focused ? theme.colors.primary : theme.colors.border },
        ]}
      />
      <CustomText
        text={title}
        fontFam={fonts.InterMedium}
        fontWeight="600"
        size={16}
        color={focused ? theme.colors.primary : theme.colors.icon_gray}
      />
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          ...styles.tabBarStyle,
          bottom: Platform.OS=="ios"?0: insets.bottom,

        },        
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,

        
      }}


    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} title="Home" img={images.home} />
          ),
        }}
      />

      <Tabs.Screen
        name="myEvents"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} title="My Events" img={images.event} />
          ),
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} title="Schedule" img={images.schedule} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} title="Profile" img={images.profile} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    width: sizeHelper.calWp(130),
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: sizeHelper.calHp(7),
    paddingBottom:sizeHelper.calHp(10)
  },
  img: {
    height: sizeHelper.calHp(33),
    width: sizeHelper.calHp(33),
  },
  tabBarStyle: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    height: sizeHelper.calHp(100),
    paddingTop: sizeHelper.calHp(Platform.OS=="ios"? 15:20),
  },
});
