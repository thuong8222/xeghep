import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from '../../components/common/AppText';
import AppView from '../../components/common/AppView';

interface Props {
  route: {
    params: {
      nameScreen: string;
    };
  };
}

export default function BlankScreen({ route }: Props) {
  const { nameScreen } = route.params;

  return (
    <AppView style={styles.container}>
      <AppText bold >{'Nội dung '+nameScreen+'...'}</AppText>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  padding:16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
});
