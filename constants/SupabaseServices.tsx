import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabase";

import { decode } from "base64-arraybuffer";
export const SupabaseServices = {
  SignUpWithEmail: async (email: any, password: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup Error:", error.message);
        return { success: false, message: error.message };
      }

      const user = data.user;

      return {
        success: true,
        data: user,
        message: "Signup successful. Please verify your email.",
      };
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      return {
        success: false,
        message: "Something went wrong. Try again later.",
      };
    }
  },

  SignUpWithPhone: async (phone: any, password: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        phone,
        password,
      });

      if (error) {
        console.error("Signup Error:", error.message);
        return { success: false, message: error.message };
      }

      const user = data.user;

      return {
        success: true,
        data: user,
        message: "Signup successful. Please verify your email.",
      };
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      return {
        success: false,
        message: "Something went wrong. Try again later.",
      };
    }
  },

  VerifyOTP: async (phoneNumber: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token, // the OTP the user received
        type: "sms", // can also be "magiclink" if using email
      });

      if (error) {
        console.log("❌ OTP verification failed:", error.message);
        return { success: false, message: error.message };
      }

      console.log("OTP verified successfully:", data.user);
      return { success: true, data };
    } catch (err) {
      console.log("Unexpected error:", err);
      return { success: false, message: "Something went wrong" };
    }
  },

  ResendOTP: async (phone: string,) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        console.log("❌ OTP verification failed:", error.message);
        return { success: false, message: error.message };
      }

      return { success: true, data, message: "OTP sent successfully" };
    } catch (err) {
      console.log("Unexpected error:", err);
      return { success: false, message: "Something went wrong" };
    }
  },

  UploadAvatar: async (userId: any, fileUri: any) => {
    try {
      if (!fileUri) {
        return { success: false, message: "No file selected" };
      }

      // Create a unique filename
      const fileExt = fileUri.split(".").pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // ✅ For older Expo SDKs, use string literal instead of FileSystem.EncodingType.Base64
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: "base64" as any,
      });

      // ✅ Convert base64 → ArrayBuffer
      const fileData = decode(base64);

      // ✅ Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, fileData, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (error) {
        console.error("❌ Error uploading avatar:", error.message);
        return { success: false, message: error.message };
      }

      // ✅ Get public URL
      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicData.publicUrl,
        message: "Avatar uploaded successfully!",
      };
    } catch (err) {
      console.error("🚨 Unexpected upload error:", err);
      return {
        success: false,
        message: "Something went wrong while uploading avatar.",
      };
    }
  },

  GetSports: async () => {
    const { data, error } = await supabase
      .from("sports")
      .select("*")
      .eq("is_active", true); // Optional filter

    if (error) {
      console.error("Error fetching sports:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  },


  GetUserSportName: async (userId: any) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(
        `
        *,
        sports:preferred_sport (
          name
        )
      `
      )
      .eq("user_id", userId)
      .single();
  
    if (error) {
      console.error("Error fetching user profile:", error.message);
      return { success: false, message: error.message };
    }
  
    return { success: true, data };
  },
  
  GetUserProfile: async (userId: any) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching sports:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  },

  UpdateUserProfile: async (userId: string, payload: any) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update(payload)
        .eq("user_id", userId)
        .select()
        .single();
  
      if (error) {
        console.error("Error updating user profile:", error.message);
        return { success: false, message: error.message };
      }
  
      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, message: "Unable to update user profile" };
    }
  },
  
  GetTournamentEvents: async (filters: any) => {
    try {
      // Always include all params — even if they're null
      const payload = {
        p_city: filters?.p_city ?? null,
        p_date_from: filters?.p_date_from ?? null,
        p_date_to: filters?.p_date_to ?? null,
        p_sport_id: filters?.p_sport_id ?? null,
      };

      console.log("📦 Sending payload:", payload);

      const response = await fetch(
        "https://wkwvfmhelmcjmzltwxwa.supabase.co/rest/v1/rpc/get_tournament_events",
        {
          method: "POST",
          headers: {
            apikey: "sb_publishable_s3Z1BbUa2jNTUuliarKDig_W0doOHsH",
            authorization:
              "Bearer sb_publishable_s3Z1BbUa2jNTUuliarKDig_W0doOHsH",
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      // Handle Supabase REST errors (non-200)
      if (!response.ok) {
        console.error("❌ Supabase RPC error:", data);
        return {
          success: false,
          message: data?.message || "Failed to fetch tournament events",
        };
      }

      console.log("✅ Tournament events fetched:", data);
      return { success: true, data };
    } catch (err) {
      console.error("🚨 Unexpected error in GetTournamentEvents:", err);
      return { success: false, message: "Unexpected error" };
    }
  },

  GetUserPreferences: async (userId: string) => {
  
    try {
      // Get existing preferences
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .limit(1);
  
      if (error) {
        console.error("Error fetching preferences:", error.message);
        return { success: false, message: error.message };
      }
  
      let preferences = data?.[0];  
      // If not found → Insert default values
      if (!preferences) {
        const defaultPreferences = {
          user_id: userId,
          push_notifications: true,
          sms_notifications: false,
          email_updates: true,
          promotional_emails: true,
          partner_offers: false,
          event_recommendations: true,
        };
  
        const { data: inserted, error: insertError } = await supabase
          .from("user_preferences")
          .insert(defaultPreferences)
          .select()
          .single();
  
        if (insertError) {
          console.error("Error inserting default preferences:", insertError.message);
          return { success: false, message: insertError.message };
        }
  
        preferences = inserted;
      }
  
      return { success: true, data: preferences };
  
    } catch (e: any) {
      console.error("Unexpected error:", e);
      return { success: false, message: "Unable to fetch" };
    }
  },  

  UpdateUserPreferences: async (userId: any, preferences: any) => {
    const { data, error } = await supabase
      .from("user_preferences")
      .update({
        email_updates: preferences?.email_updates,
        event_recommendations: preferences?.event_recommendations,
        partner_offers: preferences?.partner_offers,
        promotional_emails: preferences?.promotional_emails,
        push_notifications: preferences?.push_notifications,
        sms_notifications: preferences?.sms_notifications,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select(); // optional: return updated data

    if (error) {
      console.error("Error updating preferences:", error.message);
      return { success: false, message: error.message };
    }
    return { success: true, data: data?.[0] };
  },

  GetAuthUser: async () => {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    const session = sessionData.session;

    if (sessionError) {
      return { success: false, message: sessionError.message };
    }
    if (!session) {
      return null; // No logged-in user
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return { success: false, message: userError.message };
    }

    return { success: true, data: userData.user };
  },

  GetCity: async () => {
    const { data, error } = await supabase.rpc("get_events_cities");

    if (error) {
      console.error("Error fetching sports:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  },
};
