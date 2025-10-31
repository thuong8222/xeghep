import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AppInput from '../../components/common/AppInput'
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import AppView from '../../components/common/AppView';
import { scale } from '../../utils/Helper';
import AppText from '../../components/common/AppText';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import AppButton from '../../components/common/AppButton';
import { BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { groupsArea } from '../../dataDemoJson';

type GroupAreaNavProp = createNativeStackNavigator<BuyTripStackParamList, "BuyTrip">;

interface Props {
  navigation: GroupAreaNavProp;
}



export default function GroupAreaScreen({ navigation }: Props) {


  const gotoDetailArea = () => {
    navigation.navigate('BuyTrip')
  }
  const renderItem_groupArea = ({ item, index }) => {
    return (
      <Area data={item} gotoDetailAreaPress={gotoDetailArea} />
    )
  }
  return (
    <AppView backgroundColor='#fff' flex={1} padding={16}>
      <FlatList data={groupsArea} renderItem={renderItem_groupArea}

        ItemSeparatorComponent={() => <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />}
      />
    </AppView>

  )
}
const Area = (props) => {
  const detailArea = () => {
    props.gotoDetailAreaPress(props.data)
  }
  return (
    <AppButton onPress={detailArea} gap={8} row width={400} alignItems='center' paddingVertical={16} paddingLeft={12}>
      <AppView height={scale(42)} width={scale(42)} radius={9999} backgroundColor={ColorsGlobal.backgroundLight} alignItems='center' justifyContent='center'>
        <AppText fontSize={18} lineHeight={26} fontWeight={700}>{props.data.count>99 ? '99+': props.data.count}</AppText>
      </AppView>
      <AppView>
        <AppText color={props.data.is_read ? ColorsGlobal.textLight : ColorsGlobal.main} fontSize={16} fontWeight={700}>{props.data.type_car}</AppText>
        <AppText color={props.data.is_read ? ColorsGlobal.textLight : ColorsGlobal.main} fontSize={12}>{'Khu vực ' + props.data.area}</AppText>
      </AppView>
    </AppButton>
  )
}
const styles = StyleSheet.create({})