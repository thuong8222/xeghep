
import React from "react";
import Svg, { Path } from "react-native-svg";
interface IconSearchProps {
  color?: string;
  size?: number;
}

const IconSearch: React.FC<IconSearchProps> = ({ color = "#454545", size = 20 }) => {
  return (
    <Svg
    
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <Path
        d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconSearch;
