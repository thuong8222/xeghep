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
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { groupsArea } from '../../dataDemoJson';
import IconSort from '../../assets/icons/IconSort';
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip';

type GroupAreaNavProp = NativeStackNavigationProp<BuyTripStackParamList, "BuyTrip">;

interface Props {
  navigation: GroupAreaNavProp;
}



export default function GroupAreaScreen({ navigation }: Props) {
   const [isModalVisible, setIsModalVisible] = useState(false)
  const HeaderRightButton = () => (
    <AppView row>
    <AppButton onPress={() => setIsModalVisible(true)}>
      <IconSort />
    </AppButton>
    
    </AppView>
  )
  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerTitle: () => (
        <AppView justifyContent={'center'} alignItems={'center'}>
          <AppText fontWeight={700}>{'Nhóm khu vực'}</AppText>
          <AppText fontSize={12} lineHeight={16} color={ColorsGlobal.textLight}>{'300 thành viên'}</AppText>
        </AppView>
      ),
      headerRight: HeaderRightButton, 
    });
  }, [navigation]);


  const gotoDetailArea = (props) => {

  navigation.navigate('BuyTrip', {nameGroup: props.group_area_name + ' - '+ props.type_car_name, countMember: props.count_trips})
  }
  const renderItem_groupArea = ({ item, index }) => {
    return (
      <Area data={item} gotoDetailAreaPress={()=>gotoDetailArea(item)} />
    )
  }
  return (
    <AppView backgroundColor='#fff' flex={1} padding={16}>
      <FlatList data={groupsArea} renderItem={renderItem_groupArea}

        ItemSeparatorComponent={() => <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />}
      />
      <ModalBuyTrip visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} />
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
        <AppText fontSize={18} lineHeight={26} fontWeight={700}>{props.data.count_trips > 99 ? '99+' : props.data.count_trips}</AppText>
      </AppView>
      <AppView>
        <AppText color={props.data.is_read ? ColorsGlobal.textLight : ColorsGlobal.main} fontSize={16} fontWeight={700}>{props.data.type_car_name}</AppText>
        <AppText color={props.data.is_read ? ColorsGlobal.textLight : ColorsGlobal.main} fontSize={12}>{'Khu vực ' + props.data.group_area_name}</AppText>
      </AppView>
    </AppButton>
  )
}
const styles = StyleSheet.create({})