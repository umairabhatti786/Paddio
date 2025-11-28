import CustomButton from "@/components/Button";
import CustomDropDown from "@/components/CustomDropDown";
import EventCard from "@/components/EventCard";
import ScreenLayout from "@/components/ScreenLayout";
import CustomText from "@/components/Text";
import LottieView from "lottie-react-native";

import { fonts } from "@/constants/Fonts";
import { appStyles } from "@/constants/GlobalStyles";
import sizeHelper from "@/constants/Helpers";
import { images } from "@/constants/Images";
import { LayoutsServices } from "@/constants/LayoutsServices";
import { SupabaseServices } from "@/constants/SupabaseServices";
import { theme } from "@/constants/Theme";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { getAuthData } from "@/redux/reducers/authReducer";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }: any) => {
  const router: any = useRouter();
  const [selectedSport, setSelectedSports] = useState<any>();
  const [selectedCity, setSelectedCity] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
console.log("insets",insets)
  const [selectedFilter, setSelectedFilter] = useState({ title: "All", id: 1 });
  const auth=useSelector(getAuthData)

  const [preferredSports, setPreferredSports] = useState<any>([]);
  const [cityData, setCityData] = useState([]);
  const focused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any>([]);

  const [filterEvent, setFilterEvent] = useState<any>({
    p_city: null,
    p_date_from: null,
    p_date_to: null,
    p_sport_id: null,
  });

  const emptyFilter = {
    p_city: null,
    p_date_from: null,
    p_date_to: null,
    p_sport_id: null,
  };

  const filterTab = [
    { title: "All", id: 1, label: "all" },
    { title: "Today", id: 2, label: "today" },
    { title: "This Week", id: 3, label: "week" },
    { title: "Free", id: 4, label: "free", free: 0 },
    { title: "Premium", id: 5, label: "premium", premium: true },
  ];

  // const eventData = [
  //   {
  //     title: "Table Tennis Tournament",
  //     des: "Central Sports Club",
  //     color: "#DBEAFE",
  //     date: "Dec 15, 2024",
  //     time: "2:00 PM",
  //     location: "New York",
  //     isOpen: true,
  //     img: images.table_tennis,
  //     players: "12/16 players",
  //   },
  //   {
  //     title: "Tennis Singles Match",
  //     des: "Riverside Tennis Court",
  //     color: "#DCFCE7",
  //     date: "Dec 16, 2024",
  //     time: "4:30 PM",
  //     location: "Los Angeles",
  //     isAlmostfull: true,
  //     img: images.ball,
  //     players: "7/8 players",
  //   },
  //   {
  //     title: "Badminton League",
  //     des: "Metro Sports Complex",
  //     color: "#F3E8FF",
  //     date: "Dec 18, 2024",
  //     time: "6:00 PM",
  //     location: "Chicago",
  //     isFull: true,
  //     img: images.football,
  //     players: "20/20 players",
  //   },
  // ];

  useEffect(() => {
    GetEvents(filterEvent);
    GetDetails();
  }, []);

  const onRefresh = () => {
    console.log("ckdnckdnkdnn")
    setRefreshing(true);
    GetDetails()
    // refresh logic here
    GetEvents(filterEvent).finally(() => {
      setRefreshing(false);
    });
  };


  const GetEvents = async (filter: any) => {
    console.log("ckdncdkncDataa", filter);
    const response = await SupabaseServices.GetTournamentEvents({
      p_city: filter?.p_city, // will be included
      p_date_from: filter?.p_date_from, // ignored
      p_date_to: filter?.p_date_to, // ignored
      p_sport_id: filter?.p_sport_id, // ignored
    });

    if (response.success) {
      setLoading(false);
      if (filter.free == 0) {
        const filteredData = response?.data?.filter(
          (item: any) => item?.tournament_fee == 0
        );
        setEvents(filteredData);
        return;
      }

      if (filter.premium) {
        const filteredData = response?.data?.filter(
          (item: any) => item?.premium == true
        );
        setEvents(filteredData);
        return;
      }
      setEvents(response?.data);

    } else {
      setLoading(false);

      console.log("⚠️ Error:", response.message);
    }
  };

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
  const Header = () => {
    return (
      <View
        style={{
          ...appStyles.rowjustify,
          backgroundColor: theme.colors.white,
          paddingHorizontal: sizeHelper.calWp(20),
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.background,
          paddingBottom: sizeHelper.calHp(20),
        }}
      >
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
          <Image
            style={{
              width: sizeHelper.calWp(55),
              height: sizeHelper.calWp(55),
              alignSelf: "center",
            }}
            source={images.icon}
          />

          <CustomText
            fontWeight="700"
            fontFam={fonts.InterBold}
            style={{ textAlign: "center" }}
            size={29}
            text={"Paddio"}
          />
        </View>
        <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
          <TouchableOpacity style={styles.circle}>
            <Image
              style={{
                width: sizeHelper.calWp(30),
                height: sizeHelper.calWp(30),
                alignSelf: "center",
              }}
              source={images.notification}
            />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>router.push("/profile")}
          >
          <Image
            style={{
              width: sizeHelper.calWp(80),
              height: sizeHelper.calWp(80),
              alignSelf: "center",
              borderRadius: sizeHelper.calWp(60),
            }}
            source={auth?.avatar_url?{uri:auth?.avatar_url}:  images.user}
          />

          </TouchableOpacity>
         
        </View>
      </View>
    );
  };

  return (
    <ScreenLayout style={{ paddingHorizontal: -1, gap: 0 }}>
      <Header />
      <View
        style={{
          paddingHorizontal: sizeHelper.calWp(30),
          paddingTop: sizeHelper.calHp(30),
          gap: sizeHelper.calHp(20),
          backgroundColor: theme.colors.black + "08",
          flex: 1,
        }}
      >
        <CustomText
          fontWeight="700"
          fontFam={fonts.InterBold}
          size={35}
          text={"Welcome back!"}
        />
        <CustomText
          color={theme.colors.sub_heading_gray}
          text={"Find and join sports events near you"}
        />

        <View style={appStyles.rowjustify}>
          <CustomDropDown
            placeholder={"All Sports"}
            value={selectedSport}
            leftSource={images.filter}
            width="48%"
            setValue={setSelectedSports}
            data={preferredSports}
            top={90}
            label_color={theme.colors.sub_heading_gray}
            onActions={(it: any) => {
              let param = {
                ...filterEvent,
                p_sport_id: it?.id,
              };
              setFilterEvent({
                ...filterEvent,
                p_sport_id: it?.id,
              });
              setSelectedSports(it);
              setLoading(true);
              GetEvents(param);
            }}
          />
          <CustomDropDown
            placeholder={"All Cities"}
            value={selectedCity}
            width="48%"
            leftSource={images.pin}
            top={90}
            label_color={theme.colors.sub_heading_gray}
            setValue={setSelectedCity}
            // onActions={(it: any) => {
            //   setSelectedCity(it);
            // }}

            onActions={(it: any) => {
              let param = {
                ...filterEvent,
                p_city: it?.name,
              };
              setFilterEvent({
                ...filterEvent,
                p_city: it?.name,
              });
              setSelectedCity(it);
              setLoading(true);
              console.log("paramCity", param)
              GetEvents(param);
            }}
            data={cityData}
          />
        </View>
        <View>
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
                  onPress={() => {
                    if (item.label == "all") {
                      setFilterEvent({
                        ...emptyFilter,
                      });

                      setLoading(true);
                      GetEvents(emptyFilter);
                      setSelectedCity({});
                      setSelectedSports({});
                    }

                    if (item.label == "today") {
                      let param = {
                        ...filterEvent,
                        p_date_from: moment()
                          .utc()
                          .startOf("day")
                          .toISOString(),
                        p_date_to: moment().utc().endOf("day").toISOString(),
                      };
                      console.log("Todayparam", param)
                      setFilterEvent({
                        ...filterEvent,
                        p_date_from: param?.p_date_from,
                        p_date_to: param?.p_date_to,
                      });

                      setLoading(true);
                      GetEvents(param);
                    }

                    if (item.label == "week") {
                      let param = {
                        ...filterEvent,
                        p_date_from: moment()
                          .utc()
                          .startOf("isoWeek")
                          .toISOString(), // Monday 00:00
                        p_date_to: moment()
                          .utc()
                          .endOf("isoWeek")
                          .toISOString(), // Sunday 23:59
                      };
                      setFilterEvent({
                        ...filterEvent,
                        p_date_from: param?.p_date_from,
                        p_date_to: param?.p_date_to,
                      });

                      setLoading(true);
                      GetEvents(param);
                    }

                    if (item.label == "free") {
                      let param = {
                        free: 0,
                        ...filterEvent,
                      };

                      setLoading(true);
                      GetEvents(param);
                    }

                    if (item.label == "premium") {
                      let param = {
                        premium: true,
                        ...emptyFilter,
                      };

                      setLoading(true);
                      GetEvents(param);
                    }

                    setSelectedFilter(item);
                  }}
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
        {loading ? (
          LayoutsServices.EventsLayout()
        ) : (
          <View>
            <FlatList
              data={events}
              showsVerticalScrollIndicator={false}

              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.colors.primary}   // iOS indicator color
                  colors={[theme.colors.primary]}    // Android indicator color
                />
              }
              // style={{
              //   // paddingLeft: sizeHelper.calWp(isIpad ? 30 : 40),
              //   // backgroundColor:"red",
              //   paddingVertical: 10,
              // }}
              contentContainerStyle={{
                gap: sizeHelper.calWp(20),
                paddingBottom: sizeHelper.calHp( Platform.OS=="ios"? 410:450+ insets.bottom),
              }}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LottieView
                    style={{
                      width: sizeHelper.calWp(450),
                      height: sizeHelper.calWp(550),
                    }}
                    source={require("../../assets/json/empty.json")}
                    renderMode="HARDWARE"
                    autoPlay
                    loop={false}
                  />

                  <CustomText
                    fontWeight="400"
                    style={{ marginTop: sizeHelper.calHp(-100) }}
                    fontFam={fonts.InterRegular}
                    // size={16}
                    text="No events available at the moment."
                  />
                </View>
              )}
              renderItem={({ item, index }: any) => {
                return <EventCard item={item} />;
              }}
            />
          </View>
        )}
      </View>
    </ScreenLayout>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  circle: {
    padding: sizeHelper.calWp(25),
    borderRadius: 999,
    backgroundColor: theme.colors.gray_btn,
  },
});
