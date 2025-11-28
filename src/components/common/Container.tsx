import { ActivityIndicator, Platform, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import AppView from './AppView';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { ColorsGlobal } from '../base/Colors/ColorsGlobal';

interface ContainerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showTopInset?: boolean;
  ignoreBottomInset?: boolean;
  loading?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, style, showTopInset = false, ignoreBottomInset ,loading = false}) => {

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
         {loading && (
                <ActivityIndicator size="large" color={ColorsGlobal.main} />
              )}
        {children}
      </AppView>
    </SafeAreaView>
  );
};

export default Container;
