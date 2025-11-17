import { Platform, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import AppView from './AppView';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showTopInset?: boolean;
  ignoreBottomInset?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, style, showTopInset = false, ignoreBottomInset }) => {

  const edges: Edge[] = [
    ...(showTopInset ? ['top'] : []),
    'left',
    'right',
    ...(ignoreBottomInset ? [] : ['bottom']),
  ];


  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}
      edges={edges}
    >
      <AppView flex={1} backgroundColor={'#fff'} style={style}>
        {children}
      </AppView>
    </SafeAreaView>
  );
};

export default Container;
