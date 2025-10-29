import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { CustomButtonProps } from '../base/types/baseViewProps';



const AppButton: React.FC<CustomButtonProps> = ({
  justifyContent,
  alignItems,
  backgroundColor,
  height,
  minHeight,
  width,
  padding,paddingRight,
  paddingVertical,
  paddingHorizontal,
  margin, marginLeft,paddingLeft,marginRight,
  radius,
  borderColor,
  borderTopEndRadius,
  borderTopLeftRadius,
  gap,
  borderWidth,
  borderTopWidth,
  borderTopColor,
  borderBottomColor,
  borderBottomWidth,
  borderLeftColor,
  borderLeftWidth,
  borderRightColor,
  borderRightWidth,
  flexWrap,
  flex,
  top,
  bottom,
  left,
  right,activeOpacity,
  row,
  position,
  style,
  children,opacity,
  onPress,
  disabled = false,
}) => {
  const viewStyle: ViewStyle = {
    justifyContent,
    alignItems,
    backgroundColor,
    height,activeOpacity,
    minHeight,
    width,
    padding,paddingRight,paddingLeft,
    paddingVertical,
    paddingHorizontal,
    margin,marginLeft,marginRight,
    borderRadius:radius,
    borderTopEndRadius,
    borderTopLeftRadius,
    gap,
    borderColor,
    borderWidth,
    borderTopWidth,
    borderTopColor,
    borderBottomColor,
    borderBottomWidth,
    borderLeftColor,
    borderLeftWidth,
    borderRightColor,
    borderRightWidth,
    flexWrap, opacity,
    flex,
    top,
    bottom,
    left,
    right,
    position,
    ...(row && { flexDirection: 'row' }),
  };

  return (
    <TouchableOpacity
      style={[viewStyle, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton;
