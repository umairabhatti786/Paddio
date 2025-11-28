import sizeHelper from "@/constants/Helpers";
import { theme } from "@/constants/Theme";
import { Snackbar } from "react-native-paper";

type Props = {
  isVisable?: any;
  setIsVisable?: any;
  color?: string;
  message: string;
  marginBottom?: any;
  duration?: any;
  backgroundColor?:any
};

const CustomToast = ({
  message,
  isVisable,
  setIsVisable,
  color,
  duration,
  marginBottom,
  backgroundColor
}: Props) => {
  return (
    <Snackbar
  
      duration={duration || 1000}
      style={{
        backgroundColor: backgroundColor||theme.colors.red,
        marginBottom: marginBottom || sizeHelper.calHp(20),
        borderRadius:sizeHelper.calWp(15)
        // height:50
      }}
      visible={isVisable}
      onDismiss={() => setIsVisable(false)}
      action={{
        label: "OKAY",

        textColor: color || theme.colors.white,
        
        

        onPress: () => setIsVisable(false),
      }}
    >
      {message}
    </Snackbar>
  );
};
export default CustomToast;
