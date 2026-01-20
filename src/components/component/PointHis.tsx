import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppView from '../common/AppView'
import { ColorsGlobal } from '../base/Colors/ColorsGlobal'
import AppText from '../common/AppText'
import { CONSTANT, NumberFormat } from '../../utils/Helper'
import moment from 'moment'
import AppButton from '../common/AppButton'

export default function PointHis({ props, resume }) {

    const statusKey = props?.status;
    const status = CONSTANT.STATUS_POINT[statusKey];
    return (
        <AppView gap={12} radius={12} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColorDark} backgroundColor={ColorsGlobal.backgroundWhite} >



            <AppView row justifyContent={'space-between'}>
                <AppText fontWeight={600}
                    color={ColorsGlobal.main2}>{props.seller.full_name}</AppText>
                <AppText color={ColorsGlobal.main2} fontWeight={600}>{NumberFormat(props.points_amount) + ' điểm'}</AppText>
            </AppView>
            <AppView row justifyContent={'space-between'} alignItems='center'>
                <AppText fontSize={14} lineHeight={20} fontWeight={600} color={ColorsGlobal.textLight}>{moment(props.created_at).format('DD/MM/YYYY')}</AppText>
                <AppView paddingHorizontal={12} backgroundColor={status?.background} paddingVertical={2} style={{ borderRadius: 99 }}>
                    <AppText
                        title={
                            status?.label || props?.status
                        }
                        fontSize={12}
                        color={status?.color}
                    />
                </AppView>
                <AppText fontWeight={700} color={ColorsGlobal.main}>{NumberFormat(Math.round(props.price_per_point)) + 'K/Điểm'}</AppText>
            </AppView>

            {props?.status === 'paused' &&
                <AppButton onPress={() => resume(props.id)} alignItems='center' justifyContent='center' backgroundColor='#EBF5FB' radius={99} paddingVertical={4}>
                    <AppText color={'#2980B9'} fontSize={13} bold title={'Click vào đây để Tiếp tục bán'} />
                </AppButton>}
        </AppView>
    )
}
