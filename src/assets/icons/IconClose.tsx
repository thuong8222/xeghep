import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Rect, Path } from 'react-native-svg';
export default function IconClose({size=24, color='#424242'}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" >
<Path d="M17 7L7 17M7 7L17 17" stroke={color}stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</Svg>


  )
}
