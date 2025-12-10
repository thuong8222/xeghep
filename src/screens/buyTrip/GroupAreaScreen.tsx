import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

import AppView from '../../components/common/AppView';
import { scale } from '../../utils/Helper';
import AppText from '../../components/common/AppText';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import AppButton from '../../components/common/AppButton';
import { BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import IconSort from '../../assets/icons/IconSort';
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip';

import { useAreaApi } from '../../redux/hooks/useAreaApi';
import { getNameByCode } from '../../utils/province';
import Container from '../../components/common/Container';

type GroupAreaNavProp = NativeStackNavigationProp<BuyTripStackParamList, "BuyTrip">;

interface Props {
  navigation: GroupAreaNavProp;
}
export default function GroupAreaScreen({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewList, setIsViewList] = useState(true);
  const { groups, loading, error, getAreas, clear } = useAreaApi();
  const [refreshing, setRefreshing] = useState(false);

  // Lấy danh sách khi mount
  useEffect(() => {
    fetchGroups();

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

    </AppView>
  )

  React.useEffect(() => {

    navigation.setOptions({
      headerTitle: () => (
        <AppView justifyContent={'center'} alignItems={'center'}>
          <AppText fontWeight={700}>{'Nhóm khu vực'}</AppText>
         
        </AppView>
      ),
      // headerRight: HeaderRightButton,
    });
  }, [navigation]);


  const gotoDetailArea = (props) => {

    navigation.navigate('BuyTrip', { nameGroup: props.name + ' - ' + getNameByCode(props.province_code), countMember: props.members_count || 0, id_area: props.id ,isJoin: props.is_member})
  }
  const renderItem_groupArea = ({ item, index }) => {
    return (<>
      <Area data={item} gotoDetailAreaPress={() => gotoDetailArea(item)} />
    </>
    )
  }
  return (
    <Container loading={loading} >
      <FlatList
        data={groups}
        renderItem={renderItem_groupArea}
        numColumns={1} // 1 cột cho list, 2 cột cho grid
        ItemSeparatorComponent={<AppView height={1} backgroundColor={ColorsGlobal.borderColor} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && <AppView alignItems='center'><AppText>Không có khu vực nào</AppText></AppView>
        }
      />
      <ModalBuyTrip visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} />

    </Container>
  )
}
const Area = (props) => {
  const detailArea = () => {
    props.gotoDetailAreaPress(props.data)
  }
  const isJoinArea = props.data?.is_member
  return (
    <AppButton onPress={detailArea} gap={8} paddingVertical={16} paddingLeft={12} flex={1} row opacity={isJoinArea ? 1 : .5}>
      <AppView height={45} width={45} radius={9999} backgroundColor={ColorsGlobal.backgroundLight} alignItems='center' justifyContent='center' padding={4} >
        <AppText fontSize={scale(18)} lineHeight={scale(26)} fontWeight={700} textAlign='center'>{props.data.members_count > 99 ? '99+' : props.data.members_count}</AppText>
      </AppView>
      <AppView >
        <AppText color={props.data.is_read ? ColorsGlobal.textLight : ColorsGlobal.main} fontSize={16} fontWeight={700}>{props.data.name}</AppText>
        <AppText color={props.data.is_read ? ColorsGlobal.textLight : ColorsGlobal.main} fontSize={12}>{'Khu vực ' + getNameByCode(props.data.province_code)}</AppText>
      </AppView>
    </AppButton>
  )
}