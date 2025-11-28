import { fonts } from "@/constants/Fonts";
import sizeHelper from "@/constants/Helpers";
import { theme } from "@/constants/Theme";
import { TextType } from "@/constants/Types";
import React, { useMemo } from "react";
import { StyleProp, Text, TextStyle } from "react-native";


const CustomText = ({
  color,
  size,
  fontFam,
  text,
  style,
  lineHeight,
  numberOfLines,
  fontWeight,
  textDecorationLine,
  label,
  textTransform,
}: TextType) => {
  const memoizedStyle = useMemo(() => {
    const baseStyle = {
      color: color || theme.colors.black,
      fontSize: sizeHelper.calHp(size || 20),
      fontWeight: fontWeight || "500",
      fontFamily: fontFam ||fonts.InterRegular,
      textTransform,
      textDecorationLine,
      ...(lineHeight ? { lineHeight } : {}),
    };

    return [baseStyle, style] as StyleProp<TextStyle>;
  }, [
    color,
    size,
    fontFam,
    fontWeight,
    textTransform,
    textDecorationLine,
    lineHeight,
    style,
  ]);

  return (
    <Text numberOfLines={numberOfLines} allowFontScaling={false} style={memoizedStyle}>
      {text}
      {label}
    </Text>
  );
};

export default React.memo(CustomText);
