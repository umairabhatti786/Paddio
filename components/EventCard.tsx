import { fonts } from "@/constants/Fonts";
import { appStyles } from "@/constants/GlobalStyles";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { theme } from "@/constants/Theme";
import moment from "moment";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import CustomButton from "./Button";
import CustomText from "./Text";

const EventCard = ({ item }: any) => {
  const checkEventCapacity = (capacity: any, registered: any) => {
    if (registered >= capacity) {
      return { isFull: true }; // Event is full
    } else if (capacity - registered <= 5) {
      return { isAlmostFull: true }; // Only 5 or fewer spots left
    } else {
      return { isOpen: true }; // Still open
    }
  };

  const eventStatus = checkEventCapacity(item.capacity, item.registered);

  return (
    <View
      style={{
        width: "100%",
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.white,
        padding: sizeHelper.calWp(20),
        gap: sizeHelper.calHp(20),
        borderRadius: sizeHelper.calWp(18),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: sizeHelper.calWp(20),
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            ...appStyles.row,
            gap: sizeHelper.calWp(20),
            width: "80%",
          }}
        >
          <View
            style={{
              width: sizeHelper.calWp(95),
              height: sizeHelper.calWp(100),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: sizeHelper.calWp(15),
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
                borderRadius: sizeHelper.calWp(15),
                resizeMode:"contain"
              }}
              source={ item?.logo_url?   { uri: item?.logo_url }:images.balls_sports}
            />
          </View>
          <View
            style={{
              gap: sizeHelper.calWp(5),
              width:"80%"
            }}
          >
            <CustomText
              fontWeight="600"
              fontFam={fonts.InterSemiBold}
              size={24}
              text={item?.name}
              numberOfLines={1}

            />
            <CustomText
              color={theme.colors.light_black}
              text={item?.description}
              numberOfLines={1}
            />
          </View>
        </View>

        <CustomButton
          borderRadius={99}
          paddingHorizontal={10}
          size={20}
          bgColor={
            checkEventCapacity(item.capacity, item.registered).isOpen
              ? "#DCFCE7"
              : checkEventCapacity(item.capacity, item.registered).isAlmostFull
              ? "#FEF9C3"
              : "#FEE2E2"
          }
          textColor={
            checkEventCapacity(item.capacity, item.registered).isOpen
              ? "#166534"
              : checkEventCapacity(item.capacity, item.registered).isAlmostFull
              ? "#854D0E"
              : "#991B1B"
          }
          height={45}
          text={
            checkEventCapacity(item.capacity, item.registered).isOpen
              ? "Open"
              : checkEventCapacity(item.capacity, item.registered).isAlmostFull
              ? "Almost Full"
              : "Full"
          }
        />
      </View>
      <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}>
          <Image style={styles.icon} source={images.calendar} />

          <CustomText
            color={theme.colors.light_black}
            text={moment(item?.start_datetime).format("MMM DD, YYYY")}
          />
        </View>

        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}>
          <Image style={styles.icon} source={images.clock} />

          <CustomText
            color={theme.colors.light_black}
            text={moment(item?.start_datetime).format("h:mm A")}
          />
        </View>

        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}>
          <Image style={styles.icon} source={images.pin} />

          <CustomText color={theme.colors.light_black} text={item?.city} />
        </View>
      </View>

      <View style={appStyles.rowjustify}>
        <CustomText
          color={theme.colors.light_black}
          text={`${item?.registered}/${item?.capacity} players`}
        />
        <CustomButton
          borderRadius={12}
          paddingHorizontal={20}
          size={20}
          disable={checkEventCapacity(item.capacity, item.registered).isFull}
          bgColor={
            checkEventCapacity(item.capacity, item.registered).isFull
              ? theme.colors.gray_event_btn
              : theme.colors.primary
          }
          height={55}
          textColor={
            checkEventCapacity(item.capacity, item.registered).isFull
              ? theme.colors.sub_heading_gray
              : theme.colors.white
          }
          text={
            checkEventCapacity(item.capacity, item.registered).isFull
              ? "Full"
              : "Join"
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: sizeHelper.calWp(30),
    gap: sizeHelper.calHp(20),
  },
  icon: {
    width: sizeHelper.calWp(25),
    height: sizeHelper.calWp(25),
    resizeMode: "contain",
    tintColor: theme.colors.light_black,
  },
});

export default EventCard;
