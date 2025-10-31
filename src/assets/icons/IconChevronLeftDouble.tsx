
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconChevronLeftDoubleProps {
  color?: string;
  size?: number;
  rotate?: number; // góc xoay (độ)
}

export default function IconChevronLeftDouble({
  color = '#F26000',
  size = 18,
  rotate = 0,
}: IconChevronLeftDoubleProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={{
        transform: [{ rotate: `${rotate}deg` }],
      }}
    >
      <Path
        d="M13.5 12.75L9.75 9L13.5 5.25M8.25 12.75L4.5 9L8.25 5.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
