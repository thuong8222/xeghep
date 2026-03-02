import React from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import IconChevronLeftDouble from '../../assets/icons/IconChevronLeftDouble';
import moment from 'moment';
import ArrowRight from '../../assets/icons/ArrowRight';
import IconNote from '../../assets/icons/IconNote';
import { CONSTANT, NumberFormat, parseTime, scale } from '../../utils/Helper';
import { Text } from 'react-native';
import { useCountdown } from '../../hooks/useCountdown';
import CountdownStyled from './CountdownStyled';

export default function Trip(props) {
    const guests = props.data?.guests;
    const time_start_sec = props.data?.time_start;
    const isSold = props.data?.is_sold === 1;
    const time = parseTime(time_start_sec);
    const isToday = time.isSame(moment(), 'day');
    const formatted = isToday
        ? time.format("HH:mm")
        : time.format("DD/MM/YYYY HH:mm");
    const countdown = useCountdown(time_start_sec);
    const type_car = props?.data?.type_car;
    const name_type_car = CONSTANT.TYPE_CAR_LIST.find(item => item.key === type_car)?.name;

    // ✅ Đã qua thời gian bắt đầu
    const isPast = time_start_sec && (time_start_sec * 1000) < Date.now();

    // ✅ Còn trong vòng 15 phút → hiện đếm ngược
    const diffSeconds = time_start_sec ? time_start_sec - Math.floor(Date.now() / 1000) : null;
    const showCountdown = diffSeconds !== null && diffSeconds > 0 && diffSeconds <= 15 * 60;

    const getBackgroundColor = () => {
        if (isSold) return ColorsGlobal.backgroundTripSold;
        if (isPast) return '#F0F0F0';
        if (isToday) return ColorsGlobal.backgroundTripToday;
        return ColorsGlobal.backgroundTrip;
    };

    const getBorderColor = () => {
        if (isPast && !isSold) return '#CCCCCC';
        if (isToday) return ColorsGlobal.main2;
        return ColorsGlobal.borderColorDark;
    };

    const getTextColor = (defaultColor?: string) => {
        if (isSold) return ColorsGlobal.textLight;
        if (isPast) return '#999999';
        return defaultColor;
    };

    return (
        <AppView
            gap={4}
            radius={12}
            borderWidth={1}
            padding={0}
            borderColor={getBorderColor()}
            backgroundColor={getBackgroundColor()}
            opacity={isSold ? 0.5 : isPast ? 0.7 : 1}
            row
        >
            <AppView gap={4} flex={1} padding={12}>

                {/* ===== ROW 1: TÊN + GIỜ ===== */}
                <AppView row justifyContent={'space-between'} alignItems='center'>
                    <AppView row alignItems='center' gap={4}>
                        <AppText
                            fontWeight={600}
                            color={getTextColor(
                                props.data?.direction === 1 ? ColorsGlobal.main2 : ColorsGlobal.main
                            )}
                        >
                            {props.data?.driver_sell?.full_name}
                        </AppText>
                        <IconChevronLeftDouble
                            rotate={props.data?.direction === 1 ? 180 : 0}
                            color={getTextColor(
                                props.data?.direction === 1 ? ColorsGlobal.main2 : ColorsGlobal.main
                            )}
                        />
                    </AppView>

                    <AppView row gap={8} alignItems='center'>
                        <AppText fontWeight={600} color={getTextColor()}>
                            {formatted}
                        </AppText>

                        {/* ✅ Đếm ngược chỉ hiện khi còn <= 15 phút */}
                        {showCountdown && <CountdownStyled seconds={countdown} />}

                        {/* ✅ Badge "Đã qua" khi isPast và chưa bán */}
                        {isPast && !isSold && (
                            <AppView
                                backgroundColor="#E0E0E0"
                                paddingHorizontal={6}
                                paddingVertical={2}
                                radius={99}
                            >
                                <AppText fontSize={10} color="#888">Đã qua</AppText>
                            </AppView>
                        )}
                    </AppView>
                </AppView>

                {/* ===== ROW 2: ĐỊA ĐIỂM ===== */}
                <AppView row gap={8}>
                    <AppView borderBottomColor={'#E4E4E4'} borderBottomWidth={1} paddingVertical={8} flex={1}>
                        <AppText fontSize={14} lineHeight={20} numberOfLines={1} color={getTextColor()}>
                            {props.data.place_start}
                        </AppText>
                    </AppView>
                    <AppView alignItems='center' justifyContent='center'>
                        <ArrowRight />
                    </AppView>
                    <AppView borderBottomColor={'#E4E4E4'} borderBottomWidth={1} paddingVertical={8} flex={1}>
                        <AppText fontSize={14} lineHeight={20} numberOfLines={1} color={getTextColor()}>
                            {props.data.place_end}
                        </AppText>
                    </AppView>
                </AppView>

                {/* ===== ROW 3: KHÁCH + GIÁ + ĐIỂM ===== */}
                <AppView row justifyContent={'space-between'}>
                    <AppText fontWeight={600} color={getTextColor()}>
                        {props?.data?.cover_car === 1 ? `Bao ${name_type_car}` : `${guests} khách`}
                    </AppText>
                    <AppText color={getTextColor(ColorsGlobal.main)} fontWeight={700}>
                        {NumberFormat(props.data.price_sell) + "K"}
                    </AppText>
                    <AppText fontWeight={700} color={getTextColor()}>
                        {'-' + props.data?.point + ' đ'}
                    </AppText>
                </AppView>

                {/* ===== GHI CHÚ ===== */}
                {props.data?.note && (
                    <AppView row gap={4} flex={1}>
                        <Text>
                            <IconNote />
                            <AppText title={' '} />
                            <AppText fontSize={14} lineHeight={20} fontWeight={400} color={getTextColor()}>
                                {props.data?.note}
                            </AppText>
                        </Text>
                    </AppView>
                )}
            </AppView>

            {/* ===== PANEL BÊN PHẢI KHI ĐÃ BÁN ===== */}
            {props.data?.is_sold === 1 && (
                <AppView
                    borderLeftColor={'#949494'}
                    borderLeftWidth={1}
                    justifyContent='center'
                    alignItems='center'
                    padding={8}
                >
                    <AppText fontSize={10}>{'Nhận'}</AppText>
                    <AppText fontSize={10}>{props.data?.driver_receive?.full_name}</AppText>
                </AppView>
            )}
        </AppView>
    );
}