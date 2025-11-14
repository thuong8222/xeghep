import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

import AppView from '../../components/common/AppView';
import { scale } from '../../utils/Helper';
import AppText from '../../components/common/AppText';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import AppButton from '../../components/common/AppButton';
import { BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { groupsArea } from '../../dataDemoJson';
import IconSort from '../../assets/icons/IconSort';
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip';
import IconArrowDown from '../../assets/icons/IconArowDown';
import IconList from '../../assets/icons/IconList';
import IconGrid from '../../assets/icons/IconGrid';
import { useAreaApi } from '../../redux/hooks/useAreaApi';

type GroupAreaNavProp = NativeStackNavigationProp<BuyTripStackParamList, "BuyTrip">;

interface Props {
  navigation: GroupAreaNavProp;
}
export default function GroupAreaScreen({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewList, setIsViewList] = useState(true);
  const { groups, loading, error, getAreas, clear } = useAreaApi();
  const [refreshing, setRefreshing] = useState(false);
  console.log('groups: ', groups)
  // Lấy danh sách khi mount
  useEffect(() => {
    fetchGroups();
    return () => {
      clear(); // reset error/success khi unmount
    };
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      await getAreas();
    } catch (err) {
      console.log('Lỗi fetch groups:', err);
    }
  }, [getAreas]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getAreas();
    } finally {
      setRefreshing(false);
    }
  }, [getAreas]);

  const HeaderRightButton = () => (
    <AppView row>
      <AppButton onPress={() => setIsModalVisible(true)} paddingLeft={30}>
        <IconSort />
      </AppButton>
      <AppButton onPress={toggleView} paddingLeft={8}>
        {isViewList ? <IconList /> : <IconGrid />}

      </AppButton>
    </AppView>
  )
  const toggleView = () => {
    setIsViewList(!isViewList)
  }
  React.useEffect(() => {

    navigation.setOptions({
      headerTitle: () => (
        <AppView justifyContent={'center'} alignItems={'center'}>
          <AppText fontWeight={700}>{'Nhóm khu vực'}</AppText>
          <AppText fontSize={12} lineHeight={16} color={ColorsGlobal.textLight}>{'300 thành viên'}</AppText>
        </AppView>
      ),
      headerRight: HeaderRightButton,
    });
  }, [navigation, isViewList]);


  const gotoDetailArea = (props) => {
    console.log('props:', props)
    navigation.navigate('BuyTrip', { nameGroup: props.name + ' - ' + props.province_code, countMember: props.count_member || 0, id_area: props.id })
  }
  const renderItem_groupArea = ({ item, index }) => {
    return (<>

      <Area data={item} gotoDetailAreaPress={() => gotoDetailArea(item)} isView={isViewList} />
    </>

    )
  }
  return (
    <AppView backgroundColor='#fff' flex={1} padding={16}>
      <FlatList
        data={groups}
        renderItem={renderItem_groupArea}
        horizontal={false} // luôn false khi List/Grid dùng numColumns
        numColumns={isViewList ? 1 : 3} // 1 cột cho list, 2 cột cho grid
        key={isViewList ? 'list' : 'grid'} // quan trọng: bắt FlatList re-render khi đổi layout
        ItemSeparatorComponent={isViewList ? () => <AppView height={1} backgroundColor={ColorsGlobal.borderColor} /> : undefined}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && <AppView center><AppText>Không có khu vực nào</AppText></AppView>
        }
      />
      <ModalBuyTrip visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} />
    </AppView>
  )
}
const Area = (props) => {
  const detailArea = () => {
    props.gotoDetailAreaPress(props.data)
  }
  console.log('props is view: ', props.isView);
  const isList = props.isView
  return (
    <AppButton onPress={detailArea} gap={8} row={isList} alignItems='center' paddingVertical={16} paddingLeft={12} flex={1} >
      <AppView height={!isList ? 60 : 45} width={!isList ? 60 : 45} radius={9999} backgroundColor={ColorsGlobal.backgroundLight} alignItems='center' justifyContent='center' padding={4} >
        <AppText fontSize={scale(18)} lineHeight={scale(26)} fontWeight={700} textAlign='center'>{props.data.count_trips > 99 ? '99+' : props.data.count_trips}</AppText>
      </AppView>
      <AppView alignItems={isList ? 'flex-start' : 'center'}>
        <AppText color={props.data.is_read ? ColorsGlobal.textLight : ColorsGlobal.main} fontSize={16} fontWeight={700}>{props.data.name}</AppText>
        <AppText color={props.data.is_read ? ColorsGlobal.textLight : ColorsGlobal.main} fontSize={12}>{'Khu vực ' + props.data.province_code}</AppText>
      </AppView>
    </AppButton>
  )
}