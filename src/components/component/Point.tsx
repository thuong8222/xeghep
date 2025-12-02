import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import moment from 'moment';
import { NumberFormat } from '../../utils/Helper';


export default function Point(props: any) {
    return (
        <AppView gap={12} radius={12} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColorDark} backgroundColor={ColorsGlobal.backgroundWhite} >
            <AppView row justifyContent={'space-between'}>
                <AppText fontWeight={600}
                    color={ColorsGlobal.main2}>{props.data.seller.full_name}</AppText>
                <AppText color={ColorsGlobal.main2} fontWeight={600}>{NumberFormat(props.data.points_amount) + ' điểm'}</AppText>
            </AppView>
            <AppView row justifyContent={'space-between'}>
                <AppText fontSize={14} lineHeight={20} fontWeight={600} color={ColorsGlobal.textLight}>{moment(props.data.created_at).format('DD/MM/YYYY')}</AppText>
                <AppText fontWeight={700} color={ColorsGlobal.main}>{NumberFormat(Math.round(props.data.price_per_point)) + 'K/Điểm'}</AppText>
            </AppView>
        </AppView>
    )
}


