import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import IconChevronLeftDouble from '../../assets/icons/IconChevronLeftDouble';
import moment from 'moment';
import ArrowRight from '../../assets/icons/ArrowRight';
import AppButton from '../common/AppButton';
import IconNote from '../../assets/icons/IconNote';

export default function Trip(props) {

    const openMapSmart = (trip) => {
        const {
            lat_start,
            lng_start,
            lat_end,
            lng_end,
            place_start,
            place_end,
        } = trip;

        // Ưu tiên dùng tọa độ nếu có
        if (lat_start && lng_start && lat_end && lng_end) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${lat_start},${lng_start}&destination=${lat_end},${lng_end}&travelmode=driving`;
            Linking.openURL(url);
            return;
        }

        // Nếu không có tọa độ thì fallback sang địa chỉ
        if (place_start && place_end) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(place_start)}&destination=${encodeURIComponent(place_end)}&travelmode=driving`;
            Linking.openURL(url);
        } else {
            Alert.alert('Thiếu dữ liệu', 'Không có thông tin để mở Google Maps');
        }

    };
    return (
        <AppView  gap={4} radius={12} borderWidth={1} borderColor={ColorsGlobal.borderColorDark} backgroundColor={props.data.Trip.sold === 1 ? ColorsGlobal.backgroundTripSold : ColorsGlobal.backgroundTrip} opacity={props.data.Trip.sold === 1 ? .5 : 1} row>
            <AppView gap={4} flex={1} padding={12} >
                <AppView row justifyContent={'space-between'}>
                    <AppView row alignItems='center' gap={8}>
                        <AppText fontWeight={600} 
                       color={
                        props.data.Trip.sold === 1
                          ? ColorsGlobal.textLight 
                          : props.data.Trip.direction === 1
                            ? ColorsGlobal.main
                            : ColorsGlobal.main2
                        }>{props.data.Trip.full_name_guest}</AppText>
                        <IconChevronLeftDouble rotate={props.data.Trip.direction === 1 ? 0 : 180} color={
                        props.data.Trip.sold === 1
                          ? ColorsGlobal.textLight 
                          : props.data.Trip.direction === 1
                            ? ColorsGlobal.main
                            : ColorsGlobal.main2
                        } />
                    </AppView>

                    <AppView row gap={8}>
                        <AppText fontWeight={600}>{moment(props.data.Trip.time_sell).format('hh:mm')}</AppText>
                        <AppText color={ColorsGlobal.main2}>{`+15'`}</AppText>
                    </AppView>
                </AppView>
                <AppButton onPress={() => openMapSmart(props.data.Trip)} row gap={8} >
                    <AppView borderBottomColor={ColorsGlobal.borderColor} borderBottomWidth={1} paddingVertical={10} flex={1}>
                        <AppText fontSize={14} lineHeight={20}>{props.data.Trip.place_start.split(',')[0].trim()}</AppText>
                    </AppView>
                    <AppView alignItems='center' justifyContent='center'  >
                        <ArrowRight />
                    </AppView>
                    <AppView borderBottomColor={ColorsGlobal.borderColor} borderBottomWidth={1} paddingVertical={10} flex={1}>
                        <AppText fontSize={14} lineHeight={20}>{props.data.Trip.place_end.split(',')[0].trim()}</AppText>
                    </AppView>
                </AppButton>
                <AppView row justifyContent={'space-between'}>
                    <AppText fontWeight={600}>{props.data.Trip.guests + ' khách'}</AppText>
                    <AppText color={ColorsGlobal.main} fontWeight={700}>{props.data.Trip.price_sell + "K"}</AppText>
                    <AppText fontWeight={700}>{'-' + props.data.Trip.point + ' đ'}</AppText>

                </AppView>
                {props.data.Trip.note &&
                    <AppView row gap={4} >
                        <IconNote />
                        <AppText fontSize={14} lineHeight={20} fontWeight={400}>{props.data.Trip.note}</AppText>
                    </AppView>
                }

            </AppView>
            {props.data.Trip.sold === 1 && (
                <AppView borderLeftColor={'#949494'} borderLeftWidth={1} justifyContent='center' alignItems='center' padding={12}>
                    <AppText fontSize={10} >{'Nhận'}</AppText>
                    <AppText fontSize={10} >{'Nguyễn Văn Long'}</AppText>
                </AppView>)

            }
        </AppView>
    )
}


