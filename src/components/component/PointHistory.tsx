
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import moment from 'moment';
import { CONSTANT, NumberFormat } from '../../utils/Helper';


export default function PointHistory(props) {
    // console.log('PointHistory props.data: ', props.data)
    const isBuy = props.data.related_type === 'point_buy' || props.data.related_type === 'trip_buy'
    const minus_points = props.data.related_type === 'point_sale' || props.data.related_type === 'trip_buy'
    const key_related = props.data.related_type;
    const name_related = CONSTANT.TRANSACTION_TYPE_BY_KEY[key_related];
    const key_reason = props.data.reason
    const reason_name = CONSTANT.TRANSACTION_TYPE_BY_KEY[key_reason];

    return (
        <AppView radius={12} padding={12} gap={8} backgroundColor={ColorsGlobal.backgroundLight}  >
            <AppView row justifyContent={'space-between'}>
                <AppView row>
                    <AppText fontSize={14}
                        color={ColorsGlobal.main2}>{reason_name}</AppText>

                    {(props.data?.partner) &&
                        <AppText fontSize={14}
                            color={ColorsGlobal.main2}>{isBuy ? ` của ${props.data?.partner?.full_name||props.data?.partner?.full_name}` : ` cho ${props.data?.partner?.full_name|| props.data.partner?.full_name}`}</AppText>
                    } 
                </AppView>

                <AppText color={minus_points ? ColorsGlobal.main : ColorsGlobal.main2} fontWeight={600}>
                    {/* {isBuy ? `+${reason} điểm` : `-${reason} điểm`} */}
                    {NumberFormat(props?.data?.change) + ' điểm'}
                </AppText>
            </AppView>
            <AppView row justifyContent={'space-between'}>
                <AppText fontSize={13} color={ColorsGlobal.textLight}>{moment(props.data.created_at).format('DD/MM/YYYY hh:mm')}</AppText>
                <AppText fontSize={13} color={ColorsGlobal.main2}>{'Số dư: ' + NumberFormat(props.data.after_balance) + ' điểm'}</AppText>
            </AppView>
        </AppView>
    )

}