import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import AppInput from '../../components/common/AppInput'
import ButtonSubmit from '../../components/common/ButtonSubmit'
import { NumberFormat, validatePoint, validatePrice } from '../../utils/Helper'

export default function PointAddScreen() {
    const [amountPoint, setAmountPoint] = useState('');
    const [pricePoint, setPricePoint] = useState('');
    const [priceError, setPriceError] = useState('');
    const [pointError, setPointError] = useState('');
    const postBuyPoint = () => {
        console.log('postBuyPoint');
        if (pointError || priceError) {
            Alert.alert('Dữ liệu không hợp lệ')
            console.log('❌ Dữ liệu không hợp lệ');
            return;
        }
        // ✅ Gửi dữ liệu không có dấu chấm
        console.log('✅ Gửi dữ liệu:', {
            amountPoint: amountPoint,
            pricePoint: pricePoint,
        });
    };
    return (
        <AppView flex={1} padding={16} backgroundColor={ColorsGlobal.backgroundWhite} gap={24}>
            <AppInput
                value={NumberFormat(amountPoint)}
                onChangeText={(text) => {
                    setAmountPoint(text)
                    setPointError(validatePoint(text, 200))
                }}
                label='Số điểm bán'
                placeholder='Nhập số lượng điểm' keyboardType='decimal-pad'
                error={pointError} />
            <AppInput
                value={NumberFormat(pricePoint)}
                onChangeText={(text) => {
                    setPricePoint(text);
                    setPriceError(validatePrice(text))
                }}
                label='Giá tiền'
                placeholder='Nhập giá ...K/ điểm' keyboardType='decimal-pad'
                error={priceError} />
            <ButtonSubmit title='Đăng bán' onPress={postBuyPoint} />

        </AppView>
    )
}

