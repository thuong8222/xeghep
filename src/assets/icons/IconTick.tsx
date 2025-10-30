import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Rect, Path } from 'react-native-svg';
export default function IconTick({size=20, color='#424242'}) {
  return (
    <Svg width={size} height="20" viewBox="0 0 20 20" fill="none" >
<Path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke={color} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</Svg>

  )
}

const styles = StyleSheet.create({})