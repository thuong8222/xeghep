import React from 'react';
import { View, ViewStyle } from 'react-native';

import { BaseViewProps } from '../base/types/baseViewProps';
import { scale } from '../../utils/Helper';

const AppView: React.FC<BaseViewProps> = ({
  justifyContent,
  alignItems,
  borderTopRightRadius,
  borderBottomLeftRadius,
  zIndex,
  backgroundColor,
  paddingVertical,
  paddingHorizontal,
  paddingRight,
  paddingBottom,
  marginTop,
  marginHorizontal,
  paddingLeft,
  marginBottom,
  height,
  width,
  maxHeight,
  minHeight,
  radius,
  flex,
  paddingTop,
  padding,
  margin,
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
  style,
  children,
  row,
  position,
  flexWrap,
  top,
  bottom,
  left,
  right,
  alignSelf,
}) => {
  const viewStyle: ViewStyle = {
    justifyContent,
    alignItems,
    backgroundColor,
    zIndex,

    // ✅ Scale các giá trị khoảng cách & kích thước
    paddingRight: paddingRight ? scale(Number(paddingRight)) : undefined,
    paddingBottom: paddingBottom ? scale(Number(paddingBottom)) : undefined,
    marginTop: marginTop ? scale(Number(marginTop)) : undefined,
    marginHorizontal: marginHorizontal ? scale(Number(marginHorizontal)) : undefined,
    paddingLeft: paddingLeft ? scale(Number(paddingLeft)) : undefined,
    marginBottom: marginBottom ? scale(Number(marginBottom)) : undefined,
    height: typeof height === 'number'  ? scale(Number(height)) : height,
    width: typeof width === 'number' ? scale(width) : width,
    maxHeight: typeof maxHeight === 'number' ? scale(maxHeight) : maxHeight,
    minHeight: typeof minHeight === 'number' ? scale(minHeight) : minHeight,
    padding: padding ? scale(Number(padding)) : undefined,
    paddingVertical: paddingVertical ? scale(paddingVertical) : undefined,
    paddingHorizontal: paddingHorizontal ? scale(Number(paddingHorizontal)) : undefined,
    margin: margin ? scale(Number(margin)) : undefined,
    paddingTop: paddingTop ? scale(Number(paddingTop)) : undefined,
    borderRadius: radius ? scale(Number(radius)) : undefined,
    borderTopEndRadius: borderTopEndRadius ? scale(Number(borderTopEndRadius)) : undefined,
    borderTopLeftRadius: borderTopLeftRadius ? scale(Number(borderTopLeftRadius)) : undefined,
    borderTopRightRadius ,
    borderBottomLeftRadius,
    gap: gap ? scale(Number(gap)) : undefined,

    // ✅ Scale các border
    borderWidth: borderWidth ? scale(Number(borderWidth)) : undefined,
    borderTopWidth: borderTopWidth ? scale(Number(borderTopWidth)) : undefined,
    borderBottomWidth: borderBottomWidth ? scale(Number(borderBottomWidth)) : undefined,
    borderLeftWidth: borderLeftWidth ? scale(Number(borderLeftWidth)) : undefined,
    borderRightWidth: borderRightWidth ? scale(Number(borderRightWidth)) : undefined,

    borderColor,
    borderTopColor,
    borderBottomColor,
    borderLeftColor,
    borderRightColor,

    flexWrap,
    flex,

    // ✅ Scale vị trí tuyệt đối
    top: top ? scale(Number(top)) : undefined,
    bottom: bottom ? scale(Number(bottom)) : undefined,
    left: left ? scale(Number(left)) : undefined,
    right: right ? scale(Number(right)) : undefined,

    position,
    alignSelf,

    ...(row && { flexDirection: 'row' }),
  };

  return <View style={[viewStyle, style]}>{children}</View>;
};

export default AppView;
