import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import IconChevronLeftDouble from '../../assets/icons/IconChevronLeftDouble';
import moment from 'moment';
import ArrowRight from '../../assets/icons/ArrowRight';
import AppButton from '../common/AppButton';
import IconNote from '../../assets/icons/IconNote';
import { NumberFormat, scale } from '../../utils/Helper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';

export default function TripHistory(props) {
    console.log('props history trip: ', props)
    const navigation = useNavigation();
    const { currentDriver } = useAppContext()
    const isSold = props.data.is_sold;
    const gotoDetailTripHistory = () => {
        navigation.navigate('DetailTripHistory', { data: props.data })
    }
    const isOwner = props?.data?.id_driver_sell === currentDriver?.id
    let status_ = '';

    if (isSold === 1) {
        status_ = 'Đã bán';
    } else if (isSold === 2 && props?.data?.status === 0) {
        status_ = 'Đã huỷ';
    } else {
        status_ = 'Không bán được';
    }

    return (
        <AppButton onPress={gotoDetailTripHistory} gap={4} radius={12} borderWidth={1} padding={0}
            borderColor={ColorsGlobal.borderColorDark}
            // backgroundColor={isSold === 1 ? ColorsGlobal.backgroundTripSold : ColorsGlobal.backgroundTrip}
            backgroundColor={ColorsGlobal.backgroundTrip}
            row>
            <AppView gap={4} flex={1} padding={12}  >
                <AppView row justifyContent={'space-between'}>
                    <AppView row alignItems='center' gap={8}>
                        <AppText fontWeight={600}
                            color={
                                isSold === 1
                                    ? ColorsGlobal.textLight
                                    : props.data.direction === 1
                                        ? ColorsGlobal.main
                                        : ColorsGlobal.main2
                            }>{props.data.driver_sell.full_name}</AppText>
                        <IconChevronLeftDouble rotate={props.data.direction === 1 ? 0 : 180} color={
                            isSold === 1
                                ? ColorsGlobal.textLight
                                : props.data.direction === 1
                                    ? ColorsGlobal.main
                                    : ColorsGlobal.main2
                        } />
                    </AppView>

                    <AppView row gap={8}>
                        {props.data.time_receive ?
                            <AppText fontWeight={600}>
                                {typeof props.data.time_receive === 'number' || /^\d+$/.test(props.data.time_receive)
                                    ? moment.unix(Number(props.data.time_receive)).format('DD-MM-YYYY HH:mm')
                                    : moment(props.data.time_receive).format('DD-MM-YYYY HH:mm')}
                            </AppText>
                            :
                            <AppText color={isSold === 1 ? 'green' : 'red'}>{status_}</AppText>
                        }
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
                    <AppText fontWeight={600}>{props.data.guests + ' khách'}</AppText>
                    <AppText color={ColorsGlobal.main} fontWeight={700}>{NumberFormat(props.data.price_sell) + "K"}</AppText>
                    <AppText fontWeight={700}>{isOwner ? `+${props.data.point} đ` : `-${props.data.point} đ`}</AppText>

                </AppView>
                {props.data.note &&
                    <AppView row gap={4} alignItems='center' >
                        <IconNote />
                        <AppText fontSize={14} lineHeight={20} fontWeight={400}>{props.data.note}</AppText>
                    </AppView>
                }

            </AppView>
            {(isSold === 1 && isOwner) && (
                <AppView borderLeftColor={'#949494'} borderLeftWidth={1}  >

                    <AppView padding={10}>
                        <AppText fontSize={13} textAlign='center' color={isSold === 1 && 'green'}>{isSold === 1 && status_}</AppText>
                    </AppView>
                    {isSold === 1 &&
                        <AppView justifyContent='center' alignItems='center' padding={8} gap={4}>
                            <AppText fontSize={10} >{'Tài xế nhận'}</AppText>
                            <AppText fontSize={10} >{props.data?.driver_receive?.full_name}</AppText>
                        </AppView>
                    }
                </AppView>
            )

            }
        </AppButton>
    )
}


