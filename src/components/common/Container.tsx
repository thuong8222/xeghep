import { ActivityIndicator, Platform, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import AppView from './AppView';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import { ViewBaseProps } from 'react-native/types_generated/Libraries/Components/View/ViewPropTypes';
import { scale } from '../../utils/Helper';

interface ContainerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showTopInset?: boolean;
  ignoreBottomInset?: boolean;
  loading?: boolean;
  padding?:ViewBaseProps;
  gap?:ViewBaseProps;
}

const Container: React.FC<ContainerProps> = ({ children, style, showTopInset = false, ignoreBottomInset ,loading = false, padding=16, gap}) => {

  const edges: Edge[] = [
    ...(showTopInset ? ['top'] : []),
    'left',
    'right',
    ...(ignoreBottomInset ? [] : ['bottom']),
  ];


  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff', padding: scale(padding), gap:scale(gap) }}
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
