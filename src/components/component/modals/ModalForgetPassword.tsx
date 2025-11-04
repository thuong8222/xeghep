import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppModal from '../../common/AppModal'
import AppText from '../../common/AppText';
import AppInput from '../../common/AppInput';
import ButtonSubmit from '../../common/ButtonSubmit';
import AppView from '../../common/AppView';


type ModalForgetProps = {
  isVisible: boolean;
  onRequestClose: () => void;
}
export default function ModalForgetPassword({ isVisible, onRequestClose }: ModalForgetProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const RequestGetNewPassword = () => {
    console.log('RequestGetNewPassword')
  }
  return (
    <AppModal isVisible={isVisible} onClose={onRequestClose} >
      <AppText textAlign='center' bold fontSize={18}>{'Quên mật khẩu'}</AppText>
      <AppView gap={24} marginTop={30}>
        <AppInput label='Số điện thoại' value={phoneNumber} onChangeText={(text) => setPhoneNumber(text)} placeholder='Nhập số điện thoại đăng ký tài khoản' keyboardType={'decimal-pad'} />
        <ButtonSubmit title='Gửi yêu cầu' onPress={RequestGetNewPassword} />
      </AppView>
    </AppModal>
  )
}

const styles = StyleSheet.create({})