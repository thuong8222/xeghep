import { Platform, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import AppView from './AppView';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showTopInset?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, style, showTopInset = false }) => {

  const edges: Edge[] = showTopInset ? ['top', 'left', 'right'] : ['left', 'right', 'bottom'];
  

  return (
    <SafeAreaView
      style={[{ flex: 1,backgroundColor:'#fff' }, style]}
      edges={edges}
    >
      <AppView flex={1} backgroundColor={'#fff'} >
        {children}
      </AppView>
    </SafeAreaView>
  );
};

export default Container;
