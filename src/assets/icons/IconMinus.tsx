import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg'

export default function IconMinus({ size = 20, color = '#949494' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" >
      <Path d="M4.1665 10H15.8332" stroke={color} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>


  )
}

const styles = StyleSheet.create({})