import React from 'react';
import { Text, TextStyle, TextProps, Platform } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Typography } from '../base/types/typography';



export  interface CustomTextProps extends TextProps {
  color?: string;
  fontWeight?: TextStyle['fontWeight'];
  fontSize?: TextStyle['fontSize'];
  fontStyle?: TextStyle['fontStyle'];
  textAlign?: TextStyle['textAlign'];
  textDecorationLine?: TextStyle['textDecorationLine']
  title?: string | number;
  style?: TextStyle;
  children?: React.ReactNode;
  variant?: keyof typeof Typography; 
  backgroundColor?: TextStyle['backgroundColor'];
  alignSelf?: TextStyle['alignSelf']
}

const AppText: React.FC<CustomTextProps> = ({
  color = '#000',
  fontWeight,
  fontSize = 14,
  textAlign,fontStyle, backgroundColor,
  title,
  style,  variant,
  children,
  textDecorationLine,
  ...restProps
}) => {
  const baseStyle: TextStyle = variant ? Typography[variant] : {};

  const textStyles: TextStyle = {
    ...baseStyle,
    color, textDecorationLine,
    fontWeight: fontWeight ?? baseStyle.fontWeight,
    fontSize: fontSize ? scale(fontSize) : baseStyle.fontSize,
    textAlign, backgroundColor,
    flexWrap: 'wrap',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  };

  return (
    <Text
      style={[textStyles, style]}
      numberOfLines={restProps.numberOfLines}
      ellipsizeMode={restProps.ellipsizeMode}
      {...restProps}
    >
       {children ?? (title ? title : '')}
    </Text>
  );
};

export default AppText;
