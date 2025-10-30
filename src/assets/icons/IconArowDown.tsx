import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Rect, Path } from 'react-native-svg';

export default function IconArowDown({ size = 20, color = '#424242' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" >
      <Path d="M5 7.5L10 12.5L15 7.5" stroke={color} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>


  )
}

const styles = StyleSheet.create({})