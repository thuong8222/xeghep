
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import moment from 'moment';
import { CONSTANT, NumberFormat } from '../../utils/Helper';


export default function PointHistory(props) {

    const isBuy = props.data.related_type === 'point_buy' || props.data.related_type === 'buy_trip'
const key_related = props.data.related_type ;
const name_related = CONSTANT.TRANSACTION_TYPE_BY_KEY[key_related];
    const key_reason = props.data.reason
    const reason_name = CONSTANT.TRANSACTION_TYPE_BY_KEY[key_reason];

    return (
        <AppView radius={12} padding={12} gap={8} backgroundColor={ColorsGlobal.backgroundLight}  >
            <AppView row justifyContent={'space-between'}>
                <AppView row>
                <AppText fontSize={14}
                    color={ColorsGlobal.main2}>{reason_name}</AppText>
                    {props.data.related && 
                    <AppText fontSize={14}
                    color={ColorsGlobal.main2}>{isBuy ? ' của ':' cho '+ props.data.related.full_name}</AppText>
}
                </AppView>
                
                <AppText color={isBuy ? ColorsGlobal.main2 : ColorsGlobal.main} fontWeight={600}>
                    {/* {isBuy ? `+${reason} điểm` : `-${reason} điểm`} */}
                    {props?.data?.change + ' điểm'}
                </AppText>
            </AppView>
            <AppView row justifyContent={'space-between'}>
                <AppText fontSize={13} color={ColorsGlobal.textLight}>{moment(props.data.date).format('DD/MM/YYYY hh:mm')}</AppText>
                <AppText fontSize={13} color={ColorsGlobal.main2}>{'Số dư: ' + props.data.after_balance + ' điểm'}</AppText>
            </AppView>
        </AppView>
    )

}