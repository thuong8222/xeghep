import { SectionList, TouchableOpacity, RefreshControl, Alert, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/common/Container';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconPlus from '../../assets/icons/IconPlus';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AppView from '../../components/common/AppView';
import IconPencil from '../../assets/icons/iconPencil';
import IconLocation from '../../assets/icons/iconLocation';
import { cancelAutoBuyTrip, fetchAutoBuyList } from '../../redux/slices/requestAutoBuyTrip';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CONSTANT, NumberFormat } from '../../utils/Helper';
import IconClose from '../../assets/icons/IconClose';
import IconMapPin from '../../assets/icons/IconMapPin';
import IconGroup from '../../assets/icons/IconGroup';

// ✅ Group flat list → SectionList sections
const buildSections = (data: any[]) => {
    const grouped: Record<string, any[]> = {};
    data.forEach(item => {
        const key = item.area_name || 'Nhóm khác';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
};

export default function ListPriorityPurchaseScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useAppDispatch();
    const { list, loading, lastUpdate } = useSelector((state: any) => state.requestAutoBuyTrip);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchAutoBuyList());
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (route?.params?.refresh) {
                dispatch(fetchAutoBuyList());
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

    const goToDetail = (item: any) => {
        navigation.navigate("AutoBuyDetailScreen", { id: item.id });
    };

    const goToEdit = (item: any) => {
        if (item.status !== 0) {
            Alert.alert('Không thể sửa yêu cầu đã hoàn thành hoặc đã hủy');
            return;
        }
        navigation.navigate("PriorityPurchaseScreen", { id: item.id, editData: item });
    };

    const confirmCancel = (item: any) => {
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
                            Alert.alert('Thất bại', err?.message || 'Huỷ yêu cầu không thành công, vui lòng thử lại');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const status = CONSTANT?.STATUS_STYLE[item?.status] || CONSTANT.STATUS_STYLE[0];

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
                    {/* ===== HEADER: STATUS + ACTIONS ===== */}
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
                                <AppButton
                                    onPress={() => confirmCancel(item)}
                                    backgroundColor={ColorsGlobal.borderColor}
                                    radius={99}
                                    height={32}
                                    width={32}
                                    justifyContent='center'
                                    alignItems='center'
                                >
                                    <IconClose size={22} color="#C0392B" />
                                </AppButton>
                            </AppView>
                        )}
                    </AppView>

                    {/* ===== BODY: LOCATION ===== */}
                    <AppView marginTop={10} gap={6}>
                        <Text>
                            <IconMapPin size={17} />
                            <AppText title={' '} />
                            <AppText fontSize={14} bold>
                                {Array.isArray(item.pickup_location_names) && item.pickup_location_names.length > 0
                                    ? item.pickup_location_names.join(', ')
                                    : item.pickup_location_manual || item.pickup_location}
                            </AppText>
                        </Text>

                        <Text>
                            <IconLocation size={14} />
                            <AppText title={' '} />
                            <AppText fontSize={14}>
                                {Array.isArray(item.dropoff_location_names) && item.dropoff_location_names.length > 0
                                    ? item.dropoff_location_names.join(', ')
                                    : item.dropoff_location_manual || item.dropoff_location}
                            </AppText>
                        </Text>
                    </AppView>

                    {/* ===== FOOTER: TIME + POINT/PRICE ===== */}
                    <AppView row justifyContent="space-between" alignItems="center" marginTop={12}>
                        <AppText fontSize={13} color={ColorsGlobal.textLight}>
                            ⏰ {moment(item.time_receive_start).format('HH:mm DD/MM')} — {moment(item.time_receive_end).format('HH:mm DD/MM')}
                        </AppText>
                        <AppText bold color={ColorsGlobal.main}>
                            [{item.maximum_point} điểm — {NumberFormat(parseInt(item.desired_price))}K]
                        </AppText>
                    </AppView>

                    {/* ===== PURCHASED TRIP ===== */}
                    {item.status === 1 && item.trip && (
                        <AppView backgroundColor="#F0FDF4" padding={8} radius={8} marginTop={10}>
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

    // ✅ Section header - tên nhóm/khu vực
    const renderSectionHeader = ({ section }: { section: { title: string } }) => (
        <AppView
            backgroundColor={ColorsGlobal.main2}
            paddingHorizontal={12}
            paddingVertical={8}
            marginBottom={8} gap={4} alignItems='center'
            radius={8} row
        >
            <IconGroup size={16} color={ColorsGlobal.main} />
            <AppText bold fontSize={14} color={ColorsGlobal.backgroundLight}>
                {section.title}
            </AppText>
        </AppView>
    );

    const sections = buildSections(list || []);

    return (
        <Container style={{ position: 'relative' }} padding={16} ignoreBottomInset>
            <AppText textAlign='center' color={ColorsGlobal.main2} fontWeight={600}>
                [Danh sách yêu cầu mua chuyến tự động]
            </AppText>

            <AppView flex={1} paddingTop={20}>
                {loading && !refreshing && (
                    <AppText textAlign="center">Đang tải...</AppText>
                )}

                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    stickySectionHeadersEnabled={true}
                    // ✅ Khoảng cách giữa các item trong section
                    ItemSeparatorComponent={() => <AppView height={12} />}
                    // ✅ Khoảng cách giữa các section
                    SectionSeparatorComponent={() => <AppView height={16} />}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[ColorsGlobal.main]}
                        />
                    }
                    ListEmptyComponent={
                        !loading ? (
                            <AppView padding={32} alignItems="center">
                                <AppText fontSize={16} color={ColorsGlobal.textLight} textAlign="center">
                                    Chưa có yêu cầu nào.{'\n'}Nhấn nút + để tạo mới.
                                </AppText>
                            </AppView>
                        ) : null
                    }
                />
            </AppView>

            {/* ===== FAB BUTTON ===== */}
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