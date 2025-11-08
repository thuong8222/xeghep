import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
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


export default function AccountInfoScreen() {
    const [nameDisplay, setNameDisplay] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [address, setAddress] = useState('');
    const [isDisplayModalUploadImage, setIsDisplayModalUploadImage] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const SaveChangeInfo = () => {
        console.log('first')
    }
    const handleUploadPress = () => {
        console.log('handleUploadPress')
        setIsDisplayModalUploadImage(true);
    }

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

                    />

                </AppView>
                <AppView row>
                    <AppInput label="Địa chỉ"
                        value={address}
                        keyboardType={'decimal-pad'}
                        onChangeText={(text) => {
                            setAddress(text)
                            setPhoneNumberError(validatePhoneNumber(text))
                        }}
                        error={phoneNumberError}
                        placeholder="Chọn địa chỉ"

                    />

                </AppView>
            </AppView>
            <AppView>
                <ButtonSubmit title='Lưu thay đổi' onPress={SaveChangeInfo} />
            </AppView>
            <ModalUploadCarImage isDisplay={isDisplayModalUploadImage} onClose={() => setIsDisplayModalUploadImage(false)}
                onSelectImage={(uri) => setImageUri(uri)} />
        </AppView>
    )
}
