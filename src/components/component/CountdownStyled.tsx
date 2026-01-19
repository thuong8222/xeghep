import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import moment from 'moment';
import AppView from '../common/AppView';
import AppText from '../common/AppText';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';

export default function CountdownStyled({ seconds }: any) {
    if (seconds <= 0) return null;
    
    const duration = moment.duration(seconds, 'seconds');

  
    const totalHours = Math.floor(duration.asHours());
    const m = String(duration.minutes()).padStart(2, '0');
    const s = String(duration.seconds()).padStart(2, '0');

   

    return (
        <AppView row alignItems="center" gap={2}>
            {totalHours > 0 && (
                <>
                    <DigitBox value={String(totalHours).padStart(2, '0')} />
                    <AppText fontSize={14} bold>:</AppText>
                </>
            )}
            <DigitBox value={m} />
            <AppText fontSize={14} bold>:</AppText>
            <DigitBox value={s} />
        </AppView>
    );
}

const DigitBox = ({ value }: any) => (
    <AppView
        style={{
            paddingVertical: 4,
            paddingHorizontal: 3,
            backgroundColor: ColorsGlobal.main,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <AppText fontSize={12} bold color='#fff'>{value}</AppText>
    </AppView>
);