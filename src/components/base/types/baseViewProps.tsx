import { GestureResponderEvent, ViewStyle } from 'react-native';

export interface BaseViewProps {
  justifyContent?: ViewStyle['justifyContent'];
  alignItems?: ViewStyle['alignItems'];
  row?: boolean;

zIndex?:ViewStyle['zIndex'];
  height?: ViewStyle['height'];
  minHeight?: number | 'auto';
  width?: ViewStyle['width'];
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;

  // Padding & Margin
  margin?: number;
  marginBottom?: number;
  marginHorizontal?: number;
  marginLeft?: ViewStyle['marginLeft'];
  marginRight?:ViewStyle['marginRight'];
  marginTop?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  alignSelf?: ViewStyle['alignSelf'];
  // Border & Radius

  radius?: number;
  borderColor?: ViewStyle['borderColor'];
  borderWidth?: number;
  borderTopColor?: ViewStyle['borderTopColor'];
  borderTopWidth?: number;
  borderTopEndRadius?: number;
  borderTopLeftRadius?: number;
  borderBottomColor?: ViewStyle['borderBottomColor'];
  borderBottomWidth?: number;
  borderLeftColor?: ViewStyle['borderLeftColor'];
  borderLeftWidth?: number;
  borderRightColor?: ViewStyle['borderRightColor'];
  borderRightWidth?: number;

  // Layout
  gap?: number;
  flexWrap?: ViewStyle['flexWrap'];
  flex?: number;
  backgroundColor?: string;
  position?: ViewStyle['position'];


  style?: ViewStyle;
  children?: React.ReactNode;
  opacity?: ViewStyle['opacity'];
}
export interface CustomButtonProps extends BaseViewProps {
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  activeOpacity?: number | undefined|string;
}
export interface CustomButtonSubmitProps extends CustomButtonProps {
  titleText?: number | string;
  active?: boolean;
  colorText?: string;
  colorBackgroud?: string;

}