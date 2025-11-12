import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppView from '../../components/common/AppView'
import AppInput from '../../components/common/AppInput'
import { validatePhoneNumber } from '../../utils/Helper';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconUser from '../../assets/icons/IconUser';
import ButtonSubmit from '../../components/common/ButtonSubmit';
import AppButton from '../../components/common/AppButton';
import ModalUploadCarImage from '../../components/component/modals/ModalUploadCarImage';
import AppText from '../../components/common/AppText';
import IconCamera from '../../assets/icons/IconCamera';

import { RouteProp, useRoute } from '@react-navigation/native';
import { AccountTabsParamList } from '../../navigation/menuBottomTabs/AccountTabs';
import { useDriverApi } from '../../redux/hooks/userDriverApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootParamList } from '../../../App';
import ModalOnlySelectProvince from '../../components/component/modals/ModalOnlySelectProvince';
type AccountScreenNavProp = NativeStackNavigationProp<RootParamList>;

interface Props {
    navigation: AccountScreenNavProp;
}

export default function AccountInfoScreen({ navigation }: Props) {
    // --- gọi hook useRoute bên trong component ---
    const route = useRoute<RouteProp<AccountTabsParamList, 'AccountInfoScreen'>>();
    const driverPre = route.params.data;
    const { driver, loading, error, successMessage, editDriver, clear } = useDriverApi();
 

    const [nameDisplay, setNameDisplay] = useState(driverPre?.full_name || '');
    const [numberPhone, setNumberPhone] = useState(driverPre?.phone || '');
    const [address, setAddress] = useState(driverPre?.address || '');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [isDisplayModalUploadImage, setIsDisplayModalUploadImage] = useState(false);
    const [imageUri, setImageUri] = useState(driverPre?.image_car || '');
    const [isOpenModal, setIsOpenModal] = useState(false);
    useEffect(() => {
        if (successMessage) {
            Alert.alert('Thành công', successMessage, [
                {
                    text: 'OK',
                    onPress: () => {
                        clear();
                        navigation.navigate('RootNavigator');
                    },
                },
            ]);
        }

        if (error) {
            Alert.alert('Lỗi', error, [{ text: 'OK', onPress: clear }]);
        }
    }, [successMessage, error]);



    const SaveChangeInfo = async () => {
        try {
            // Chuẩn bị dữ liệu từ state
            const model = {
                full_name: nameDisplay,          // từ state nameDisplay

                address: address,                // từ state address
                image_car: imageUri,             // từ state imageUri
                license_number: '',              // nếu chưa có
                name_car: '',                    // nếu chưa có
                model_car: '',                   // nếu chưa có
                year_car: '',                    // nếu chưa có
                color_car: 'red',                // hoặc từ state/color picker
                experience_years: '',            // nếu chưa có
            };

            // Gọi API thông qua hook hoặc dispatch redux
            const res = await editDriver(model);
         
        } catch (err: any) {
            Alert.alert('Thất bại', err?.message || 'Có lỗi xảy ra');
        }
    };
    const handleUploadPress = () => {
        setIsDisplayModalUploadImage(true);
    }
    const openSelectProvince = () => {

        setIsOpenModal(true);
    }
    const handleProvinceSelected = (data: { province: any }) => {
        setAddress(data.province.name); // cập nhật state với tên tỉnh
        setIsOpenModal(false); // đóng modal
    };

    return (
        <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16} >
            <AppButton justifyContent='center' alignItems='center' paddingBottom={40} >
                <AppView justifyContent="center" alignItems="center" marginTop={8}>
                    <View style={{ position: 'relative' }}>
                        {imageUri ?
                            <Image
                                source={{ uri: imageUri }}
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 999,
                                }}
                                resizeMode="cover"
                            /> :
                            <AppView backgroundColor={ColorsGlobal.backgroundGray} radius={999} padding={20}>
                                <IconUser size={100} />
                            </AppView>}
                        <AppButton
                            onPress={handleUploadPress}
                            style={{
                                position: 'absolute',
                                top: -8,
                                right: -6,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <IconCamera size={20} />
                        </AppButton>
                    </View>
                </AppView>
            </AppButton>
            <AppView gap={8} flex={1} paddingTop={24}>
                <AppView row>
                    <AppInput value={nameDisplay} onChangeText={(text) => setNameDisplay(text)} placeholder='Nhập tên hiển thị' label={'Tên hiển thị'} />
                </AppView>
                <AppView row>
                    <AppInput label="Số điện thoại"
                        value={numberPhone}
                        keyboardType={'decimal-pad'}
                        onChangeText={(text) => {
                            setNumberPhone(text)
                            setPhoneNumberError(validatePhoneNumber(text))
                        }}
                        error={phoneNumberError}
                        placeholder="Nhập số điện thoại"
                        editable={false}
                    />

                </AppView>
                <AppView row>
                    <AppInput label="Địa chỉ"
                        value={address}

                        onChangeText={(text) => {
                            setAddress(text)

                        }}
                        error={phoneNumberError}
                        placeholder="Chọn địa chỉ"
                        type='select'



                        toggleSelect={openSelectProvince}
                    />

                </AppView>
            </AppView>
            <AppView>
                <ButtonSubmit title='Lưu thay đổi' onPress={SaveChangeInfo} />
            </AppView>
            <ModalUploadCarImage isDisplay={isDisplayModalUploadImage} onClose={() => setIsDisplayModalUploadImage(false)}
                onSelectImage={(uri) => setImageUri(uri)} />
            <ModalOnlySelectProvince
                isVisible={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                onSelected={handleProvinceSelected}
            />
        </AppView>
    )
}
