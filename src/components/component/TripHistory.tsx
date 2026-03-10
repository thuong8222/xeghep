import React, { useEffect, useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import IconChevronLeftDouble from '../../assets/icons/IconChevronLeftDouble';
import moment from 'moment';
import ArrowRight from '../../assets/icons/ArrowRight';
import AppButton from '../common/AppButton';
import IconNote from '../../assets/icons/IconNote';
import { NumberFormat, getTripDisplayStatus, parseTime } from '../../utils/Helper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TripHistory(props: any) {
    const [driver, setDriver] = useState<any>(null);
    const navigation = useNavigation<any>();
    const { currentDriver } = useAppContext();

    useEffect(() => {
        const fetchDriver = async () => {
            const driverString = await AsyncStorage.getItem('driver');
            setDriver(driverString ? JSON.parse(driverString) : null);
        };
        fetchDriver();
    }, [currentDriver]);

    const data = props.data;
    const isSold = data?.is_sold;
    const isOwner = data?.id_driver_sell === (currentDriver?.id || driver?.id);

    // ✅ Ưu tiên display_status từ API, fallback tự tính
    const resolveStatusKey = (): string => {
        if (data?.display_status) return String(data.display_status);
        if (isSold === 1) return 'sold';
        if (isSold === 2 || data?.status === 0) return 'cancelled';
        // is_sold = 0 → kiểm tra quá giờ
        const timeStart = data?.time_start;
        if (timeStart && parseTime(timeStart).isBefore(moment())) return 'unsellable';
        return 'selling';
    };

    const statusKey = resolveStatusKey();
    const statusInfo = getTripDisplayStatus(statusKey);

    // ✅ Chỉ cho sửa khi đang bán (chưa quá giờ, chưa bán, chưa hủy)
    const canEdit = !!props?.onEdit && statusKey === 'selling';

    const gotoDetail = () => navigation.navigate('DetailTripHistory', { data });

    const renderTimeOrStatus = () => {
        if (data?.time_receive && isSold === 1) {
            const val = data.time_receive;
            const formatted = (typeof val === 'number' || /^\d+$/.test(String(val)))
                ? moment.unix(Number(val)).format('DD/MM/YYYY HH:mm')
                : moment(val).format('DD/MM/YYYY HH:mm');
            return <AppText fontWeight={600}>{formatted}</AppText>;
        }
        return (
            <AppView
                backgroundColor={statusInfo.background}
                radius={999}
                paddingHorizontal={10}
                paddingVertical={3}
                alignItems='center'
                justifyContent='center'
            >
                <AppText fontSize={12} color={statusInfo.color} fontWeight={600}>
                    {statusInfo.label}
                </AppText>
            </AppView>
        );
    };

    const nameColor = isSold === 1
        ? ColorsGlobal.textLight
        : data?.direction === 1 ? ColorsGlobal.main : ColorsGlobal.main2;

    return (
        <AppButton
            onPress={gotoDetail}
            gap={4} radius={12} borderWidth={1} padding={0}
            borderColor={ColorsGlobal.borderColorDark}
            backgroundColor={ColorsGlobal.backgroundTrip}
            row
        >
            <AppView gap={4} flex={1} padding={12}>

                {/* ROW 1: Tên tài xế + trạng thái + nút sửa */}
                <AppView row justifyContent='space-between' alignItems='center'>
                    <AppView row alignItems='center' gap={8}>
                        <AppText fontWeight={600} color={nameColor}>
                            {data?.driver_sell?.full_name}
                        </AppText>
                        <IconChevronLeftDouble
                            rotate={data?.direction === 1 ? 0 : 180}
                            color={nameColor}
                        />
                    </AppView>

                    <AppView row gap={8} alignItems='center'>
                        {renderTimeOrStatus()}
                        {canEdit && (
                            <AppButton
                                onPress={() => props.onEdit?.(data)}
                                paddingHorizontal={10}
                                paddingVertical={4}
                                radius={999}
                                backgroundColor='#FFF0E6'
                            >
                                <AppText fontSize={12} color={ColorsGlobal.main}>Sửa</AppText>
                            </AppButton>
                        )}
                    </AppView>
                </AppView>

                {/* ROW 2: Địa điểm */}
                <AppView row gap={8}>
                    <AppView borderBottomColor='#E4E4E4' borderBottomWidth={1} paddingVertical={8} flex={1}>
                        <AppText fontSize={14} lineHeight={20}>
                            {data?.place_start?.split(',')[0]?.trim()}
                        </AppText>
                    </AppView>
                    <AppView alignItems='center' justifyContent='center'>
                        <ArrowRight />
                    </AppView>
                    <AppView borderBottomColor='#E4E4E4' borderBottomWidth={1} paddingVertical={8} flex={1}>
                        <AppText fontSize={14} lineHeight={20}>
                            {data?.place_end?.split(',')[0]?.trim()}
                        </AppText>
                    </AppView>
                </AppView>

                {/* ROW 3: Khách + Giá + Điểm */}
                <AppView row justifyContent='space-between'>
                    <AppText fontWeight={600}>{data?.guests + ' khách'}</AppText>
                    <AppText color={ColorsGlobal.main} fontWeight={700}>
                        {NumberFormat(data?.price_sell) + 'K'}
                    </AppText>
                    {isSold === 1 && (
                        <AppText fontWeight={700} color={ColorsGlobal.main2}>
                            {isOwner ? `+${data?.point}đ` : `-${data?.point}đ`}
                        </AppText>
                    )}
                </AppView>

                {/* Ghi chú */}
                {!!data?.note && (
                    <AppView row gap={4} alignItems='center'>
                        <IconNote />
                        <AppText fontSize={14} lineHeight={20} fontWeight={400}>
                            {data.note}
                        </AppText>
                    </AppView>
                )}
            </AppView>

            {/* Panel bên phải: chỉ hiện khi đã bán và là người tạo */}
            {isSold === 1 && isOwner && (
                <AppView borderLeftColor='#949494' borderLeftWidth={1}>
                    <AppView
                        marginTop={10}
                        backgroundColor={statusInfo.background}
                        radius={999}
                        paddingVertical={2}
                        marginHorizontal={10}
                    >
                        <AppText fontSize={11} textAlign='center' color={statusInfo.color}>
                            {statusInfo.label}
                        </AppText>
                    </AppView>
                    <AppView justifyContent='center' alignItems='center' padding={8} gap={4}>
                        <AppText fontSize={10}>Tài xế nhận</AppText>
                        <AppText fontSize={10}>{data?.driver_receive?.full_name}</AppText>
                    </AppView>
                </AppView>
            )}
        </AppButton>
    );
}