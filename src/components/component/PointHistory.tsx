import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import moment from 'moment';
import { NumberFormat } from '../../utils/Helper';


export default function PointHistory(props) {
const isBuy = props.data.type === 'buy_point' || props.data.type === 'buy_trip'
    const point = NumberFormat(props?.data?.points ?? 0);
    return (
        <AppView radius={12} padding={12} backgroundColor={ColorsGlobal.backgroundLight}  >
            <AppView row justifyContent={'space-between'}>
                <AppText fontSize={14}
                    color={ColorsGlobal.main2}>{props.data.note}</AppText>
                <AppText color={isBuy ? ColorsGlobal.main2 : ColorsGlobal.main} fontWeight={600}>
                    {isBuy ? `+${point} điểm` : `-${point} điểm`}
                </AppText>
            </AppView>
            <AppView row justifyContent={'space-between'}>
                <AppText fontSize={13} color={ColorsGlobal.textLight}>{moment(props.data.date).format('DD/MM/YYYY hh:mm')}</AppText>
                <AppText fontWeight={700} color={ColorsGlobal.main}>{props.data.price}</AppText>
            </AppView>
        </AppView>
    )

}