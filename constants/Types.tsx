import {
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
  
  //  Custom text props
  export type TextType = {
    color?: string;
    size?: number;
    fontFam?: string;
    text?: any;
    style?: StyleProp<TextStyle>; // Style for the screen container
    lineHeight?: number;
    numberOfLines?: number;
    fontWeight?: string;
    textDecorationLine?: string;
    label?: any;
    textTransform?: any;
  };
  //  Custom button props
  
  export type ButtonProps = {
    text?: string;
    onPress?: () => void;
    width?: any;
    height?: number;
    size?: number;
    fontFam?: any;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>; // Style for the screen container
    bgColor?: any;
    textColor?: any;
    borderColor?: any;
    disable?: boolean;
    borderWidth?: number;
    paddingHorizontal?: number;
    isLoading?: any;
    fontWeight?: string;
    colors?: any;
    children?: any;
  };
  //  Custom input props
  
  export type InputProps = {
    placeholder?: string;
    error?: string;
    secureTextEntry?: boolean;
    rightSource?: any;
    keyboard?: any;
    props?: any;
    value?: any;
    onChangeText?: any;
    onBlur?: any;
    onShowPassword?: any;
    editable?: boolean;
    color?: string;
    maxLength?: number;
    leftSource?: any;
    fontWeight?: any;
    multiline?: boolean;
    height?: any;
    width?: any;
    fontSize?: any;
    placeholderTextColor?: any;
    borderWidth?: any;
    borderRadius?: any;
    backgroundColor?: any;
    borderColor?: any;
    rightSourceSize?: any;
    textAlign?: any;
    textAlignVertical?: any;
    paddingTop?: any;
    onSubmitEditing?: () => void;
    mandatory?: boolean;
    label?: string;
    complusory?: boolean;
    labelSize?: any;
    onFocus?: any;
    focusedInput?: any;
    setFocusedInput?: any;
    inputKey?: string;
    disable?: boolean;
    rightIconPress?: any;
    defaultValue?: any;
    selection?: any;
    onSelectionChange?: any;
    textColor?: any;
    onRightSource?: any;
    fontFamily?: any;
  };
  //  Custom screen layout props
  
  export type AppStackParamList = {
    GetStarted: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
    YourIdentity: undefined;
    ProofOfResidency: undefined;
    PassportPhotoInstruction: undefined;
    BottomTab: undefined;
    AddScreen: undefined;
    ProfileScreen: undefined;
    TransactionHistory: undefined;
    SendMoneyScreen: undefined;
    RecipientInformation: undefined;
    DeliveryMethod: undefined;
    EnterAmount: undefined;
    ReviewPaymentDetails: undefined;
    PaymentComplete: undefined;
    YouVerified: undefined;
    CapturedYourImage: undefined;
    CapturedIDCard: undefined;
    PhotoIDCard: undefined;
    TakeSelfie: undefined;
    Tabs:undefined
  };
  