import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AppInput from '../../components/common/AppInput'
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import AppView from '../../components/common/AppView';
import { scale } from '../../utils/Helper';
import AppText from '../../components/common/AppText';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import AppButton from '../../components/common/AppButton';

export default function GroupAreaScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const groupsArea = [
    { id: 1, name: 'tiii', area: 'Hai duong', sumNews: 34 },
    { id: 2, name: 'tiii', area: 'Hai duong', sumNews: 34 },
    { id: 3, name: 'tiii', area: 'Hai duong', sumNews: 34 },

  ]
  const renderItem_groubArea = ({ item, index }) => {
    return (
      <AppButton gap={8} row width={400} alignItems='center' paddingVertical={16} paddingLeft={12}>
        <AppView height={scale(42)} width={scale(42)} radius={9999} backgroundColor={ColorsGlobal.backgroundLight} alignItems='center' justifyContent='center'>
          <AppText fontSize={18} lineHeight={26} fontWeight={700}>{item.sumNews}</AppText>
        </AppView>
        <AppView>
          <AppText color={ColorsGlobal.main} fontSize={16} fontWeight={700}>{item.name}</AppText>
          <AppText color={ColorsGlobal.main} fontSize={12}>{item.area}</AppText>
        </AppView>
      </AppButton>
    )
  }
  return (
    <AppView backgroundColor='#fff'>
      <FlatList data={groupsArea} renderItem={renderItem_groubArea}
      keyExtractor={(_,index)=>toString()}
      ItemSeparatorComponent={()=><AppView height={1} backgroundColor={} />}
       />
    </AppView>

  )
}

const styles = StyleSheet.create({})