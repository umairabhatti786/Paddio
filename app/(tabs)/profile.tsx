import CustomButton from "@/components/Button";
import CustomToast from "@/components/CustomToast";
import CustomToggleSwitch from "@/components/CustomToggleSwitch";
import LogoutModal from "@/components/LogoutModal";
import ScreenLayout from "@/components/ScreenLayout";
import CustomText from "@/components/Text";
import ZoomImageModal from "@/components/ZoomImageModal";
import * as ImagePicker from "expo-image-picker";

import { fonts } from "@/constants/Fonts";
import { appStyles } from "@/constants/GlobalStyles";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { LayoutsServices } from "@/constants/LayoutsServices";
import { UsePermission } from "@/constants/Permissions";
import { AUTH_DATA, StorageServices, TOKEN } from "@/constants/StorageServices";
import { SupabaseServices } from "@/constants/SupabaseServices";
import { theme } from "@/constants/Theme";
import { getAuthData, setAuthData } from "@/redux/reducers/authReducer";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { use, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ToggleSwitch from "toggle-switch-react-native";
import { supabase } from "@/constants/supabase";

const ProfileScreen = ({ navigation }: any) => {
  const auth = useSelector(getAuthData);
  const { requestGalleryPermission } = UsePermission();

  const router: any = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [messageColor, setMessageColor] = useState(theme.colors.red);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isZoomModal, setIsZoomModal] = useState(false)
  const [profileImgLoading, setProfileImgLoading] = useState(false)
  const [authSportName, setAuthSportName] = useState("")
  const [authPreference, setAuthPreference] = useState<any>({
    push_notifications: false,
    sms_notifications: false,
    email_updates: false,
    promotional_emails: false,
    partner_offers: false,
    event_recommendations: false,
  });
  const focused = useIsFocused();
  const dispatch = useDispatch();
  useEffect(() => {
    GetDetails();
  }, [focused]);
  const GetDetails = async () => {
    try {
      const userId = auth?.user_id;
      setLoading(true);

      const [profileRes, prefRes, sportRes] = await Promise.all([
        fetchUserProfile(userId),
        fetchUserPreferences(auth?.user_id),
        fetchUserSportName(userId)
      ]);

      if (!profileRes.success) {
        setMessage(profileRes.message);
        setIsMessage(true);
      }

      if (!prefRes.success) {
        setMessage(prefRes.message);
        setIsMessage(true);
      }


      if (!sportRes.success) {
        console.log("Unable to get sport name")
        // setMessage(prefRes.message);
        // setIsMessage(true);
      }

      setLoading(false);
    } catch (error: any) {
      setIsMessage(true);
      setMessage(error.message || "Something went wrong.");
      setLoading(false);
    }
  };


  const fetchUserProfile = async (userId: string) => {
    const profileResult: any = await SupabaseServices.GetUserProfile(userId);

    if (profileResult?.success) {
      const profile = profileResult?.data[0];

      StorageServices.setItem(AUTH_DATA, profile);
      dispatch(setAuthData(profile));

      return { success: true, profile };
    }

    return {
      success: false,
      message: profileResult?.message || "Failed to fetch profile.",
    };
  };


  const fetchUserSportName = async (userId: string) => {
    const sportResult: any = await SupabaseServices.GetUserSportName(userId);

    if (sportResult?.success) {
      const profile = sportResult?.data;
      setAuthSportName(profile?.sports?.name)

      // StorageServices.setItem(AUTH_DATA, profile);
      // dispatch(setAuthData(profile));

      return { success: true, profile };
    }

    return {
      success: false,
      message: sportResult?.message || "Failed to fetch profile.",
    };
  };

  const fetchUserPreferences = async (userId: string) => {
    const preferencesResult = await SupabaseServices.GetUserPreferences(userId);

    if (preferencesResult?.success) {
      const pref = preferencesResult?.data;

      setAuthPreference({
        push_notifications: pref?.push_notifications,
        sms_notifications: pref?.sms_notifications,
        email_updates: pref?.email_updates,
        promotional_emails: pref?.promotional_emails,
        partner_offers: pref?.partner_offers,
        event_recommendations: pref?.event_recommendations,
      });

      return { success: true, preferences: pref };
    }

    return {
      success: false,
      message: preferencesResult?.message || "Failed to fetch preferences.",
    };
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
      setProfileImgLoading(true)

      // setValues({ ...values, avatar: param });
      let imgResult = await SupabaseServices.UploadAvatar(auth.user_id, param.uri);

      const response = await SupabaseServices.UpdateUserProfile(auth.user_id, {
        avatar_url: imgResult?.url,
      });

      if (response.success) {
        StorageServices.setItem(AUTH_DATA, response.data);
        dispatch(setAuthData(response.data));
        setProfileImgLoading(false)

      }


    }
  };



  const onTogglePerference = async (preferences: any) => {
    const PreferenceResult: any = await SupabaseServices.UpdateUserPreferences(
      auth?.user_id,
      preferences
    );
    if (!PreferenceResult?.success) {
      setIsMessage(true);
      setMessage(PreferenceResult?.message);
    }
  };
  const PersonalInformationData = [
    {
      id: 1,
      title: "Full Name",
      sub_title: `${auth?.first_name} ${auth?.last_name}`,
      img: images.signature,
    },
    {
      id: 2,
      title: "Email",
      sub_title: `${auth?.email != null ? auth?.email : "N/A"}`,
      img: images.email,
    },
    {
      id: 3,
      title: "Phone",
      sub_title: `${auth?.country_code} ${auth?.phone_number}`,
      img: images.phone_number,
    },
    {
      id: 4,
      title: "Shirt Size",
      sub_title: `${auth?.shirt_size != null ? auth?.shirt_size : "N/A"}`,
      img: images.shirt,
    },
    {
      id: 5,
      title: "Preferred Sport",
      sub_title: `${authSportName}`,
      img: images.heart,
    },
  ];

  const PaymentMethodsData = [
    {
      id: 1,
      title: "•••• •••• •••• 4567",
      expiry_date: "Expires 12/27",
      img: images.visa_card,
      isDefault: true,
    },
    {
      id: 2,
      title: "•••• •••• •••• 8901",
      expiry_date: "Expires 08/26",
      img: images.master_card,
    },
  ];
  const Header = () => {
    return (
      <View
        style={{
          ...appStyles.rowjustify,
          backgroundColor: theme.colors.white,
          paddingHorizontal: sizeHelper.calWp(20),
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          paddingBottom: sizeHelper.calHp(20),
        }}
      >
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={styles.circle}
          >
            <Image
              style={{
                width: sizeHelper.calWp(30),
                height: sizeHelper.calWp(30),
                alignSelf: "center",
                tintColor: theme.colors.black,
              }}
              source={images.back_arrow}
            />
          </TouchableOpacity>

          <CustomText
            fontWeight="700"
            fontFam={fonts.InterBold}
            style={{ textAlign: "center" }}
            size={29}
            text={"Paddio"}
          />
        </View>
        <TouchableOpacity>
          <CustomText
            fontWeight="600"
            fontFam={fonts.InterMedium}
            size={25}
            color={theme.colors.primary}
            text={"Edit"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const PersonalInformationCard = () => {
    return (
      <View style={styles.detailContainer}>
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
          <Image
            style={{
              width: sizeHelper.calWp(25),
              height: sizeHelper.calWp(25),
              resizeMode: "contain",
              tintColor: theme.colors.primary,
            }}
            source={images.profile}
          />

          <CustomText
            size={25}
            fontFam={fonts.InterSemiBold}
            fontWeight="600"
            text={"Personal Information"}
          />
        </View>
        {PersonalInformationData.map((item, index) => {
          return (
            <View key={index.toString()} style={appStyles.rowjustify}>
              <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
                <Image
                  style={{
                    width: sizeHelper.calWp(35),
                    height: sizeHelper.calWp(35),
                    resizeMode: "contain",
                  }}
                  source={item?.img}
                />
                <View
                  style={{
                    gap: sizeHelper.calWp(5),
                  }}
                >
                  <CustomText
                    fontWeight="600"
                    fontFam={fonts.InterMedium}
                    size={22}
                    text={item?.title}
                  />

                  <CustomText
                    color={theme.colors.light_black}
                    text={item?.sub_title}
                  />
                </View>
              </View>

              <Image
                style={{
                  width: sizeHelper.calWp(35),
                  height: sizeHelper.calWp(35),
                  resizeMode: "contain",
                }}
                source={images.next_arrow}
              />
            </View>
          );
        })}
      </View>
    );
  };

  // const ToggleSwitchCard = React.memo(
  //   ({ title, des, isEnable, onToggle }: any) => {
  //     return (
  //       <View style={appStyles.rowjustify}>
  //         <View
  //           style={{
  //             gap: sizeHelper.calWp(5),
  //           }}
  //         >
  //           <CustomText
  //             fontWeight="600"
  //             fontFam={fonts.InterMedium}
  //             size={22}
  //             text={title}
  //           />

  //           <CustomText color={theme.colors.light_black} text={des} />
  //         </View>
  //         <CustomToggleSwitch
  //         isEnable={isEnable}
  //         onToggle={onToggle}
  //         />

  //         {/* <ToggleSwitch
  //           isOn={isEnable}
  //           onColor={theme.colors.primary}
  //           offColor={theme.colors.border}
  //           circleColor={theme.colors.white}
  //           thumbOnStyle={{ width: 24, height: 23, borderRadius: 9999 }}
  //           thumbOffStyle={{ width: 24, height: 23, borderRadius: 9999 }}
  //           trackOffStyle={{ width: 53, height: 29 }}
  //           trackOnStyle={{ width: 53, height: 29 }}
  //           // labelStyle={{ color: "black", fontWeight: "900" }}
  //           size="medium"
  //           onToggle={onToggle}
  //         /> */}
  //       </View>
  //     );
  //   }
  // );

  const ToggleSwitchCard = ({ title, des, isEnable, onToggle }: any) => {

    return (

      <View style={appStyles.rowjustify}>
        <View
          style={{
            gap: sizeHelper.calWp(5),
          }}
        >
          <CustomText
            fontWeight="600"
            fontFam={fonts.InterMedium}
            size={22}
            text={title}
          />

          <CustomText color={theme.colors.light_black} text={des} />
        </View>
        <CustomToggleSwitch
          isEnable={isEnable}
          onToggle={onToggle}
        />

        {/* <ToggleSwitch
        isOn={isEnable}
        onColor={theme.colors.primary}
        offColor={theme.colors.border}
        circleColor={theme.colors.white}
        thumbOnStyle={{ width: 24, height: 23, borderRadius: 9999 }}
        thumbOffStyle={{ width: 24, height: 23, borderRadius: 9999 }}
        trackOffStyle={{ width: 53, height: 29 }}
        trackOnStyle={{ width: 53, height: 29 }}
        // labelStyle={{ color: "black", fontWeight: "900" }}
        size="medium"
        onToggle={onToggle}
      /> */}
      </View>

    )


  }

  const PaymentMethodsCard = () => {
    return (
      <View style={styles.detailContainer}>
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
          <Image
            style={{
              width: sizeHelper.calWp(25),
              height: sizeHelper.calWp(25),
              resizeMode: "contain",
              tintColor: theme.colors.primary,
            }}
            source={images.card}
          />

          <CustomText
            size={25}
            fontFam={fonts.InterSemiBold}
            fontWeight="600"
            text={"Payment Methods"}
          />
        </View>
        {PaymentMethodsData.map((item, index) => {
          return (
            <View
              key={index.toString()}
              style={{
                ...appStyles.rowjustify,
                padding: sizeHelper.calWp(15),
                backgroundColor: theme.colors.background,
                borderRadius: sizeHelper.calWp(15),
              }}
            >
              <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
                <Image
                  style={{
                    width: sizeHelper.calWp(70),
                    height: sizeHelper.calWp(70),
                    resizeMode: "contain",
                  }}
                  source={item?.img}
                />
                <View
                  style={{
                    gap: sizeHelper.calWp(5),
                  }}
                >
                  <CustomText
                    fontWeight="600"
                    fontFam={fonts.InterMedium}
                    size={22}
                    text={item?.title}
                  />

                  <CustomText
                    // size={22}
                    color={theme.colors.light_black}
                    text={item?.expiry_date}
                  />
                </View>
              </View>

              <View style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}>
                {item?.isDefault && (
                  <CustomButton
                    borderRadius={99}
                    paddingHorizontal={10}
                    size={20}
                    bgColor={"#DCFCE7"}
                    textColor={"#166534"}
                    height={45}
                    text={"Default"}
                  />
                )}

                <Image
                  style={{
                    width: sizeHelper.calWp(30),
                    height: sizeHelper.calWp(30),
                    resizeMode: "contain",
                  }}
                  source={images.next_arrow}
                />
              </View>
            </View>
          );
        })}

        <CustomButton
          bgColor={theme.colors.white}
          textColor={theme.colors.black}
          borderWidth={1}
          borderColor={theme.colors.border}
          text="Add Payment Method"
        >
          <Image
            style={{
              width: sizeHelper.calWp(27),
              height: sizeHelper.calWp(27),
            }}
            source={images.plus}
          />
        </CustomButton>
      </View>
    );
  };

  const CommunicationPreferencesCard = () => {
    return (
      <View style={styles.detailContainer}>
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
          <Image
            style={{
              width: sizeHelper.calWp(25),
              height: sizeHelper.calWp(25),
              resizeMode: "contain",
              tintColor: theme.colors.primary,
            }}
            source={images.notification}
          />

          <CustomText
            size={25}
            fontFam={fonts.InterSemiBold}
            fontWeight="600"
            text={"Communication Preferences"}
          />
        </View>
        <ToggleSwitchCard
          title={"Push Notifications"}
          des={"Event updates and reminders"}
          isEnable={authPreference?.push_notifications}
          onToggle={async () => {
            setAuthPreference({
              ...authPreference,
              push_notifications: !authPreference?.push_notifications,
            });

            let preferences = {
              ...authPreference,
              push_notifications: !authPreference?.push_notifications,
            };
            onTogglePerference(preferences);
          }}
        />
        <ToggleSwitchCard
          title={"SMS Notifications"}
          des={"Important event alerts"}
          isEnable={authPreference?.sms_notifications}
          onToggle={async () => {
            setAuthPreference({
              ...authPreference,
              sms_notifications: !authPreference?.sms_notifications,
            });

            let preferences = {
              ...authPreference,
              sms_notifications: !authPreference?.sms_notifications,
            };
            onTogglePerference(preferences);
          }}
        />

        <ToggleSwitchCard
          title={"Email Updates"}
          des={"Weekly event digest"}
          isEnable={authPreference?.email_updates}
          onToggle={async () => {
            setAuthPreference({
              ...authPreference,
              email_updates: !authPreference?.email_updates,
            });

            let preferences = {
              ...authPreference,
              email_updates: !authPreference?.email_updates,
            };
            onTogglePerference(preferences);
          }}
        />
      </View>
    );
  };

  const MarketingPreferencesCard = () => {
    return (
      <View style={styles.detailContainer}>
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
          <Image
            style={{
              width: sizeHelper.calWp(25),
              height: sizeHelper.calWp(25),
              resizeMode: "contain",
              tintColor: theme.colors.primary,
            }}
            source={images.marketing}
          />

          <CustomText
            size={25}
            fontFam={fonts.InterSemiBold}
            fontWeight="600"
            text={"Marketing Preferences"}
          />
        </View>
        <ToggleSwitchCard
          title={"Promotional Emails"}
          des={"Special offers and discounts"}
          isEnable={authPreference?.promotional_emails}
          onToggle={async () => {
            setAuthPreference({
              ...authPreference,
              promotional_emails: !authPreference?.promotional_emails,
            });

            let preferences = {
              ...authPreference,
              promotional_emails: !authPreference?.promotional_emails,
            };
            onTogglePerference(preferences);
          }}
        />
        <ToggleSwitchCard
          title={"Partner Offers"}
          des={"Deals from sports equipment brands"}
          isEnable={authPreference?.partner_offers}
          onToggle={async () => {
            setAuthPreference({
              ...authPreference,
              partner_offers: !authPreference?.partner_offers,
            });

            let preferences = {
              ...authPreference,
              partner_offers: !authPreference?.partner_offers,
            };
            onTogglePerference(preferences);
          }}
        />

        <ToggleSwitchCard
          title={"Event Recommendations"}
          des={"Personalized event suggestions"}
          isEnable={authPreference?.event_recommendations}
          onToggle={async () => {
            setAuthPreference({
              ...authPreference,
              event_recommendations: !authPreference?.event_recommendations,
            });

            let preferences = {
              ...authPreference,
              event_recommendations: !authPreference?.event_recommendations,
            };
            onTogglePerference(preferences);
          }}
        />
      </View>
    );
  };

  const PolicyDetailCard = () => {
    return (
      <View style={{ ...styles.detailContainer, gap: sizeHelper.calHp(50) }}>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://paddio.club/privacy-policy")}

          style={appStyles.rowjustify}>
          <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
            <Image style={styles.icon} source={images.privacy} />

            <CustomText
              size={23}
              fontFam={fonts.InterMedium}
              fontWeight="600"
              text={"Privacy & Security"}
            />
          </View>

          <Image
            style={{
              width: sizeHelper.calWp(35),
              height: sizeHelper.calWp(35),
              resizeMode: "contain",
            }}
            source={images.next_arrow}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://paddio.club/support")}
          style={appStyles.rowjustify}>
          <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
            <Image style={styles.icon} source={images.help} />

            <CustomText
              size={23}
              fontFam={fonts.InterMedium}
              fontWeight="600"
              text={"Help & Support"}
            />
          </View>

          <Image
            style={{
              width: sizeHelper.calWp(35),
              height: sizeHelper.calWp(35),
              resizeMode: "contain",
            }}
            source={images.next_arrow}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsLogoutVisible(true)}
          style={appStyles.rowjustify}
        >
          <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
            <Image style={styles.icon} source={images.logout} />

            <CustomText
              size={23}
              color={theme.colors.red}
              fontFam={fonts.InterMedium}
              fontWeight="600"
              text={"Sign Out"}
            />
          </View>

          <Image
            style={{
              width: sizeHelper.calWp(35),
              height: sizeHelper.calWp(35),
              resizeMode: "contain",
            }}
            source={images.next_arrow}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <ScreenLayout style={{ paddingHorizontal: -1, gap: 0 }}>
        <Header />
        {loading ? (
          LayoutsServices.ProfileLayout()
        ) : (
          <ScrollView
            contentContainerStyle={{
              gap: sizeHelper.calHp(20),
              paddingBottom: sizeHelper.calHp(100),
            }}
            style={{
              padding: sizeHelper.calWp(30),
              gap: sizeHelper.calHp(20),
              backgroundColor: theme.colors.background,
              flex: 1,
            }}
          >
            <View style={{ gap: sizeHelper.calHp(10) }}>
              <View
                style={{
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setIsZoomModal(true)}
                  style={styles.upload_img_container}>
                  <Image
                    style={{ width: "100%", height: "100%", borderRadius: 999 }}
                    source={auth?.avatar_url ? { uri: auth?.avatar_url } : images.user}
                  />
                  {
                    profileImgLoading && (

                      <View style={{ position: "absolute", backgroundColor: "rgba(0,0,0,0.3)", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator
                          size={"large"}
                          color={theme.colors.white}
                        />



                      </View>

                    )
                  }

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.camera_container}>
                  <Image style={styles.camera_img} source={images.camera} />
                </TouchableOpacity>
              </View>

              <CustomText
                fontWeight="700"
                fontFam={fonts.InterBold}
                size={35}
                style={{ textAlign: "center" }}
                text={`${auth?.first_name} ${auth?.last_name}`}
              />
              <CustomText
                style={{ textAlign: "center" }}
                color={theme.colors.sub_heading_gray}
                text={`Member since ${moment(auth?.created_at).format(
                  "MMMM YYYY"
                )}`}
              />
              <View
                style={{
                  ...appStyles.row,
                  gap: sizeHelper.calWp(30),
                  alignSelf: "center",
                }}
              >
                <View style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}>
                  <Image
                    style={{
                      width: sizeHelper.calWp(25),
                      height: sizeHelper.calWp(25),
                      resizeMode: "contain",
                    }}
                    source={images.cup}
                  />

                  <CustomText
                    color={theme.colors.light_black}
                    text={`${0} Events Won`}
                  />
                </View>

                <View style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}>
                  <Image
                    style={{
                      width: sizeHelper.calWp(25),
                      height: sizeHelper.calWp(25),
                      resizeMode: "contain",
                    }}
                    source={images.star}
                  />

                  <CustomText
                    color={theme.colors.light_black}
                    text={`${auth?.ranking} Rating`}
                  />
                </View>
              </View>
            </View>
            <PersonalInformationCard />
            <PaymentMethodsCard />
            <CommunicationPreferencesCard />
            <MarketingPreferencesCard />
            <PolicyDetailCard />

            {/* <View>
            <FlatList
              data={filterTab}
              horizontal
              showsHorizontalScrollIndicator={false}
              // style={{
              //   // paddingLeft: sizeHelper.calWp(isIpad ? 30 : 40),
              //   // backgroundColor:"red",
              //   paddingVertical: 10,
              // }}
              contentContainerStyle={{
                gap: sizeHelper.calWp(20),
              }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }: any) => {
                return (
                  <CustomButton
                    key={index.toString()}
                    borderRadius={99}
                    //   width={"48%"}
                    paddingHorizontal={20}
                    borderWidth={selectedFilter?.id !== item?.id ? 1 : -1}
                    borderColor={
                      selectedFilter?.id !== item?.id
                        ? theme.colors.border
                        : "transparent"
                    }
                    bgColor={
                      selectedFilter?.id == item?.id
                        ? theme.colors.primary
                        : theme.colors.white
                    }
                    textColor={
                      selectedFilter?.id == item?.id
                        ? theme.colors.white
                        : theme.colors.sub_heading_gray
                    }
                    height={60}
                    size={22}
                    onPress={() => setSelectedFilter(item)}
                    text={item?.title}
                  />
                );
              }}
            />
          </View>
          <View
            style={{
              ...appStyles.rowjustify,
              paddingVertical: sizeHelper.calHp(20),
            }}
          >
            <CustomText
              text={"Upcoming Events"}
              size={27}
              fontWeight="600"
              fontFam={fonts.InterSemiBold}
            />
            <TouchableOpacity style={{ paddingBottom: sizeHelper.calHp(8) }}>
              <CustomText
                text={"View All"}
                fontWeight="600"
                size={25}
                color={theme.colors.primary}
                fontFam={fonts.InterMedium}
              />
            </TouchableOpacity>
          </View>
  
          <FlatList
            data={[1, 2, 3, 4]}
            showsHorizontalScrollIndicator={false}
            // style={{
            //   // paddingLeft: sizeHelper.calWp(isIpad ? 30 : 40),
            //   // backgroundColor:"red",
            //   paddingVertical: 10,
            // }}
            contentContainerStyle={{
              gap: sizeHelper.calWp(20),
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }: any) => {
              return <EventCard />;
            }}
          /> */}
          </ScrollView>
        )}
      </ScreenLayout>

      <CustomToast
        isVisable={isMessage}
        backgroundColor={messageColor}
        setIsVisable={setIsMessage}
        message={message}
      />

      <LogoutModal
        modalVisible={isLogoutVisible}
        setModalVisible={setIsLogoutVisible}
        onCancel={() => {
          setIsLogoutVisible(false);
        }}
        onLogoutUser={ async() => {
          setIsLogoutVisible(false);
          await supabase.auth.signOut();

          setTimeout(() => {
            StorageServices.removeItem(AUTH_DATA);
            StorageServices.removeItem(TOKEN);

            setTimeout(() => {
              router.replace("auth/login");
            }, 300); // Delay reset slightly
          }, 500);
        }}
      />

      <ZoomImageModal
        book_img={auth?.avatar_url}
        modalVisible={isZoomModal}
        setModalVisible={setIsZoomModal}
        onPress={() => {
          // setIsSuccessModal(false);
        }}
      />
    </>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  circle: {
    padding: sizeHelper.calWp(25),
    borderRadius: 999,
    backgroundColor: theme.colors.gray_btn,
  },

  upload_img_container: {
    width: sizeHelper.calWp(180),
    height: sizeHelper.calWp(180),
    borderWidth: sizeHelper.calWp(8),
    borderColor: theme.colors.white,
    borderRadius: sizeHelper.calWp(150),
    overflow: "hidden",
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
  detailContainer: {
    width: "100%",
    borderRadius: sizeHelper.calWp(18),
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: sizeHelper.calHp(30),
    paddingHorizontal: sizeHelper.calWp(20),
    paddingTop: sizeHelper.calHp(20),
    gap: sizeHelper.calHp(25),
  },
  icon: {
    width: sizeHelper.calWp(32),
    height: sizeHelper.calWp(32),
    resizeMode: "contain",
  },
});
