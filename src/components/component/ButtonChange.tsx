import React from 'react';
import AppButton from '../common/AppButton';
import { scale } from '../../utils/Helper';

interface ButtonChangeProps {
  onPress: () => void;
  icon: React.ReactNode;
}

const ButtonChange: React.FC<ButtonChangeProps> = ({ onPress, icon }) => {
  return (
    <AppButton
      onPress={onPress}
  
      height={scale(35)}
      width={scale(35)}
      justifyContent='center'
      alignItems='center'
      backgroundColor="#00000020"
      radius={999}
    >
      {icon}
    </AppButton>
  );
};

export default ButtonChange;
