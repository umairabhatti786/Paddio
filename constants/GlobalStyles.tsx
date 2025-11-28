import { StyleSheet } from "react-native";
import sizeHelper from "./Helpers";



export const appStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowjustify: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

screenLayout:{
  flex: 1,
  paddingHorizontal: sizeHelper.calWp(30),
  gap: sizeHelper.calWp(30),
}

 
});
