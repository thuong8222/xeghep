import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { CustomButtonProps } from '../base/types/baseViewProps';
import { scale } from '../../utils/Helper';

const AppButton: React.FC<CustomButtonProps> = ({
  justifyContent,
  alignItems,
  backgroundColor,
  height,
  minHeight,
  width,
  padding,
  paddingRight,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginLeft,
  paddingLeft,
  marginRight,
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
  right,
  activeOpacity,
  row,
  position,
  style,
  children,
  opacity,
  onPress,
  disabled = false,
}) => {
  const viewStyle: ViewStyle = {
    justifyContent,
    alignItems,
    backgroundColor,
    height: typeof height === 'number' ? scale(height) : height,
    width: typeof width === 'number' ? scale(width) : width,
    minHeight,
    padding: typeof padding === 'number' ? scale(padding) : padding,
    paddingRight: typeof paddingRight === 'number' ? scale(paddingRight) : paddingRight,
    paddingVertical: typeof paddingVertical === 'number' ? scale(paddingVertical) : paddingVertical,
    paddingHorizontal: typeof paddingHorizontal === 'number' ? scale(paddingHorizontal) : paddingHorizontal,
    margin: typeof margin === 'number' ? scale(margin) : margin,
    marginLeft: typeof marginLeft === 'number' ? scale(marginLeft) : marginLeft,
    marginRight: typeof marginRight === 'number' ? scale(marginRight) : marginRight,
    paddingLeft: typeof paddingLeft === 'number' ? scale(paddingLeft) : paddingLeft,
    borderRadius: radius,
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
    flexWrap,
    opacity: disabled ? 0.5 : opacity,
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
      style={[viewStyle, style]}  
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity || 0.7}  
    >
      {children}
    </TouchableOpacity>
  );
};

export default AppButton;
