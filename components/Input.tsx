import { fonts } from '@/constants/Fonts';
import sizeHelper from '@/constants/Helpers';
import { theme } from '@/constants/Theme';
import { InputProps } from '@/constants/Types';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import CustomText from './Text';


const CustomInput = ({
  placeholder,
  keyboard,
  secureTextEntry,
  props,
  fontWeight,
  multiline,
  height,
  fontSize,
  value,
  onChangeText,
  onBlur,
  error,
  editable,
  color,
  maxLength,
  width,
  placeholderTextColor,
  borderRadius,
  backgroundColor,
  textAlign,
  textAlignVertical,
  paddingTop,
  onSubmitEditing,
  label,
  focusedInput,
  inputKey,
  leftSource,
  rightSource,
  onRightSource,
  borderColor,
  fontFamily,
  complusory
  
}: InputProps) => {
  const isFocused = focusedInput === inputKey;

  return (
    <View
      style={{
        ...props,
        width: width || '100%',
      }}>
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
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: sizeHelper.calWp(20),
          paddingRight: sizeHelper.calWp(20),
          height: sizeHelper.calHp(height || 80),
          alignItems: "center",
          borderColor: borderColor|| theme.colors.border,
          gap:sizeHelper.calWp(10),
          borderWidth: 1,
          borderRadius: borderRadius || sizeHelper.calWp(18),
          backgroundColor: backgroundColor || theme.colors.background,
        }}
      >
        <TextInput
          value={value}
          editable={editable}
          onSubmitEditing={onSubmitEditing}
          allowFontScaling={false} // Disable font scaling
          style={{
            fontSize: sizeHelper.calHp(fontSize ||21),
            width: rightSource ? "80%" : "98%",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
            textAlign:textAlign,
            textAlignVertical: textAlignVertical,
            paddingTop: paddingTop || 0,
            paddingVertical: 0, // Adjust as needed for centering
            fontFamily: fontFamily ||fonts.InterRegular,
            fontWeight: fontWeight || "500",
            color: color || theme.colors.black,
            paddingRight: sizeHelper.calWp(rightSource ? 10 : 0),
          }}
          placeholder={placeholder}
          multiline={multiline}
          placeholderTextColor={
            placeholderTextColor || theme.colors.placeholder
          }
          keyboardType={keyboard}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry || false}
          onChangeText={onChangeText}
          onBlur={onBlur}
          autoCapitalize="none"
        />
        {rightSource && (
          
          <TouchableOpacity
            onPress={onRightSource}
            disabled={!onRightSource}
            activeOpacity={0.3}
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              height: "100%",
              width: sizeHelper.calWp(50),
            }}
          >
            <Image
              source={rightSource}
              style={{
                width: sizeHelper.calWp(42),
                height: sizeHelper.calWp(42),
                tintColor:theme.colors.icon_gray
              }}
              resizeMode={"contain"}
            />
          </TouchableOpacity>
        )}
   
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
export default CustomInput;
