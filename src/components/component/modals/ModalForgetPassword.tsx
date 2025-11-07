import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppModal from '../../common/AppModal'
import AppText from '../../common/AppText';
import AppInput from '../../common/AppInput';
import ButtonSubmit from '../../common/ButtonSubmit';
import AppView from '../../common/AppView';
import { validatePhoneNumber } from '../../../utils/Helper';


type ModalForgetProps = {
  isVisible: boolean;
  onRequestClose: () => void;
}
export default function ModalForgetPassword({ isVisible, onRequestClose }: ModalForgetProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const RequestGetNewPassword = () => {
    console.log('RequestGetNewPassword')
  }
  return (
    <AppModal isVisible={isVisible} onClose={onRequestClose} heightPercent={0.6} >
      <AppText textAlign='center' bold fontSize={18}>{'Quên mật khẩu'}</AppText>
      <AppView gap={24} marginTop={30}>
        <AppInput label='Số điện thoại' value={phoneNumber} onChangeText={(text) => {
          setPhoneNumber(text)
          setPhoneNumberError(validatePhoneNumber(text))
        }}
          error={phoneNumberError} placeholder='Nhập số điện thoại đăng ký tài khoản' keyboardType={'decimal-pad'} />
        <ButtonSubmit title='Gửi yêu cầu' onPress={RequestGetNewPassword} />
      </AppView>
    </AppModal>
  )
}

