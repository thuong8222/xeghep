import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import AppInput from '../../components/common/AppInput'
import ButtonSubmit from '../../components/common/ButtonSubmit'
import { NumberFormat, validatePoint, validatePrice } from '../../utils/Helper'
import AppText from '../../components/common/AppText'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/data/store'
import { createSalePoint, fetchPointsOnSale } from '../../redux/slices/pointSlice'
import moment from 'moment'
import { useAppContext } from '../../context/AppContext'

export default function PointAddScreen({ navigation }) {
    const dispatch = useDispatch<AppDispatch>();
    const { setUpdatePoints } = useAppContext();
    const { loading, error, successMessage } = useSelector(
        (state: RootState) => state.point
    );

    const [amountPoint, setAmountPoint] = useState<Number>();
    const [pricePoint, setPricePoint] = useState<Number>();
    const [priceError, setPriceError] = useState('');
    const [pointError, setPointError] = useState('');
    const [numberBank, setNumberBank] = useState<String>('');
    const [onwer, setOnwer] = useState('');
    const [nameBank, setNameBank] = useState('');



    const postBuyPoint = async () => {

        if (pointError || priceError) {
            Alert.alert('Dữ liệu không hợp lệ');
            return;
        }

        const model = {
            points_amount: Number(amountPoint),
            price_per_point: Number(pricePoint),
            bank_info: {
                bank_name: nameBank,
                account_number: String(numberBank),
                account_name: onwer
            }
        };
        dispatch(createSalePoint(model));

        Alert.alert('Thông báo', 'Thêm lệnh bán chuyến thành công');
        setTimeout(() => { navigation.goBack() }, 1000)


    };
    return (
        <AppView flex={1} padding={16} backgroundColor={ColorsGlobal.backgroundWhite} gap={8}>
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
                placeholder='Nhập giá ...K/ điểm (1K=1000 VND)' keyboardType='decimal-pad'
                error={priceError} />
            <AppView gap={8} paddingVertical={30}>
                <AppText fontSize={13} fontStyle='italic' color={ColorsGlobal.main}>
                    {'\"Nhập thông tin tài khoản ngân hàng của bạn để người mua có thể chuyển khoản cho bạn\"'}
                </AppText>
                <AppInput
                    value={numberBank}
                    onChangeText={(text) => {
                        setNumberBank(text)

                    }}
                    label='Số tài khoản'
                    placeholder='Nhập số tài khoản ngân hàng nhận tiền' keyboardType='decimal-pad'
                />
                <AppInput
                    value={nameBank}
                    onChangeText={(text) => {
                        setNameBank(text)

                    }}
                    label='Tên ngân hàng'
                    placeholder='Nhập tên ngân hàng nhận tiền'
                />
                <AppInput
                    value={onwer}
                    onChangeText={(text) => {
                        setOnwer(text)

                    }}
                    label='Chủ tài khoản'
                    placeholder='Nhập họ tên chủ khoản ngân hàng nhận tiền'
                />
            </AppView>
            <ButtonSubmit title='Đăng bán' onPress={postBuyPoint} isLoading={loading} />

        </AppView>
    )
}

