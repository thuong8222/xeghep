import React from 'react';
import { Text, TextStyle, TextProps, Platform } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Typography } from '../base/types/typography';

import { ColorsGlobal } from '../base/Colors/ColorsGlobal';



export  interface CustomTextProps extends TextProps {
  color?: string;
  bold?: boolean;
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
  alignSelf?: TextStyle['alignSelf'];
  lineHeight?: number;
  paddingVertical?: TextStyle['paddingVertical'];
  borderBottomWidth?: TextStyle['borderBottomWidth']
  borderBottomColor?: TextStyle['borderBottomColor']
}

const AppText: React.FC<CustomTextProps> = ({
  color = ColorsGlobal.textDark,
  fontWeight,
  fontSize = 16,
  lineHeight=24,
  textAlign,fontStyle, backgroundColor,
  title,borderBottomWidth,borderBottomColor,paddingVertical,
  style,  variant,
  children, bold,
  textDecorationLine,
  ...restProps
}) => {
  const textStyles: TextStyle = {
  
    color, textDecorationLine,
    fontWeight: fontWeight,
    fontSize: fontSize ,
    textAlign, backgroundColor,
    flexWrap: 'wrap',
    ...(bold && { fontWeight: '700' }),
    fontStyle,

    
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
