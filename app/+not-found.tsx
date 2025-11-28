import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import { SupabaseServices } from "@/constants/SupabaseServices";
import { useEffect } from "react";
import { AUTH_DATA, StorageServices } from "@/constants/StorageServices";
import { useDispatch } from "react-redux";
import { setAuthData } from "@/redux/reducers/authReducer";
import { supabase } from "@/constants/supabase";

export default function NotFoundScreen() {
  const router: any = useRouter();
  const dispatch = useDispatch()

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth Event:", event);
  
        if (session?.user) {
          const auth = await StorageServices.getItem(AUTH_DATA);

          if (auth?.user_id) {
            // 1️⃣ Fetch latest profile before navigation
            const refreshedProfile:any = await SupabaseServices.GetUserProfile(auth?.user_id);
            console.log("refreshedProfile",refreshedProfile)
            if (refreshedProfile?.success) {
              StorageServices.setItem(AUTH_DATA, refreshedProfile?.data[0]);
              dispatch(setAuthData(refreshedProfile?.data[0]));
            }
            router.replace("/(tabs)/home")
            // 2️⃣ Navigate AFTER profile is updated
            return;
          }
        } else {
          router.push("auth/signup");
        }
      }
    );
  
    return () => listener.subscription.unsubscribe();
  }, []);

  
const fetchUser = async () => {

  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUser = sessionData?.session?.user;
  const auth = await StorageServices.getItem(AUTH_DATA);
  const user = (await supabase.auth.getUser()).data?.user;

console.log("cldmlcdncldc",user)

  if (auth?.user_id) {
    // 1️⃣ Fetch latest profile before navigation
    const refreshedProfile:any = await SupabaseServices.GetUserProfile(auth?.user_id);
    console.log("refreshedProfile",refreshedProfile)
    if (refreshedProfile?.success) {
      StorageServices.setItem(AUTH_DATA, refreshedProfile?.data[0]);
      dispatch(setAuthData(refreshedProfile?.data[0]));
    }
    router.replace("/(tabs)/home")
    // 2️⃣ Navigate AFTER profile is updated
    return;
  }

  router.push("auth/signup");
};
 
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
