import CustomButton from "@/components/Button";
import CustomInput from "@/components/Input";
import ScreenLayout from "@/components/ScreenLayout";
import CustomText from "@/components/Text";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomDropDown from "@/components/CustomDropDown";
import CustomToast from "@/components/CustomToast";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenLoader from "@/components/ScreenLoader";
import { windowWidth } from "@/constants/Commons";
import { countryData } from "@/constants/Data";
import { fonts } from "@/constants/Fonts";
import { appStyles } from "@/constants/GlobalStyles";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { UsePermission } from "@/constants/Permissions";
import { emailRegex, simplePhoneRegex } from "@/constants/Regex";
import { SupabaseServices } from "@/constants/SupabaseServices";
import { theme } from "@/constants/Theme";
import { supabase } from "@/constants/supabase";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { AUTH_REMEBER_ME, StorageServices } from "@/constants/StorageServices";
const SignupScreen = ({ navigation }: any) => {
  const router: any = useRouter();

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [isAgree, setIsAgree] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [selectedSport, setSelectedSports] = useState();
  const { requestGalleryPermission } = UsePermission();
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [messageColor, setMessageColor] = useState(theme.colors.red);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Email");

  const [preferredSports, setPreferredSports] = useState<any>([]);
  const [cityData, setCityData] = useState([]);
  const focused = useIsFocused();
  const [countryCode, setCountryCode] = useState("+92");
  const translateX = useRef(new Animated.Value(0)).current;
  const [errors, setErrors] = useState<any>({
    email_error: "",
    phone_number_error: "",
    password_error: "",
    confirm_password_error: "",
    avatar: {},
  });
  const shirtData = [
    {
      name: "Small",
      id: 1
    },
    {
      name: "Medium",
      id: 2
    },
    {
      name: "Large",
      id: 3
    },
  ]
  const [values, setValues] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    confirm_password: "",
    country: "",
    city: "",
    sport: "",
    password: "",
    avatar: {},
    shirt_size: ""
  });

  useEffect(() => {
    if (focused) {
      GetDetails();
    }
  }, [focused]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue:
        selectedTab === "Email" ? 0 : windowWidth / 2.1 - sizeHelper.calWp(10), // move indicator to next tab
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  const GetDetails = async () => {
    const SportsResult: any = await SupabaseServices.GetSports();

    if (SportsResult?.success) {
      const formattedSports = SportsResult.data.map((item: any) => ({
        name: item.name,
        id: item.sport_id, // using actual UUID from Supabase
        created_at: item?.created_at,
        des: item?.description,
        is_active: item?.is_active,
      }));
      setPreferredSports(formattedSports);
    }

    const CityResult: any = await SupabaseServices.GetCity();
    if (CityResult?.success) {
      const formattedSports = CityResult.data.map((item: any, index: any) => ({
        name: item.city,
        id: index + 1, // using actual UUID from Supabase
      }));
      setCityData(formattedSports);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;
    console.log("hasPermission", hasPermission);
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      let param = {
        fileName: result?.assets[0].fileName,
        fileSize: result?.assets[0].fileSize,
        type: result?.assets[0].type,
        uri: result?.assets[0].uri,
      };

      setValues({ ...values, avatar: param });


    }
  };

  const OnSignup = async () => {
    if (!values.first_name) {
      setMessage("First Name is required.");
      setIsMessage(true);

      return;
    }

    if (values.first_name.length < 2) {
      setMessage("First Name must be at least 2 characters.");
      setIsMessage(true);

      return;
    }
    if (!values.last_name) {
      setMessage("Last Name is required.");
      setIsMessage(true);

      return;
    }
    if (values.last_name.length < 2) {
      setMessage("Last Name must be at least 2 characters.");
      setIsMessage(true);

      return;
    }
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

    if (!values.phone_number) {
      setMessage("Phone Number is required.");
      setIsMessage(true);

      return;
    }

    if (values?.phone_number) {
      if (!simplePhoneRegex.test(values?.phone_number)) {
        setMessage("phone number is invalid.");
        setIsMessage(true);

        return;
      }
    }

    if (!values.sport) {
      setMessage("Please select a sport.");
      setIsMessage(true);
      return;
    }

    if (!values.shirt_size) {
      setMessage("Please select a shirt size.");
      setIsMessage(true);
      return;
    }

    if (!values.password) {
      setMessage("Password is required.");
      setIsMessage(true);

      return;
    }
    if (values.password.length < 7) {
      setMessage("Password must be at least 7 characters long.");
      setIsMessage(true);

      return;
    }
    if (!values.confirm_password) {
      setMessage("Confirm password is required.");
      setIsMessage(true);

      return;
    }

    if (values.password != values.confirm_password) {
      setMessage("Confirm password does not match.");
      setIsMessage(true);

      return;
    }

    if (!isAgree) {
      setMessage(
        "Please accept our Terms of Service and Privacy Policy to continue"
      );
      setIsMessage(true);

      return;
    }
    setLoading(true);
    let email = values?.email.trim();
    let password = values?.password.trim();
    let phone = `${countryCode} ${values?.phone_number}`;
    let result = null;

    // const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
    //   {
    //     email,
    //     password,
    //   }
    // );

    // if (signUpError) {
    //   setMessage(signUpError.message);
    //   console.log("signup_error", signUpError);
    //   setIsMessage(true);
    //   setLoading(false);

    //   return;
    // }

    if (selectedTab == "Phone") {
      result = await SupabaseServices.SignUpWithPhone(`526860000005`, password);
    } else {
      result = await SupabaseServices.SignUpWithEmail(email, password);
    }
    console.log("imgResult", values);

    if (result.success) {
      console.log("resultPar9u4934938", result)
      let user = result.data;
      if (user) {
        console.log("cfcfcfcff", user)
        let imgResult: any = null
        if (values.avatar.uri) {
          imgResult = await SupabaseServices.UploadAvatar(user.id, values.avatar.uri);
        }
        const { data, error: profileError } = await supabase
          .from("user_profiles")
          .upsert(
            {
              user_id: user.id,
              first_name: values?.first_name,
              last_name: values?.last_name,
              email: email,
              phone_number: values?.phone_number,
              country: values?.country,
              country_code: countryCode,
              city: values?.city,
              avatar_url: imgResult?.success ? imgResult?.url : "",
              preferred_sport: values?.sport?.id,
              shirt_size:values?.shirt_size?.name
            },
            { onConflict: "user_id" }
          );

        if (profileError) {
          // console.error("Profile insert error:", profileError.message);
          setLoading(false);
          setIsMessage(true);
          setMessage(profileError.message);
          console.log("profile_error", profileError);

          return;
        }

        setLoading(false);
        setIsMessage(true);
        setMessageColor(theme.colors.primary);
        setMessage("Account created successfully.");
        StorageServices.removeItem(AUTH_REMEBER_ME)
        if (selectedTab == "Phone") {
          setTimeout(() => {
            //  router.push("auth/login");

            router.push({
              pathname: "auth/verifyPhone",
              params: { phone, data }
            })
          }, 1000);
        }
        else {
          setTimeout(() => {
            router.push("auth/login");
          }, 1000);

        }

      }
    } else {
      console.log("Signup Failed:", result.message);

      setLoading(false);
      setIsMessage(true);
      setMessage(result.message);
    }

    // Step 2: Store user info in user_profiles table

    //
  };

  return (
    <>
      <ScreenLayout style={{ paddingTop: sizeHelper.calHp(40) }}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={100}      // IMPORTANT
          extraHeight={100}            // ALSO NECESSARY for deep inputs
          keyboardOpeningTime={0}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: sizeHelper.calHp(80),
            gap: sizeHelper.calHp(30)      // ensure scroll to bottom
          }}
          keyboardShouldPersistTaps="handled"
        >
          <CustomText
            fontWeight="700"
            fontFam={fonts.InterBold}
            style={{ textAlign: "center" }}
            size={35}
            text={"Create account"}
          />
          <CustomText
            color={theme.colors.sub_heading_gray}
            style={{ textAlign: "center" }}
            text={"Join Paddio to get started"}
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
          <View
            style={{
              alignSelf: "center",
            }}
          >
            <View style={styles.upload_img_container}>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 999,
                  // resizeMode: "contain",
                  // tintColor: theme.colors.sub_heading_gray,
                }}
                source={
                  values?.avatar?.uri ? { uri: values.avatar.uri } : images.user
                }
              />
            </View>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.camera_container}
            >
              <Image style={styles.camera_img} source={images.camera} />
            </TouchableOpacity>
          </View>
          <View style={appStyles.rowjustify}>
            <CustomInput
              width={"48%"}
              label="First name"
              placeholder="John"
              complusory
              value={values?.first_name}
              onChangeText={(it: any) => {
                setValues({ ...values, first_name: it });
              }}
            />
            <CustomInput
              width={"48%"}
              placeholder="Doe"
              label="Last name"
              complusory
              value={values?.last_name}
              onChangeText={(it: any) => {
                setValues({ ...values, last_name: it });
              }}
            />
          </View>
          <CustomInput
            label="Email address"
            placeholder="john@example.com"
            error={errors?.email_error}
            complusory
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
                console.log("isValid", isValid);
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

          <CustomDropDown
            placeholder={"Select your spcort"}
            value={values?.sport}
            complusory
            setValue={setSelectedSports}
            data={preferredSports}
            label={"Preferred sport"}
            onActions={(it: any) => {
              setSelectedSports(it);
              setValues({ ...values, sport: it });
            }}
          />

