import { theme } from "@/constants/Theme";
import ToggleSwitch from "toggle-switch-react-native";
import { memo } from "react";

interface Props {
  isEnable: boolean;
  onToggle: (value: boolean) => void;
}

const CustomToggleSwitch = memo(({ isEnable, onToggle }: Props) => {
  // Static styles outside render to avoid re-creation
  const thumbStyle = { width: 24, height: 23, borderRadius: 9999 };
  const trackStyle = { width: 53, height: 29 };

  return (
    <ToggleSwitch
      isOn={isEnable}
      onColor={theme.colors.primary}
      offColor={theme.colors.border}
      circleColor={theme.colors.white}
      thumbOnStyle={thumbStyle}
      thumbOffStyle={thumbStyle}
      trackOnStyle={trackStyle}
      trackOffStyle={trackStyle}
      size="medium"
      onToggle={onToggle}
    />
  );
});

export default CustomToggleSwitch;
