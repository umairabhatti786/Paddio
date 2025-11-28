import CustomText from "@/components/Text";
import { fonts } from "@/constants/Fonts";
import sizeHelper from "@/constants/Helpers";
import { theme } from "@/constants/Theme";
import { ButtonProps } from "@/constants/Types";
import React, { useMemo } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";


const CustomButton = ({
  text,
  onPress,
  width,
  height,
  size,
  fontFam,
  borderRadius,
  style,
  bgColor,
  textColor,
  borderColor,
  disable = false,
  borderWidth,
  paddingHorizontal,
  fontWeight,
  children,
}: ButtonProps) => {
  const memoizedStyle = useMemo(() => {
    const baseStyle: ViewStyle = {
      width: width,
      height: sizeHelper.calHp(height || 78),
      backgroundColor: bgColor || theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: sizeHelper.calHp(borderRadius || 18),
      borderWidth: borderWidth || 0,
      borderColor: borderColor,
      paddingHorizontal: paddingHorizontal,
      flexDirection: "row",
      gap: sizeHelper.calWp(15),
    };

    return [baseStyle, style] as StyleProp<ViewStyle>;
  }, [
    width,
    height,
    bgColor,
    borderRadius,
    borderWidth,
    borderColor,
    paddingHorizontal,
    style,
  ]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      activeOpacity={0.5}
      style={memoizedStyle}
    >
         {children}
      <CustomText
        text={text}
        color={textColor || theme.colors.white}
        size={size || 23}
        fontWeight={fontWeight || "600"}
        fontFam={fontFam ||fonts.InterMedium}
      />
   
    </TouchableOpacity>
  );
};

export default React.memo(CustomButton);