<CustomDropDown
              placeholder={"Select shirt size"}
              value={values?.shirt_size}
              complusory
              data={shirtData}
              label_color={theme.colors.sub_heading_gray}
              onActions={(it: any) => {
                setValues({ ...values, shirt_size: it });
              }}
              label={"Shirt size"}
            />

          <View style={appStyles.rowjustify}>
            <CustomDropDown
              placeholder={"Select country"}
              value={values?.country}
              width="48%"
              setValue={setSelectedCountry}
              data={countryData}
              label_color={theme.colors.sub_heading_gray}
              onActions={(it: any) => {
                setValues({ ...values, country: it });
              }}
              label={"Country (optional)"}
            />
            <CustomDropDown
              placeholder={"Select city"}
              value={values?.city}
              width="48%"
              label_color={theme.colors.sub_heading_gray}
              setValue={setSelectedCity}
              data={cityData}
              onActions={(it: any) => {
                setValues({ ...values, city: it });
              }}
              label={"City (optional)"}
            />
          </View>

          

          <CustomInput
            label={"Password"}
            placeholder="Create a password"
            complusory
            rightSource={securePassword ? images.eye_off : images.eye}
            secureTextEntry={securePassword}
            value={values.password}
            onChangeText={(it: any) => {
              setValues({ ...values, password: it });
              if (values?.confirm_password) {

                if (values?.confirm_password != it) {

                  setErrors({
                    ...errors,
                    confirm_password_error: "Confirm password not match",
                  });


                }
                else {
                  setErrors({
                    ...errors,
                    confirm_password_error: "",
                  });
                }


              }
            }}
            onRightSource={() => setSecurePassword(!securePassword)}
          />
          <CustomInput
            label={"Confirm password"}
            placeholder="Confirm your password"
            complusory
            rightSource={secureConfirmPassword ? images.eye_off : images.eye}
            secureTextEntry={secureConfirmPassword}
            error={errors?.confirm_password_error}
            onRightSource={() =>
              setSecureConfirmPassword(!secureConfirmPassword)
            }
            value={values?.confirm_password}
            onChangeText={(it: any) => {
              if (it.length > 0) {

                if (values?.password != it) {
                  setErrors({
                    ...errors,
                    confirm_password_error: "Confirm password not match",
                  });
                } else {
                  setErrors({
                    ...errors,
                    confirm_password_error: "",
                  });
                }

              }
              else {

                setErrors({
                  ...errors,
                  confirm_password_error: "",
                });

              }

              setValues({ ...values, confirm_password: it });
            }}
          />

          <View
            style={{
              ...appStyles.row,
              gap: sizeHelper.calWp(5),
              paddingVertical: sizeHelper.calHp(10),
            }}
          >
            <TouchableOpacity
              onPress={() => setIsAgree(!isAgree)}

              style={{ ...appStyles.row, gap: sizeHelper.calWp(5), }}>

              <TouchableOpacity
                onPress={() => setIsAgree(!isAgree)}
                style={{
                  width: sizeHelper.calWp(40),
                  height: sizeHelper.calWp(40),
                  borderRadius: sizeHelper.calWp(10),
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isAgree ? theme.colors.primary : "transparent",
                  borderColor: isAgree
                    ? theme.colors.primary
                    : theme.colors.black,
                  marginRight: sizeHelper.calWp(10),
                }}
              >
                {isAgree && (
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

              <CustomText text={"Agree to the"} />

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL("https://paddio.club/terms-of-service")}

            >
              <CustomText
                color={theme.colors.primary}
                text={"Terms of Service"}
              />
            </TouchableOpacity>
            <CustomText text={"And"} />

            <TouchableOpacity
              onPress={() => Linking.openURL("https://paddio.club/privacy-policy")}
            >
              <CustomText
                color={theme.colors.primary}
                text={"Privacy Policy"}
              />
            </TouchableOpacity>
          </View>
          <CustomButton onPress={OnSignup} text="Create account" />
          <View
            style={{
              ...appStyles.row,
              gap: sizeHelper.calWp(5),
              paddingVertical: sizeHelper.calHp(10),
              alignSelf: "center",
            }}
          >
            <CustomText size={22} text={"Already have an account?"} />

            <TouchableOpacity onPress={() => router.push("auth/login")}>
              <CustomText
                size={22}
                color={theme.colors.primary}
                fontFam={fonts.InterMedium}
                fontWeight="600"
                text={"Sign in"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
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
export default SignupScreen;

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
});
