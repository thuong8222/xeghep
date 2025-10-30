import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const ArrowRight = ({ size = 28, color = '#01A546' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="#FBFBFB" />
      <Rect
        x="0.5"
        y="0.5"
        width="27"
        height="27"
        rx="13.5"
        stroke="#E4E4E4"
      />
      <Path
        d="M8.75 14H19.25M19.25 14L14 8.75M19.25 14L14 19.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ArrowRight;
