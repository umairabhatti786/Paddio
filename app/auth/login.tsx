import CustomButton from "@/components/Button";
import CustomToast from "@/components/CustomToast";
import CustomInput from "@/components/Input";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenLayout from "@/components/ScreenLayout";
import ScreenLoader from "@/components/ScreenLoader";
import CustomText from "@/components/Text";
import { windowWidth } from "@/constants/Commons";

import { fonts } from "@/constants/Fonts";
import { appStyles } from "@/constants/GlobalStyles";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { emailRegex, simplePhoneRegex } from "@/constants/Regex";
import {
  AUTH_DATA,
  AUTH_REMEBER_ME,
  StorageServices,
} from "@/constants/StorageServices";
import { SupabaseServices } from "@/constants/SupabaseServices";
import { theme } from "@/constants/Theme";
import { supabase } from "@/constants/supabase";
import { getIsRememberMe, setAuthData } from "@/redux/reducers/authReducer";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Keyboard, Pressable, StyleSheet, TouchableOpacity, View, Easing } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const LoginScreen = () => {
  const router: any = useRouter();
  const navigation = useNavigation();

  const [securePassword, setSecurePassword] = useState(true);
  const [remember, setRemember] = useState(true);
  // const isRemember = useSelector(getIsRememberMe);
  const [selectedTab, setSelectedTab] = useState("Email");
  const [loading, setLoading] = useState(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [messageColor, setMessageColor] = useState(theme.colors.red);
  const [countryCode, setCountryCode] = useState("+92");
  const translateX = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const focused = useIsFocused();

  const [values, setValues] = useState({
    email: "",
    password: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState<any>({
    email_error: "",
    phone_number_error: "",
    password_error: "",
    confirm_password_error: "",
    avatar: {},
  });

  useEffect(() => {
    Animated.timing(translateX, {
      toValue:
        selectedTab === "Email" ? 0 : windowWidth / 2.1 - sizeHelper.calWp(10), // move indicator to next tab
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  useEffect(() => {
    if (focused) {
      GetRememberMe();
    }
  }, [focused]);

  const GetRememberMe = async () => {
    let remember = await StorageServices.getItem(AUTH_REMEBER_ME);
    setRemember(remember?.isRem);
    setValues({
      ...values,
      password: remember?.password,
      email: remember?.email,
      phone_number: remember?.phone_number
    });
  };

  const loginWithEmail = async () => {
    let email = values?.email.trim();
    let password = values?.password;
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.log("login_error", authError);
      setMessage(authError.message);
      setIsMessage(true);
      setLoading(false);

      return;
      // throw new Error(authError.message);
    }
    setLoading(false);

    const user = authData?.user;
    if (!user) {
      setMessage("No user found.");
      setIsMessage(true);
      setLoading(false);
      return;
    }

    return user;
  };

  const loginWithPhone = async () => {
    try {
      setLoading(true);

      // let phone = values?.phone_number.trim();
      let phone = "526860000005"
      let password = values?.password;

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          phone,
          password,
        });
      if (authError) {
        console.log("login_error", authError);
        setMessage(authError.message);
        setIsMessage(true);
        setLoading(false);
        return;
      }

      const user = authData?.user;

      if (!user) {
        setMessage("No user found.");
        setIsMessage(true);
        setLoading(false);
        return;
      }

      setLoading(false);
      return user;

    } catch (error) {
      console.log("unexpected_error", error);
      setMessage("Something went wrong!");
      setIsMessage(true);
      setLoading(false);
    }
  };


  const onLoginUser = async () => {
    let user: any;
    if (selectedTab == "Email") {
      if (!values?.email) {
        setMessage("Email is required.");
        setIsMessage(true);
        return false;
      }
      if (values?.email) {
        if (!emailRegex.test(values?.email)) {
          setMessage("Invalid Email Address.");
          setIsMessage(true);
          setMessageColor(theme.colors.red);

          return;
        }
      }
    }

    if (!values.password) {
      setMessage("Password is required.");
      setIsMessage(true);

      return;
    }
    setLoading(true);
    if (selectedTab == "Email") {
      user = await loginWithEmail();
    }
    if (selectedTab == "Phone") {
      user = await loginWithPhone();
    }


    const ProfileResult: any = await SupabaseServices.GetUserProfile(user.id);

    if (ProfileResult?.success) {
      setLoading(false);
      setIsMessage(true);
      setMessageColor(theme.colors.primary);
      setMessage("User login successfully.");
      let params = {};
      if (remember) {
        params = {
          isRem: true,
          email: values?.email,
          password: values?.password,
          phone_number: values?.phone_number

        };
      } else {
        params = {
          isRem: false,
          email: "",
          password: "",
          phone_number: ""
        };
      }

      StorageServices.setItem(AUTH_REMEBER_ME, params);
      StorageServices.setItem(AUTH_DATA, ProfileResult?.data[0]);
      dispatch(setAuthData(ProfileResult?.data[0]));
      // console.log("codmnomdc",.)
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 1000);
    } else {
      setLoading(false);
      setIsMessage(true);
      setMessage(ProfileResult.message);
    }

  };

  return (
    <>
      <ScreenLayout style={{ paddingTop: sizeHelper.calHp(60) }}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{
            gap: sizeHelper.calHp(20)

          }}
        >


          <View
            style={{
              alignItems: "center",
              alignSelf: "center",
              gap: sizeHelper.calHp(10),
            }}
          >
            <Image
              style={{
                width: sizeHelper.calWp(100),
                height: sizeHelper.calWp(100),
                alignSelf: "center",
              }}
              source={images.icon}
            />

            <CustomText
              fontWeight="700"
              fontFam={fonts.InterBold}
              style={{ textAlign: "center" }}
              size={27}
              text={"Paddio"}
            />
          </View>

          <CustomText
            fontWeight="700"
            fontFam={fonts.InterBold}
            style={{ textAlign: "center" }}
            size={35}
            text={"Welcome back"}
          />
          <CustomText
            color={theme.colors.sub_heading_gray}
            style={{ textAlign: "center" }}
            text={"Sign in to your account"}
          />

          <View
            style={{
              width: "100%",
              padding: sizeHelper.calWp(10),
              borderRadius: sizeHelper.calWp(15),
              backgroundColor: theme.colors.gray_btn,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {/* Animated background indicator */}
            <Animated.View
              style={{
                position: "absolute",
                top: sizeHelper.calWp(10),
                bottom: sizeHelper.calWp(10),
                left: sizeHelper.calWp(10),
                width: "48%",
                backgroundColor: theme.colors.white,
                borderRadius: sizeHelper.calWp(15),
                transform: [{ translateX }],
              }}
            />

            {["Email", "Phone"].map((item, index) => (
              <CustomButton
                key={index.toString()}
                borderRadius={15}
                width={"48%"}
                bgColor={"transparent"} // background handled by Animated.View
                textColor={
                  item === selectedTab
                    ? theme.colors.black
                    : theme.colors.sub_heading_gray
                }
                height={60}
                onPress={() => setSelectedTab(item)}
                text={item}
              />
            ))}
          </View>

          {/* <View
          style={{
            width: "100%",
            padding: sizeHelper.calWp(10),
            borderRadius: sizeHelper.calWp(15),
            backgroundColor: theme.colors.gray_btn,
            flexDirection: "row",
            gap: sizeHelper.calWp(10),
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {["Email", "Phone"].map((item, index) => {
            return (
              <CustomButton
                key={index.toString()}
                borderRadius={15}
                width={"48%"}
                bgColor={
                  item == selectedTab ? theme.colors.white : "transparent"
                }
                textColor={
                  item == selectedTab
                    ? theme.colors.black
                    : theme.colors.sub_heading_gray
                }
                height={60}
                onPress={() => setSelectedTab(item)}
                text={item}
              />
            );
          })}
        </View> */}
          {selectedTab == "Email" ? (
            <CustomInput
              label="Email address"
              placeholder="john@example.com"
              error={errors?.email_error}
              value={values?.email}
              onChangeText={(txt: string) => {
                setValues({ ...values, email: txt });
                if (txt.trim().length === 0) {
                  setErrors({ ...errors, email_error: "" });
                  return;
                }

                if (!emailRegex.test(txt.trim())) {
                  setErrors({
                    ...errors,
                    email_error: "Invalid Email Address",
                  });
                  return;
                }

                // If valid email, clear error
                setErrors({ ...errors, email_error: "" });
              }}
            />
          ) : (
            <PhoneNumberInput
              countryCode={countryCode}
              error={errors?.phone_number_error}
              setCountryCode={setCountryCode}
              label="Phone number"
              complusory
              value={values?.phone_number}
              onChangeText={(val: any) => {
                if (val.length == 0) {
                  setErrors({ ...errors, phone_number_error: "" });
                  setValues({ ...values, phone_number: "" });
                }
                if (val.length > 0) {
                  setValues({ ...values, phone_number: val });
                  let isValid = simplePhoneRegex.test(val);
                  if (isValid) {
                    setErrors({ ...errors, phone_number_error: "" });
                    setValues({ ...values, phone_number: val });
                  } else {
                    setErrors({
                      ...errors,
                      phone_number_error: "Phone Number is invalid.",
                    });
                  }
                }
              }}
            />
          )}

          <View>
            <View style={appStyles.rowjustify}>
              <CustomText
                text={"Password"}
                fontWeight="600"
                fontFam={fonts.InterMedium}
              />
              <TouchableOpacity style={{ paddingBottom: sizeHelper.calHp(8) }}>
                <CustomText
                  text={"Forgot password?"}
                  fontWeight="600"
                  color={theme.colors.primary}
                  fontFam={fonts.InterMedium}
                />
              </TouchableOpacity>
            </View>
            <CustomInput
              // label={"Password"}
              placeholder="Create a password"
              value={values.password}
              onChangeText={(it: any) => {
                setValues({ ...values, password: it });
              }}
              rightSource={securePassword ? images.eye_off : images.eye}
              secureTextEntry={securePassword}
              onRightSource={() => setSecurePassword(!securePassword)}
            />
          </View>

          <TouchableOpacity
            onPress={() => setRemember(!remember)}
            style={{
              ...appStyles.row,
              gap: sizeHelper.calWp(5),
              paddingVertical: sizeHelper.calHp(10),
              alignSelf: "flex-start"
            }}
          >
            <TouchableOpacity
              onPress={() => setRemember(!remember)}
              style={{
                width: sizeHelper.calWp(40),
                height: sizeHelper.calWp(40),
                borderRadius: sizeHelper.calWp(10),
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: remember ? theme.colors.primary : "transparent",
                borderColor: remember ? theme.colors.primary : theme.colors.black,
                marginRight: sizeHelper.calWp(10),
              }}
            >
              {remember && (
                <Image
                  style={{
                    width: "60%",
                    height: "60%",
                    tintColor: theme.colors.white,
                  }}
                  source={images.check}
                />
              )}
            </TouchableOpacity>

            <CustomText text={"Remember me"} />
          </TouchableOpacity>
          <CustomButton onPress={onLoginUser} text="Sign in" />

          {/* <View style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}>
          <View style={styles.separator} />

          <CustomText
            color={theme.colors.sub_heading_gray}
            text={"Or Continue with"}
          />
          <View style={styles.separator} />
        </View> */}

          {/* <View
          style={{
            ...appStyles.rowjustify,
            gap: sizeHelper.calWp(10),
            paddingVertical: sizeHelper.calHp(10),
          }}
        >
          <TouchableOpacity style={styles.authContainer}>
            <Image style={styles.auth_img} source={images.google} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.authContainer}>
            <Image style={styles.auth_img} source={images.apple} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.authContainer}>
            <Image style={styles.auth_img} source={images.github} />
          </TouchableOpacity>
        </View> */}
          <View
            style={{
              ...appStyles.row,
              gap: sizeHelper.calWp(5),
              alignSelf: "center",
              paddingVertical: sizeHelper.calHp(100),
            }}
          >
            <CustomText size={22} text={"Don't have an account?"} />

            <TouchableOpacity onPress={() => router.push("auth/signup")}>
              <CustomText
                size={22}
                color={theme.colors.primary}
                fontFam={fonts.InterMedium}
                fontWeight="600"
                text={"Sign up"}
              />
            </TouchableOpacity>
          </View>

        </Pressable>
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
export default LoginScreen;

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
  separator: {
    height: sizeHelper.calHp(1.5),
    backgroundColor: theme.colors.gray_btn,
    flex: 1,
  },
  authContainer: {
    width: "31%",
    paddingVertical: sizeHelper.calHp(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sizeHelper.calWp(15),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  auth_img: {
    width: sizeHelper.calWp(35),
    height: sizeHelper.calWp(35),
    resizeMode: "contain",
  },
});
