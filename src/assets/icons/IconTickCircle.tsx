import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg'

export default function IconTickCircle({color='#F26000', size=20}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill={color}/>
    <Path d="M15.3334 6L8.00008 13.3333L4.66675 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </Svg>
    
  )
}

