import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import moment from 'moment';
import { NumberFormat } from '../../utils/Helper';


export default function PointHistory(props) {
const isBuy = props.data.related_type === 'buy_point' || props.data.related_type === 'buy_trip'
    const reason = NumberFormat(props?.data?.change ?? 0);
    return (
        <AppView radius={12} padding={12} gap={8} backgroundColor={ColorsGlobal.backgroundLight}  >
            <AppView row justifyContent={'space-between'}>
                <AppText fontSize={14}
                    color={ColorsGlobal.main2}>{props.data.reason}</AppText>
                <AppText color={isBuy ? ColorsGlobal.main2 : ColorsGlobal.main} fontWeight={600}>
                    {/* {isBuy ? `+${reason} điểm` : `-${reason} điểm`} */}
                    {props?.data?.change +' điểm'}
                </AppText>
            </AppView>
            <AppView row justifyContent={'space-between'}>
                <AppText fontSize={13} color={ColorsGlobal.textLight}>{moment(props.data.date).format('DD/MM/YYYY hh:mm')}</AppText>
                <AppText fontSize={13} color={ColorsGlobal.main}>{'Số dư: '+props.data.after_balance +'điểm'}</AppText>
            </AppView>
        </AppView>
    )

}