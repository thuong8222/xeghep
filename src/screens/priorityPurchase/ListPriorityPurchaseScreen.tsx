import { FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/common/Container';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconPlus from '../../assets/icons/IconPlus';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AppView from '../../components/common/AppView';
import IconPencil from '../../assets/icons/iconPencil';
import IconArrowDown from '../../assets/icons/IconArowDown';
import IconClock from '../../assets/icons/IconClock';
import IconLocation from '../../assets/icons/iconLocation';
import IconMinus from '../../assets/icons/IconMinus';
import { cancelAutoBuyTrip, fetchAutoBuyList } from '../../redux/slices/requestAutoBuyTrip';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CONSTANT, NumberFormat } from '../../utils/Helper';
import IconClose from '../../assets/icons/IconClose';

export default function ListPriorityPurchaseScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useAppDispatch();
    const { list, loading, lastUpdate } = useSelector((state) => state.requestAutoBuyTrip);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchAutoBuyList());
    }, []);
    useFocusEffect(
        useCallback(() => {
            if (route?.params?.refresh) {
                console.log('🔄 Refresh auto buy list');
                fetchAutoBuyList(); 
            }
        }, [route?.params?.refresh])
    );
    
    useEffect(() => {
        if (lastUpdate) {
            console.log('📋 Auto buy list updated:', lastUpdate);
        }
    }, [lastUpdate]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchAutoBuyList());
        setRefreshing(false);
    };

    const addNewTripAuto = () => {
        navigation.navigate("PriorityPurchaseScreen"); 
    };

    const goToDetail = (item) => {
        navigation.navigate("AutoBuyDetailScreen", { id: item.id });
    };

    const goToEdit = (item) => {
        
        if (item.status !== 0) {
            Alert.alert('Không thể sửa yêu cầu đã hoàn thành hoặc đã hủy');
            return;
        }
        console.log('goToEdit: item ', item)
        navigation.navigate("PriorityPurchaseScreen", {
            id: item.id,
            editData: item
        });
    };

    
    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0:
                return {
                    text: '⏳ Đang chờ',
                    color: ColorsGlobal.warning,
                    bgColor: '#FFF3CD'
                };
            case 1:
                return {
                    text: '✅ Đã mua',
                    color: ColorsGlobal.success,
                    bgColor: '#D1F2EB'
                };
            case 2:
                return {
                    text: '❌ Đã hủy',
                    color: ColorsGlobal.error,
                    bgColor: '#F8D7DA'
                };
            default:
                return {
                    text: '❓ Không xác định',
                    color: ColorsGlobal.textLight,
                    bgColor: '#E9ECEF'
                };
        }
    };
    const confirmCancel = (item) => {
        Alert.alert(
          'Huỷ yêu cầu',
          'Bạn có chắc muốn huỷ yêu cầu mua chuyến này?',
          [
            { text: 'Không', style: 'cancel' },
            {
              text: 'Huỷ',
              style: 'destructive',
              onPress: async () => {
                try {
                  await dispatch(cancelAutoBuyTrip({ id: item.id })).unwrap();
      
                  
                  Alert.alert('Thành công', 'Đã huỷ yêu cầu mua chuyến này');
                } catch (err: any) {
                  
                  Alert.alert(
                    'Thất bại',
                    err?.message || 'Huỷ yêu cầu không thành công, vui lòng thử lại',
                  );
                }
              },
            },
          ],
        );
      };
      

    const renderItem = ({ item }) => {
        const status = CONSTANT.STATUS_STYLE[item.status] || CONSTANT.STATUS_STYLE[0];

        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => goToDetail(item)}>
                <AppView
                    backgroundColor="#FFF"
                    radius={12}
                    padding={12}
                    style={{
                        borderWidth: 1,
                        borderColor: '#EEE',
                        opacity: item.status === 2 ? 0.6 : 1,
                    }}
                >
           
                    <AppView row justifyContent="space-between" alignItems="center">
                        <AppView
                            backgroundColor={status.bg}
                            paddingHorizontal={10}
                            paddingVertical={4}
                            radius={99}
                        >
                            <AppText fontSize={12} color={status.color} bold>
                                {status.text}
                            </AppText>
                        </AppView>

                        {item.status === 0 && (
                            <AppView row gap={10} alignItems='center'>
                                <AppButton onPress={() => goToEdit(item)}>
                                    <IconPencil size={18} color={ColorsGlobal.main} />
                                </AppButton>
                                <AppButton onPress={() => confirmCancel(item)} backgroundColor={ColorsGlobal.borderColor} radius={99}>
                                    <IconClose size={28} color="#C0392B" />
                                </AppButton>
                            </AppView>
                        )}
                    </AppView>

                    {/* ===== BODY: LOCATION ===== */}
                    <AppView marginTop={10} gap={6}>
                        <AppView row gap={6}>
                            <IconLocation />
                            <AppText fontSize={14} bold>
                                {Array.isArray(item.pickup_location)
                                    ? item.pickup_location.join(', ')
                                    : item.pickup_location}
                            </AppText>
                        </AppView>

                        <AppView row gap={6} paddingLeft={4}>
                            <IconArrowDown rotate={-90} />
                            <AppText fontSize={14}>
                                {Array.isArray(item.dropoff_location)
                                    ? item.dropoff_location.join(', ')
                                    : item.dropoff_location}
                            </AppText>
                        </AppView>
                    </AppView>

      
                    <AppView
                        row
                        justifyContent="space-between"
                        alignItems="center"
                        marginTop={12}
                    >
                        <AppText fontSize={13} color={ColorsGlobal.textLight}>
                            ⏰ {moment(item.time_receive_start).format('HH:mm DD/MM')} — {' '}
                            {moment(item.time_receive_end).format('HH:mm DD/MM')}
                        </AppText>

                        <AppText bold color={ColorsGlobal.main}>
                            [{item.maximum_point} điểm — {NumberFormat(parseInt(item.desired_price))}K]
                        </AppText>
                    </AppView>

                    {item.status === 1 && item.trip && (
                        <AppView
                            backgroundColor="#F0FDF4"
                            padding={8}
                            radius={8}
                            marginTop={10}
                        >
                            <AppText fontSize={12} color="#27AE60">
                                ✅ Đã mua: {item.trip.place_start} → {item.trip.place_end}
                            </AppText>
                            <AppText fontSize={11} color={ColorsGlobal.textLight}>
                                {item.trip.point} điểm • {NumberFormat(item.trip.price_sell)}K
                            </AppText>
                        </AppView>
                    )}
                </AppView>
            </TouchableOpacity>
        );
    };


    return (
        <Container style={{ position: 'relative' }} padding={0} ignoreBottomInset>
            <AppText textAlign='center' color={ColorsGlobal.main2} fontWeight={600}>
                [Danh sách yêu cầu mua chuyến tự động]
            </AppText>

            <AppView flex={1} paddingTop={20} gap={16}>
                {loading && !refreshing && (
                    <AppText textAlign="center">Đang tải...</AppText>
                )}

                <FlatList
                    data={list}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ gap: 16, padding: 16 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[ColorsGlobal.main]}
                        />
                    }
                    ListEmptyComponent={
                        !loading && (
                            <AppView padding={32} alignItems="center">
                                <AppText
                                    fontSize={16}
                                    color={ColorsGlobal.textLight}
                                    textAlign="center"
                                >
                                    Chưa có yêu cầu nào.{'\n'}
                                    Nhấn nút + để tạo mới.
                                </AppText>
                            </AppView>
                        )
                    }
                />
            </AppView>

         
            <AppButton
                onPress={addNewTripAuto}
                position={'absolute'}
                right={36}
                bottom={34}
                width={48}
                height={48}
                radius={999}
                backgroundColor={ColorsGlobal.main}
                justifyContent='center'
                alignItems='center'
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                <IconPlus size={20} />
            </AppButton>
        </Container>
    );
}