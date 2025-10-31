import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg'

export default function IconNoneTickCircle({color='#E0E0E5', size=20}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" >
    <Path d="M10 0.5C15.2467 0.5 19.5 4.7533 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.7533 19.5 0.5 15.2467 0.5 10C0.5 4.7533 4.7533 0.5 10 0.5Z" fill="white"/>
    <Path d="M10 0.5C15.2467 0.5 19.5 4.7533 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.7533 19.5 0.5 15.2467 0.5 10C0.5 4.7533 4.7533 0.5 10 0.5Z" stroke={color}/>
    </Svg>
    
    
  )
}

