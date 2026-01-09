
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import IconChevronLeftDouble from '../../assets/icons/IconChevronLeftDouble';
import moment from 'moment';
import ArrowRight from '../../assets/icons/ArrowRight';

import IconNote from '../../assets/icons/IconNote';
import { CONSTANT, NumberFormat, parseTime, scale } from '../../utils/Helper';

import { Alert } from 'react-native';
import { useCountdown } from '../../hooks/useCountdown';
import CountdownStyled from './CountdownStyled';

export default function Trip(props) {
    // console.log('trips:  props: ', props)
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

    return (
        <AppView gap={4} radius={12} borderWidth={1} padding={0}
            borderColor={isToday ? ColorsGlobal.main2 : ColorsGlobal.borderColorDark}
            backgroundColor={
                isSold
                    ? ColorsGlobal.backgroundTripSold
                    : isToday
                        ? ColorsGlobal.backgroundTripToday
                        : ColorsGlobal.backgroundTrip
            }

            opacity={isSold ? .5 : 1} row>
            <AppView gap={4} flex={1} padding={12}  >
                <AppView row justifyContent={'space-between'} alignItems='center' >
                    <AppView row alignItems='center' gap={4}>
                        <AppText fontWeight={600}
                            color={
                                isSold
                                    ? ColorsGlobal.textLight
                                    : props.data?.direction === 1
                                        ? ColorsGlobal.main2
                                        : ColorsGlobal.main
                            }>{props.data?.driver_sell?.full_name}</AppText>
                        <IconChevronLeftDouble rotate={props.data?.direction === 1 ? 180 : 0} color={
                            isSold
                                ? ColorsGlobal.textLight
                                : props.data?.direction === 1
                                    ? ColorsGlobal.main2
                                    : ColorsGlobal.main
                        } />
                    </AppView>

                    <AppView row gap={8} alignItems='center'>
                        <AppText fontWeight={600}>{formatted}</AppText>
                        {<CountdownStyled seconds={countdown} />}
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
                    <AppText fontWeight={600}>
                        {props?.data?.cover_car === 1 ? `Bao ${name_type_car}` : `${guests} khách`}
                    </AppText>
                    <AppText color={ColorsGlobal.main} fontWeight={700}>{NumberFormat(props.data.price_sell) + "K"}</AppText>
                    <AppText fontWeight={700}>{'-' + props.data?.point + ' đ'}</AppText>

                </AppView>
                {props.data?.note &&
                    <AppView row gap={4} alignItems='center' >
                        <IconNote />
                        <AppText fontSize={14} lineHeight={20} fontWeight={400}>{props.data?.note}</AppText>
                    </AppView>
                }

            </AppView>
            {props.data?.is_sold === 1 && (
                <AppView borderLeftColor={'#949494'} borderLeftWidth={1} justifyContent='center' alignItems='center' padding={8}>
                    <AppText fontSize={10} >{'Nhận'}</AppText>
                    <AppText fontSize={10} >{props.data?.driver_receive?.full_name}</AppText>
                </AppView>)

            }
        </AppView>
    )
}


