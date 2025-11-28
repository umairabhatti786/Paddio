import CustomButton from "@/components/Button";
import CustomToast from "@/components/CustomToast";
import ScreenLayout from "@/components/ScreenLayout";
import ScreenLoader from "@/components/ScreenLoader";
import CustomText from "@/components/Text";
import {
  getRemainingTime,
  registerOTPTimerTask,
  startOTPTimer,
} from "@/constants/BackgroundTasks";

import { fonts } from "@/constants/Fonts";
import { appStyles } from "@/constants/GlobalStyles";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { SupabaseServices } from "@/constants/SupabaseServices";
import { theme } from "@/constants/Theme";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useLocalSearchParams } from "expo-router";

const VerifyPhoneScreen = () => {
  const { phone, data } = useLocalSearchParams();

  const [value, setValue] = useState("");
  const router: any = useRouter();
  const [resendingTime, setResendingTime] = useState(300);
  const [loading, setLoading] = useState(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [messageColor, setMessageColor] = useState(theme.colors.primary);
  const [isWrongOtp, setIsWrongOtp] = useState(false);
  console.log("Phone:", phone);
  console.log("Data:", data);
  console.log("resendingTime", resendingTime);
  const ref = useBlurOnFulfill({ value, cellCount: 6 });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    // Start OTP timer for 30 seconds
    startOTPTimer(300);
    // Register background task
    registerOTPTimerTask();
    // Update UI every second
    const interval = setInterval(() => {
      setResendingTime(getRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timerFormat = (seconds: any) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m < 10 ? `0${m}` : m;
    const ss = s < 10 ? `0${s}` : s;
    return `${mm}:${ss}`;
  };

  const OnVerifyOtp = async () => {
    if (resendingTime <= 0) {
      setMessage("OTP Expired");
      setIsMessage(true);
      setMessageColor(theme.colors.red)

      return;
    }
    setLoading(true);
    let phon = String(phone);
    const verifyResult: any = await SupabaseServices.VerifyOTP("526860000005", value);
    if (verifyResult?.success) {
      setLoading(false);
      setMessage("OTP verified successfully.");
      setIsMessage(true);
      setMessageColor(theme.colors.primary);
      setIsWrongOtp(false);

      setTimeout(() => {
        router.push("auth/login");
      }, 1000);
    } else {
      setLoading(false);
      setMessageColor(theme.colors.red);
      setMessage(verifyResult?.message);
      setIsMessage(true);
      setIsWrongOtp(true);
    }
  };

  const OnResendOtp = async () => {
    setLoading(true);
    const resendResult: any = await SupabaseServices.ResendOTP("526860000005");
    if (resendResult?.success) {
      console.log("resendResult", resendResult);
      setLoading(false);
      setMessage(resendResult?.message);
      setIsMessage(true);
      setMessageColor(theme.colors.primary);
      setIsWrongOtp(false);
      setResendingTime(300); // reset timer
      startOTPTimer(300);
      setValue("");

      // setTimeout(() => {
      //   router.push("auth/login");
      // }, 1000);
    } else {
      setLoading(false);
      setMessageColor(theme.colors.red);
      setMessage(resendResult?.message);
      setIsMessage(true);
      setIsWrongOtp(true);
    }
  };

  return (
    <>
      <ScreenLayout style={{ paddingTop: sizeHelper.calHp(100) }}>
        <Image
          style={{
            width: sizeHelper.calWp(150),
            height: sizeHelper.calWp(150),
            alignSelf: "center",
          }}
          source={images.phone}
        />
        <CustomText
          fontWeight="700"
          fontFam={fonts.InterBold}
          style={{ textAlign: "center" }}
          size={35}
          text={"Verify your phone"}
        />

        <View style={{ gap: sizeHelper.calHp(10) }}>
          <CustomText
            color={theme.colors.sub_heading_gray}
            style={{ textAlign: "center" }}
            text={"We've sent a 6-digit verification code to"}
          />

          <View style={{ ...appStyles.row, alignSelf: "center" }}>
            <CustomText
              fontWeight="600"
              fontFam={fonts.InterSemiBold}
              size={24}
              text={phone}
            />
          </View>
        </View>

        <View
          style={{
            ...appStyles.row,
            alignSelf: "center",
            gap: sizeHelper.calWp(10),
          }}
        >
          <Image
            style={{
              width: sizeHelper.calWp(30),
              height: sizeHelper.calWp(30),
            }}
            source={images.clock}
          />
          <CustomText
            size={22}
            color={theme.colors.sub_heading_gray}
            text={"Code expires in"}
          />
          <CustomText
            fontWeight="600"
            fontFam={fonts.InterSemiBold}
            size={22}
            text={resendingTime > 0 ? timerFormat(resendingTime) : "0:00"}
          />
        </View>

        <CodeField
          ref={ref}
          {...props}
          caretHidden={true}
          value={value}
          onChangeText={(value) => {
            setValue(value);
            //   setIsWrongOtp(false);
          }}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={{
                ...styles.codeFieldCell,
                borderColor: isFocused
                  ? theme.colors.primary
                  : isWrongOtp
                  ? theme.colors.red
                  : theme.colors.border,
                backgroundColor: isFocused
                  ? theme.colors.white
                  : isWrongOtp
                  ? theme.colors.red + "20"
                  : theme.colors.background,
              }}
            >
              <CustomText
                size={32}
                fontFam={fonts.InterBold}
                fontWeight={"700"}
                color={isWrongOtp ? theme.colors.red : theme.colors.primary}
                text={symbol || (isFocused ? <Cursor /> : "")}
              />
            </View>
          )}
        />

        <CustomButton
          disable={value.length < 6}
          onPress={OnVerifyOtp}
          text="Verify Code"
        />

        <TouchableOpacity style={{ alignSelf: "center" }}>
          <CustomText
            color={theme.colors.sub_heading_gray}
            text={"Didn't receive the code?"}
          />
        </TouchableOpacity>
        <CustomButton
          bgColor={theme.colors.gray_btn}
          textColor={theme.colors.black}
          onPress={OnResendOtp}
          text="Resend Code"
        >
          <Image
            style={{
              width: sizeHelper.calWp(27),
              height: sizeHelper.calWp(27),
              marginRight: sizeHelper.calWp(50),
            }}
            source={images.refresh}
          />
        </CustomButton>

        <View style={styles.separator} />
        <View style={{ gap: sizeHelper.calHp(15) }}>
          <TouchableOpacity style={{ alignSelf: "center" }}>
            <CustomText
              color={theme.colors.icon_gray}
              text={"Having trouble"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ alignSelf: "center" }}>
            <CustomText
              size={22}
              color={theme.colors.primary}
              fontFam={fonts.InterMedium}
              fontWeight="600"
              text={"Contact Support"}
            />
          </TouchableOpacity>
        </View>
      </ScreenLayout>

      <CustomToast
        isVisable={isMessage}
        backgroundColor={messageColor}
        setIsVisable={setIsMessage}
        message={message}
      />

      {loading && <ScreenLoader />}
    </>
  );
};
export default VerifyPhoneScreen;

const styles = StyleSheet.create({
  upload_img_container: {
    width: sizeHelper.calWp(170),
    height: sizeHelper.calWp(170),
    borderWidth: sizeHelper.calWp(8),
    borderColor: theme.colors.border,
    borderRadius: sizeHelper.calWp(150),
    marginVertical: sizeHelper.calHp(20),
  },
  camera_container: {
    position: "absolute",
    bottom: sizeHelper.calHp(30),
    right: 0,
    padding: sizeHelper.calWp(12),
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  camera_img: {
    width: sizeHelper.calWp(23),
    height: sizeHelper.calWp(23),
  },

  codeFieldRoot: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: sizeHelper.calHp(60),
    gap: sizeHelper.calWp(20),
    marginVertical: sizeHelper.calHp(30),
  },
  codeFieldCell: {
    justifyContent: "center",
    alignItems: "center",
    width: "14%",
    height: sizeHelper.calHp(75),
    borderWidth: 1.5,
    borderRadius: sizeHelper.calWp(15),
    // borderColor: theme.colors.border,
  },
  separator: {
    height: sizeHelper.calHp(1.5),
    backgroundColor: theme.colors.gray_btn,
    marginTop: sizeHelper.calHp(30),
  },
});
