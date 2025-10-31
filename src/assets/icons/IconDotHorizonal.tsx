import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg'

export default function IconDotHorizonal({size=32, color='#5A5A5F'}) {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none" >
    <Path d="M16.0002 17.3334C16.7365 17.3334 17.3335 16.7365 17.3335 16.0001C17.3335 15.2637 16.7365 14.6667 16.0002 14.6667C15.2638 14.6667 14.6668 15.2637 14.6668 16.0001C14.6668 16.7365 15.2638 17.3334 16.0002 17.3334Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <Path d="M25.3335 17.3334C26.0699 17.3334 26.6668 16.7365 26.6668 16.0001C26.6668 15.2637 26.0699 14.6667 25.3335 14.6667C24.5971 14.6667 24.0002 15.2637 24.0002 16.0001C24.0002 16.7365 24.5971 17.3334 25.3335 17.3334Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <Path d="M6.66683 17.3334C7.40321 17.3334 8.00016 16.7365 8.00016 16.0001C8.00016 15.2637 7.40321 14.6667 6.66683 14.6667C5.93045 14.6667 5.3335 15.2637 5.3335 16.0001C5.3335 16.7365 5.93045 17.3334 6.66683 17.3334Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </Svg>
    
  )
}