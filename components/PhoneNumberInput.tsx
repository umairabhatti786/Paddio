import { fonts } from "@/constants/Fonts";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { theme } from "@/constants/Theme";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import CustomText from "./Text";

const PhoneNumberInput = ({
  value,
  onChangePhoneNumber,
  height,
  borderRadius,
  borderColor,
  backgroundColor,
  width,
  countryCode="+92",
  setCountryCode,
  label,
  onChangeText,
  error,
  complusory
}: any) => {
  const [country, setCountry] = useState("PK");
  const [showPicker, setShowPicker] = useState(false);

  const onSelect = (country: Country) => {
    setCountry(country.cca2);
    setCountryCode(country.callingCode[0]);
    console.log("(country.callingCode",country)
    setShowPicker(false);
  };

  return (
    <View
      style={{
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
   
      <View
        style={[
          styles.container,
          {
            height: sizeHelper.calHp(height || 80),
            borderRadius: borderRadius || sizeHelper.calWp(18),
            borderColor: borderColor || theme.colors.border,
            backgroundColor: backgroundColor || theme.colors.background,
          },
        ]}
      >
        {/* Country Picker Button */}
        <TouchableOpacity
          style={styles.flagSection}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <CountryPicker
            countryCode={country}
            withCallingCode
            withFilter
            withFlag
            withAlphaFilter
            visible={showPicker}
            onSelect={onSelect}
            onClose={() => setShowPicker(false)}
            containerButtonStyle={{ display: "none" }}
          />

          <CustomText
            text={countryCode}
            // color={ttheme.colors.white}
            // size={size || 23}
            // fontWeight={fontWeight || "600"}
            // fontFam={fontFam ||fonts.InterMedium}
          />

          <Image
            source={images.down_arrow}
            style={{
              width: sizeHelper.calWp(25),
              height: sizeHelper.calWp(25),
              marginLeft: sizeHelper.calWp(5),
              tintColor: theme.colors.black,
            }}
          />
        </TouchableOpacity>

        {/* Separator Line */}
        <View style={styles.separator} />

        {/* Phone Input Field */}
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder="(555) 123-4567"
          placeholderTextColor="#999999"
        />
      </View>

      {error && (
        <View
          style={{
            marginTop: sizeHelper.calHp(10),
            alignItems:"flex-end"
          }}>
          <CustomText size={20} text={error} color={theme.colors.red} />
        </View>
      )}
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    width: "100%",
    overflow: "hidden",
    paddingHorizontal: sizeHelper.calWp(10),
  },
  flagSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizeHelper.calWp(5),
  },
  separator: {
    width: sizeHelper.calWp(2),
    height: "100%",
    backgroundColor: theme.colors.border,
    marginLeft: sizeHelper.calWp(20),
    marginRight: sizeHelper.calWp(10),
  },
  textInput: {
    flex: 1,
    fontSize: sizeHelper.calHp(21),
    color: theme.colors.black,
    fontFamily: fonts.InterRegular,
  },
});
