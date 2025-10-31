import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Rect, Path } from 'react-native-svg';
export default function IconPlus({size=32, color='#ffffff'}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" >
    <Path d="M16.0001 6.66663V25.3333M6.66675 16H25.3334" stroke={color} stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
    </Svg>
  

  )
}
