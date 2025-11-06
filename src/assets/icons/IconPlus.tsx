import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Rect, Path } from 'react-native-svg';
export default function IconPlus({ size = 14, color = '#ffffff' }) {
  return (

    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" >
      <Path d="M6.66683 0.833252V12.4999M0.833496 6.66659H12.5002" stroke={color} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>


  )
}
