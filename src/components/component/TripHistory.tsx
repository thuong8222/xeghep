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
import { scale } from '../../utils/Helper';

export default function TripHistory(props) {


    return (
        <AppView gap={4} radius={12} borderWidth={1} padding={0}
            borderColor={ColorsGlobal.borderColorDark}
            backgroundColor={props.data.Trip.sold === 1 ? ColorsGlobal.backgroundTripSold : ColorsGlobal.backgroundTrip}
            opacity={props.data.Trip.sold === 1 ? .5 : 1} row>
            <AppView gap={4} flex={1} padding={12}  >
                <AppView row justifyContent={'space-between'}>
                    <AppView row alignItems='center' gap={8}>
                        <AppText fontWeight={600}
                            color={
                                props.data.Trip.sold === 1
                                    ? ColorsGlobal.textLight
                                    : props.data.Trip.direction === 1
                                        ? ColorsGlobal.main
                                        : ColorsGlobal.main2
                            }>{props.data.Trip.full_name_driver_owner}</AppText>
                        <IconChevronLeftDouble rotate={props.data.Trip.direction === 1 ? 0 : 180} color={
                            props.data.Trip.sold === 1
                                ? ColorsGlobal.textLight
                                : props.data.Trip.direction === 1
                                    ? ColorsGlobal.main
                                    : ColorsGlobal.main2
                        } />
                    </AppView>

                    <AppView row gap={8}>
                        <AppText fontWeight={600}>{moment(props.data.Trip.time_receive).format('hh:mm')}</AppText>

                    </AppView>
                </AppView>
                <AppView row gap={8} >
                    <AppView borderBottomColor={'#E4E4E4'} borderBottomWidth={1} paddingVertical={8} flex={1}>
                        <AppText fontSize={14} lineHeight={20}>{props.data.Trip.place_start.split(',')[0].trim()}</AppText>
                    </AppView>
                    <AppView alignItems='center' justifyContent='center'  >
                        <ArrowRight />
                    </AppView>
                    <AppView borderBottomColor={'#E4E4E4'} borderBottomWidth={1} paddingVertical={8} flex={1}>
                        <AppText fontSize={14} lineHeight={20}>{props.data.Trip.place_end.split(',')[0].trim()}</AppText>
                    </AppView>
                </AppView>
                <AppView row justifyContent={'space-between'}>
                    <AppText fontWeight={600}>{props.data.Trip.guests + ' khách'}</AppText>
                    <AppText color={ColorsGlobal.main} fontWeight={700}>{props.data.Trip.price_sell + "K"}</AppText>
                    <AppText fontWeight={700}>{'+' + props.data.Trip.point + 'đ'}</AppText>

                </AppView>
                {props.data.Trip.note &&
                    <AppView row gap={4} alignItems='center' >
                        <IconNote />
                        <AppText fontSize={14} lineHeight={20} fontWeight={400}>{props.data.Trip.note}</AppText>
                    </AppView>
                }

            </AppView>
            {props.data.Trip.sold === 1 && (
                <AppView borderLeftColor={'#949494'} borderLeftWidth={1} justifyContent='center' alignItems='center' padding={8}>
                    <AppText fontSize={10} >{'Nhận'}</AppText>
                    <AppText fontSize={10} >{props.data.Trip.driver_buy}</AppText>
                </AppView>)

            }
        </AppView>
    )
}


