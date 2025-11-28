import {
  Image,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";

import CustomText from "@/components/Text";
import { fonts } from "@/constants/Fonts";
import { appStyles } from "@/constants/GlobalStyles";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { theme } from "@/constants/Theme";
import { useState } from "react";

const CustomDropDown = ({
  props,
  height,
  width,
  borderRadius,
  backgroundColor,
  label,
  leftSource,
  onRightSource,
  borderColor,
  placeholder,
  value,
  setValue,
  data,
  iconSize,
  top,
  onActions,
  label_color,
  complusory
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View
      style={{
        ...props,
        width: width || "100%",
      }}
    >
      {label && (
        <View
        style={{
          marginBottom: sizeHelper.calHp(10),
          flexDirection: "row",
          gap: sizeHelper.calWp(3),


        }}>
        <CustomText
          text={label}
          fontWeight="600"
          // size={21}
          fontFam={fonts.InterMedium}
        />
         {complusory && (
          <CustomText size={15} text={"*"} color={theme.colors.red} />
        )}
      </View>
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: sizeHelper.calWp(25),
          height: sizeHelper.calHp(height || 80),
          alignItems: "center",
          borderColor: borderColor || theme.colors.border,
          gap: sizeHelper.calWp(10),
          borderWidth: 1,
          borderRadius: borderRadius || sizeHelper.calWp(18),
          backgroundColor: backgroundColor || theme.colors.background,
        }}
      >
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
          {leftSource && (
            <Image
              source={leftSource}
              style={{
                width: sizeHelper.calWp(25),
                height: sizeHelper.calWp(25),
                resizeMode:"contain"
              }}
            />
          )}

          {value?.name ? (
            <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
              <CustomText text={value?.name} size={21} />
            </View>
          ) : (
            <CustomText
              text={placeholder}
              color={theme.colors.placeholder}
              size={21}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={onRightSource}
          disabled={!onRightSource}
          activeOpacity={0.3}
        >
          <Image
            source={images.down_arrow}
            style={{
              width: sizeHelper.calWp(25),
              height: sizeHelper.calWp(25),
            }}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {isOpen && (
        <View
          style={{
            width: "100%",
            borderWidth: 1,
            borderRadius: sizeHelper.calWp(20),
            borderColor: theme.colors.border,
            maxHeight: sizeHelper.calWp(400),
            backgroundColor: theme.colors.white,
            position: "absolute",
            zIndex: 999,
            top: sizeHelper.calHp(top || 130),
          }}
        >
          <ScrollView
          nestedScrollEnabled={true}
          >
            <View>
              {data?.map((item: any, index: any) => {
                return (
                  <TouchableOpacity
                  key={index.toString()}
                    onPress={() => {
                      onActions?.(item);
                      setIsOpen(false);
                    }}
                    style={{
                      gap: sizeHelper.calHp(20),
                      borderBottomWidth: index === data.length - 1 ? 0 : 1,
                      borderBottomColor: theme.colors.border,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        onActions?.(item);
                        setIsOpen(false);
                      }}
                      style={{
                        ...appStyles.row,
                        gap: sizeHelper.calWp(20),
                        padding: sizeHelper.calWp(25),
                      }}
                    >
                      

                      <CustomText
                        text={item?.name}
                        color={theme.colors.black}
                        size={22}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};
export default CustomDropDown;
