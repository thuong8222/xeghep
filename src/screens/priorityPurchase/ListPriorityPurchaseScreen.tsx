import { FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/common/Container';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconPlus from '../../assets/icons/IconPlus';
import { useNavigation } from '@react-navigation/native';
import AppView from '../../components/common/AppView';
import IconPencil from '../../assets/icons/iconPencil';
import IconArrowDown from '../../assets/icons/IconArowDown';
import IconClock from '../../assets/icons/IconClock';
import IconLocation from '../../assets/icons/iconLocation';
import IconMinus from '../../assets/icons/IconMinus';
import { fetchAutoBuyList } from '../../redux/slices/requestAutoBuyTrip';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { NumberFormat } from '../../utils/Helper';

export default function ListPriorityPurchaseScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { list, loading, lastUpdate } = useSelector((state) => state.requestAutoBuyTrip);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchAutoBuyList());
    }, []);

    // ✅ Auto refresh khi có lastUpdate thay đổi
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
        navigation.navigate("PriorityPurchaseScreen"); // Tạo mới
    };

    const goToDetail = (item) => {
        navigation.navigate("AutoBuyDetailScreen", { id: item.id });
    };

    const goToEdit = (item) => {
        // Chỉ cho edit nếu status = 0 (đang chờ)
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

    // ✅ Hàm hiển thị status badge
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

    const renderItem = ({ item }) => {
        const statusBadge = getStatusBadge(item.status);

        return (
            <TouchableOpacity onPress={() => goToDetail(item)}>
                <AppView
                    row
                    backgroundColor={ColorsGlobal.backgroundLight}
                    padding={10}
                    radius={10}
                    width={'100%'}
                    style={{
                        opacity: item.status === 2 ? 0.6 : 1, // Mờ nếu đã hủy
                    }}
                >
                    <AppView flex={1} gap={6}>
                        {/* Status Badge */}
                        <AppView
                            backgroundColor={statusBadge.bgColor}
                            paddingHorizontal={8}
                            paddingVertical={4}
                            radius={4}
                            alignSelf="flex-start"
                        >
                            <AppText
                                fontSize={12}
                                color={statusBadge.color}
                                fontWeight={600}
                            >
                                {statusBadge.text}
                            </AppText>
                        </AppView>

                        {/* Địa điểm */}
                        <AppView justifyContent={'space-between'} gap={8}>
                            <AppView flex={1} row gap={3}>
                                <IconLocation />
                                <AppText fontSize={14} >
                                    {Array.isArray(item.pickup_location)
                                        ? item.pickup_location.join(", ")
                                        : item.pickup_location || "Chưa có địa điểm"}
                                </AppText>
                            </AppView>
                            <AppView flex={1} row  >
                                <AppView>
                                    <IconArrowDown rotate={-90} color={ColorsGlobal.main2} />
                                </AppView>
                                <AppView flex={1}>
                                    <AppText fontSize={14} >
                                        {Array.isArray(item.dropoff_location)
                                            ? item.dropoff_location.join(", ")
                                            : item.dropoff_location || "Chưa có địa điểm"}
                                    </AppText>
                                </AppView>

                            </AppView>
                        </AppView>

                        {/* Điểm & giá */}
                        <AppView row justifyContent="space-between" alignItems="center">
                            <AppView row alignItems="center">
                                <AppText fontSize={14}>Tối đa: </AppText>
                                <AppText color={ColorsGlobal.main} bold>
                                    {item.maximum_point || 0} điểm
                                </AppText>
                            </AppView>

                            <IconMinus color={ColorsGlobal.main2} />
                            <AppText color={ColorsGlobal.main2} bold>
                                {NumberFormat(parseInt(item.desired_price))}K
                            </AppText>
                        </AppView>

                        {/* Thời gian */}
                        <AppView row gap={4} alignItems='center'>
                            <IconClock />
                            <AppText fontSize={14} color={ColorsGlobal.textLight}>
                                {moment(item.time_receive_start).format('HH:mm, DD/MM/YYYY')}
                                {" - "}
                                {moment(item.time_receive_end).format('HH:mm, DD/MM/YYYY')}
                            </AppText>
                        </AppView>

                        {/* Hiển thị thông tin chuyến đã mua (nếu có) */}
                        {item.status === 1 && item.trip && (
                            <AppView
                                backgroundColor="#E8F5E9"
                                padding={8}
                                radius={6}
                                marginTop={4}
                            >
                                <AppText fontSize={12} color={ColorsGlobal.success}>
                                    ✅ Đã mua: {item.trip.place_start} → {item.trip.place_end}
                                </AppText>
                                <AppText fontSize={11} color={ColorsGlobal.textLight}>
                                    {item.trip.points} điểm - {NumberFormat(item.trip.price_sell)}K
                                </AppText>
                            </AppView>
                        )}
                    </AppView>

                    {/* Nút sửa - Chỉ hiện khi status = 0 */}
                    {item.status === 0 && (
                        <AppButton
                            paddingLeft={16}
                            justifyContent="center"
                            onPress={() => goToEdit(item)}
                        >
                            <IconPencil color={ColorsGlobal.main} size={18} />
                        </AppButton>
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

            {/* Button tạo mới */}
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