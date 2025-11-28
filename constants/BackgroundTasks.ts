// otpTimerTask.ts
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const OTP_TIMER_TASK = "OTP_TIMER_TASK";

let otpExpireTimestamp = 0;

export const startOTPTimer = (seconds: number) => {
  otpExpireTimestamp = Date.now() + seconds * 1000;
};

export const getRemainingTime = () => {
  const remaining = Math.max(Math.ceil((otpExpireTimestamp - Date.now()) / 1000), 0);
  return remaining;
};

TaskManager.defineTask(OTP_TIMER_TASK, async () => {
  // Task runs periodically in background
  // Just return new data to keep task alive
  return BackgroundFetch.Result.NewData;
});

export const registerOTPTimerTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(OTP_TIMER_TASK, {
      minimumInterval: 1, // in seconds (iOS may throttle)
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (err) {
    console.log("Error registering OTP background task", err);
  }
};
