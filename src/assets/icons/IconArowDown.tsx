import { StyleSheet, View } from 'react-native';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function IconArrowDown({ size = 20, color = '#424242', rotate = 0 }) {
  return (
    <View style={{ transform: [{ rotate: `${rotate}deg` }] }}>
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Path
          d="M5 7.5L10 12.5L15 7.5"
          stroke={color}
          strokeWidth={1.66667}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({});
