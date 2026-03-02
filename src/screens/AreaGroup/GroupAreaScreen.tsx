import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import Container from '../../components/common/Container';
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip';

import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import { scale } from '../../utils/Helper';
import { BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs';
import { useAreaApi } from '../../redux/hooks/useAreaApi';
import { useAppContext } from '../../context/AppContext';
import Area from '../../components/component/Area';

type GroupAreaNavProp = NativeStackNavigationProp<
  BuyTripStackParamList,
  'BuyTrip'
>;

interface Props {
  navigation: GroupAreaNavProp;
}

export default function GroupAreaScreen({ navigation }: Props) {
  const { setCurrentArea } = useAppContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { groups, loading, getAreas } = useAreaApi();

  /**
   * Fetch data
   */
  const fetchGroups = useCallback(async () => {
    try {
      await getAreas();
    } catch (err) {
      console.log('Lỗi fetch groups:', err);
    }
  }, [getAreas]);

  /**
   * Khi focus màn hình
   */
  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [fetchGroups])
  );

  /**
   * Pull to refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getAreas();
    } finally {
      setRefreshing(false);
    }
  }, [getAreas]);

  /**
   * Navigate detail
   */
  const gotoDetailArea = useCallback(
    (area: any) => {
      if (!area?.is_member) return;

      setCurrentArea(area);

      navigation.navigate('BuyTrip', {
        nameGroup: area.name,
        countMember: area.members_count || 0,
        id_area: area.id,
        isJoin: area.is_member,
      });
    },
    [navigation, setCurrentArea]
  );

  /**
   * Render item
   */
  const renderItem = ({ item }: any) => (
    <Area
      data={item}
      gotoDetailAreaPress={() => gotoDetailArea(item)}
    />
  );

  return (
    <Container loading={loading}>
      <FlatList
        data={groups || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <AppView alignItems="center" padding={20}>
              <AppText>Không có khu vực nào</AppText>
            </AppView>
          ) : null
        }
      />

      <ModalBuyTrip
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      />
    </Container>
  );
}

/**
 * Area Item Component
 */
