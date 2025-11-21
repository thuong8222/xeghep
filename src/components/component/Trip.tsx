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

export default function Trip(props) {

   
    return (
        <AppView gap={4} radius={12} borderWidth={1} padding={0}
            borderColor={ColorsGlobal.borderColorDark}
            backgroundColor={props.data?.is_sold === 1 ? ColorsGlobal.backgroundTripSold : ColorsGlobal.backgroundTrip}
            opacity={props.data?.is_sold=== 1 ? .5 : 1} row>
            <AppView gap={4} flex={1} padding={12}  >
                <AppView row justifyContent={'space-between'}>
                    <AppView row alignItems='center' gap={8}>
                        <AppText fontWeight={600}
                            color={
                                props.data?.is_sold === 1
                                    ? ColorsGlobal.textLight
                                    : props.data?.direction === 1
                                        ? ColorsGlobal.main
                                        : ColorsGlobal.main2
                            }>{props.data?.driver_sell?.full_name}</AppText>
                        <IconChevronLeftDouble rotate={props.data?.direction === 1 ? 0 : 180} color={
                            props.data?.is_sold === 1
                                ? ColorsGlobal.textLight
                                : props.data?.direction === 1
                                    ? ColorsGlobal.main
                                    : ColorsGlobal.main2
                        } />
                    </AppView>

                    <AppView row gap={8}>
                        <AppText fontWeight={600}>{moment(props.data?.time_sell).format('hh:mm')}</AppText>
                        <AppText color={ColorsGlobal.main2}>{`+15'`}</AppText>
                    </AppView>
                </AppView>
                <AppView row gap={8} >
                    <AppView borderBottomColor={'#E4E4E4'} borderBottomWidth={1} paddingVertical={8} flex={1}>
                        <AppText fontSize={14} lineHeight={20}>{props.data.place_start.split(',')[0].trim()}</AppText>
                    </AppView>
                    <AppView alignItems='center' justifyContent='center'  >
                        <ArrowRight />
                    </AppView>
                    <AppView borderBottomColor={'#E4E4E4'} borderBottomWidth={1} paddingVertical={8} flex={1}>
                        <AppText fontSize={14} lineHeight={20}>{props.data.place_end.split(',')[0].trim()}</AppText>
                    </AppView>
                </AppView>
                <AppView row justifyContent={'space-between'}>
                    <AppText fontWeight={600}>{props.data?.guests + ' khách'}</AppText>
                    <AppText color={ColorsGlobal.main} fontWeight={700}>{props.data.price_sell + "K"}</AppText>
                    <AppText fontWeight={700}>{'-' + props.data?.point + ' đ'}</AppText>

                </AppView>
                {props.data?.note &&
                    <AppView row gap={4} alignItems='center' >
                        <IconNote />
                        <AppText fontSize={14} lineHeight={20} fontWeight={400}>{props.data?.note}</AppText>
                    </AppView>
                }

            </AppView>
            {props.data?.sold === 1 && (
                <AppView borderLeftColor={'#949494'} borderLeftWidth={1} justifyContent='center' alignItems='center' padding={8}>
                    <AppText fontSize={10} >{'Nhận'}</AppText>
                    <AppText fontSize={10} >{props.data?.driver_buy}</AppText>
                </AppView>)

            }
        </AppView>
    )
}


