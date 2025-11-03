import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';


export default function Point(props) {

  
    return (
        <AppView gap={12} radius={12} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColorDark} backgroundColor={ColorsGlobal.backgroundWhite} >

            <AppView row justifyContent={'space-between'}>

                <AppText fontWeight={600}
                    color={ColorsGlobal.main2}>{props.data.Trip.full_name_guest}</AppText>

                <AppText color={ColorsGlobal.main2} fontWeight={600}>{'540 điểm'}</AppText>

            </AppView>
            <AppView row justifyContent={'space-between'}>
                <AppText fontSize={14} lineHeight={20} fontWeight={600} color={ColorsGlobal.textLight}>{'Ngày 20/11/2025'}</AppText>
                <AppText fontWeight={700} color={ColorsGlobal.main}>{'50K/ Điểm'}</AppText>
            </AppView>






        </AppView>
    )
}


