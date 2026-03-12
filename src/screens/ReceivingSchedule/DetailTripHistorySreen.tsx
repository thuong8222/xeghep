import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import IconUser from '../../assets/icons/IconUser';
import AppButton from '../../components/common/AppButton';
import IconClock from '../../assets/icons/IconClock';
import IconLocation from '../../assets/icons/iconLocation';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconPhone from '../../assets/icons/iconPhone';
import moment from 'moment';
import IconComment from '../../assets/icons/iconComment';
import { useAppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTripDisplayStatus } from '../../utils/Helper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/data/store';
import { fetchMyTrips, fetchReceivedTrips, fetchSoldTrips } from '../../redux/slices/tripsSlice';
import { useFocusEffect } from '@react-navigation/native';

export default function DetailTripHistorySreen({ route, navigation }: any) {
    const data = route?.params?.data;
    // console.log('data DetailTripHistorySreen: ', data)
    const dispatch = useDispatch<AppDispatch>();
    const tripsState = useSelector((state: RootState) => state.trips) as any;
    const { receivedTrips = [], soldTrips = [], myTrips = [], loading } = tripsState;
    const [trip, setTrip] = useState<any>(data ?? null);
    const [driver, setDriver] = useState<any>(null);
    useEffect(() => {
        const fetchDriver = async () => {
            const driverString = await AsyncStorage.getItem("driver");
            if (driverString) setDriver(JSON.parse(driverString));
        };
        fetchDriver();
    }, []);
    const { currentDriver } = useAppContext();

    useEffect(() => {
        setTrip(data ?? null);
    }, [data]);

    const currentDriverObj: any = currentDriver as any;
    const currentUserId = currentDriverObj?.id || driver?.id || currentDriver;
    const tripId = useMemo(() => {
        return trip?.id ?? trip?.id_trip ?? data?.id ?? data?.id_trip;
    }, [trip?.id, trip?.id_trip, data?.id, data?.id_trip]);

    const sellerId = useMemo(() => {
        return trip?.id_driver_sell ?? trip?.driver_sell?.id_driver ?? trip?.seller_id ?? trip?.driver_sell_id ?? trip?.driver_sell?.id;
    }, [trip?.id_driver_sell, trip?.driver_sell?.id_driver, trip?.seller_id, trip?.driver_sell_id, trip?.driver_sell?.id]);

    const isSeller = !!(currentUserId && sellerId && currentUserId === sellerId);
    const driverSell = trip?.driver_sell || {};
    const driverReceive = trip?.driver_receive;

    const statusKey = useMemo(() => {
        const isSoldValue = Number(trip?.is_sold);
        if (trip?.display_status) return String(trip.display_status);
        if (isSoldValue === 1) return 'sold';
        if (isSoldValue === 2 || trip?.status === 0 || trip?.status === 2) return 'cancelled';
        const timeStart = trip?.time_start;
        if (timeStart) {
            const ts = typeof timeStart === 'number'
                ? (timeStart.toString().length > 10 ? timeStart / 1000 : timeStart)
                : (!isNaN(timeStart) ? (timeStart.toString().length > 10 ? Number(timeStart) / 1000 : Number(timeStart)) : null);
            if (ts && moment.unix(ts).isBefore(moment())) return 'unsellable';
        }
        return 'selling';
    }, [trip?.display_status, trip?.is_sold, trip?.status, trip?.time_start]);

    const statusInfo = getTripDisplayStatus(statusKey);
    const isSold = statusKey === 'sold' || Number(trip?.is_sold) === 1;

    const matchTripId = useCallback((t: any) => {
        if (!t || !tripId) return false;
        return String(t?.id ?? t?.id_trip) === String(tripId);
    }, [tripId]);

    const bestTripFromStore = useMemo(() => {
        const candidates = [...(receivedTrips || []), ...(soldTrips || []), ...(myTrips || [])];
        return candidates.find(matchTripId);
    }, [receivedTrips, soldTrips, myTrips, matchTripId]);

    useEffect(() => {
        if (!bestTripFromStore) return;
        setTrip((prev: any) => {
            if (!prev) return bestTripFromStore;
            const prevHasDriverSellPhone = !!(prev?.driver_sell?.phone || prev?.driver_sell?.phone_number);
            const nextHasDriverSellPhone = !!(bestTripFromStore?.driver_sell?.phone || bestTripFromStore?.driver_sell?.phone_number);
            if (!prevHasDriverSellPhone && nextHasDriverSellPhone) return bestTripFromStore;
            const prevHasReceive = !!prev?.driver_receive;
            const nextHasReceive = !!bestTripFromStore?.driver_receive;
            if (!prevHasReceive && nextHasReceive) return bestTripFromStore;
            return { ...prev, ...bestTripFromStore };
        });
    }, [bestTripFromStore]);

    useFocusEffect(
        useCallback(() => {
            if (!tripId) return;
            if (isSeller) {
                dispatch(fetchSoldTrips({}));
                dispatch(fetchMyTrips({}));
            } else {
                dispatch(fetchReceivedTrips({}));
            }
        }, [dispatch, tripId, isSeller]),
    );

    const formatTime = (value: any) => {
        if (!value) return "--";

        // Nếu là số → có thể là seconds hoặc milliseconds
        if (typeof value === "number") {
            const ts = value.toString().length > 10 ? value / 1000 : value;
            return moment.unix(ts).format("DD-MM-YYYY HH:mm");
        }

        // Nếu là chuỗi nhưng là số
        if (!isNaN(value)) {
            const num = Number(value);
            const ts = value.length > 10 ? num / 1000 : num;
            return moment.unix(ts).format("DD-MM-YYYY HH:mm");
        }

        // Trường hợp chuỗi dạng ISO
        const m = moment(value);
        if (m.isValid()) return m.format("DD-MM-YYYY HH:mm");

        return "--";
    };

    const callPhone = useMemo(() => {
        const sellerPhone = driverSell?.phone || driverSell?.phone_number;
        const receivePhone = driverReceive?.phone || driverReceive?.phone_number;
        return isSeller ? receivePhone : sellerPhone;
    }, [driverSell?.phone, driverSell?.phone_number, driverReceive?.phone, driverReceive?.phone_number, isSeller]);

    const gotoChat = () => {
        const buyerId = trip?.buyer_id ?? trip?.id_driver_receive ?? driverReceive?.id ?? (!isSeller ? currentUserId : undefined);
        const sellerIdValue = trip?.seller_id ?? trip?.id_driver_sell ?? driverSell?.id_driver ?? (isSeller ? currentUserId : undefined);
        navigation.push('ChatScreen', { data: { ...trip, buyer_id: buyerId, seller_id: sellerIdValue, }, screen: 'DetailTripHistory' })
    }
    return (
        <AppView style={styles.container}>
            <AppView padding={16} marginBottom={16} borderWidth={1} borderColor={statusInfo.color} backgroundColor={statusInfo.background} radius={999} row justifyContent={'space-between'}>
                <AppText  >{'Trạng thái: '}</AppText>
                <AppText textAlign={'right'} color={statusInfo.color}>{statusInfo.label}</AppText>
            </AppView>
            {!!loading && (
                <AppView paddingBottom={10} alignItems="center">
                    <ActivityIndicator />
                </AppView>
            )}
            {/* --- Header tài xế bán chuyến --- */}
            {isSold &&
                <View style={styles.section}>

                    <AppView>


                        <AppText style={styles.sectionTitle}>{isSeller ? 'Tài xế nhận chuyến' : 'Tài xế bán chuyến: '}</AppText>
                        {isSeller ?
                            <View style={styles.row}>
                                <IconUser size={22} />
                                <AppText style={styles.value}>
                                    {driverReceive?.full_name} ({driverReceive?.phone || driverReceive?.phone_number})
                                </AppText>
                            </View> :
                            <View style={styles.row}>
                                <IconUser size={22} />
                                <AppText style={styles.value}>
                                    {driverSell?.full_name} ({driverSell?.phone || driverSell?.phone_number})
                                </AppText>
                            </View>
                        }
                    </AppView>

                    <AppView row justifyContent={'space-between'} alignItems={'center'}>
                        <AppButton
                            row gap={6}
                            onPress={gotoChat}
                        >
                            <IconComment color={ColorsGlobal.main} />
                            <AppText color={ColorsGlobal.main}>{isSeller ? 'Chat với lái xe nhận' : 'Chat với lái xe bán'}</AppText>
                        </AppButton>
                        <AppButton

                            onPress={() => {
                                if (callPhone) Linking.openURL(`tel:${callPhone}`);
                            }}
                            style={styles.callBtn}
                            row gap={8} alignItems='center'
                        >
                            <IconPhone />
                            <AppText color={ColorsGlobal.main2}>{'Gọi'}</AppText>

                        </AppButton>
                    </AppView>
                </View>
            }
            {/* --- Thông tin hành trình --- */}
            <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Thông tin chuyến</AppText>

                <View style={styles.row}>
                    <IconLocation />
                    <AppText style={styles.label}>Điểm đi:</AppText>
                    <AppText style={styles.value}>{trip?.place_start}</AppText>
                </View>

                <View style={styles.row}>
                    <IconLocation />
                    <AppText style={styles.label}>Điểm đến:</AppText>
                    <AppText style={styles.value}>{trip?.place_end}</AppText>
                </View>

                <View style={styles.row}>
                    <IconUser />
                    <AppText style={styles.label}>Số khách:</AppText>
                    <AppText style={styles.value}>{trip?.guests}</AppText>
                </View>

                <View style={styles.row}>
                    <IconClock />
                    <AppText style={styles.label}>Giờ xuất phát:</AppText>
                    <AppText style={styles.value}>
                        {formatTime(trip?.time_start)}
                    </AppText>
                </View>

                <View style={styles.row}>
                    <IconClock />
                    <AppText style={styles.label}>Giờ nhận chuyến:</AppText>
                    <AppText style={styles.value} color={ColorsGlobal.main2}>
                        {formatTime(trip?.time_receive)}
                    </AppText>
                </View>

            </View>

            {/* --- Giá – Point --- */}
            <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Thanh toán & Điểm</AppText>

                <View style={styles.row}>
                    <AppText style={styles.label}>Điểm chuyến:</AppText>
                    <AppText style={styles.value}>{'-' + trip?.point + ' điểm'}</AppText>
                </View>

                <View style={styles.row}>
                    <AppText style={styles.label}>Thu khách:</AppText>
                    <AppText style={styles.price}>{trip?.price_sell}K</AppText>
                </View>
            </View>

            {/* --- Ghi chú --- */}
            {trip?.note ? (
                <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>Ghi chú</AppText>
                    <AppText style={styles.note}>{trip?.note}</AppText>
                </View>
            ) : null}

            {/* --- Nút quay lại --- */}
            <AppButton onPress={() => navigation.goBack()} style={styles.backBtn} alignItems="center">
                <AppText>{'Quay lại'}</AppText>
            </AppButton>

        </AppView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,

    },
    label: {
        fontSize: 14,
        width: 110,
        color: '#555',
        marginLeft: 6,

    },
    value: {
        fontSize: 14,
        color: '#111',
        flex: 1,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#d9534f',
    },
    note: {
        fontSize: 14,
        color: '#444',
        marginTop: 6,
    },
    callBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    backBtn: {
        marginTop: 10,
    }
});
