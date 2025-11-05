import { Alert, StyleSheet, Text, View } from 'react-native'
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
export default function ModalChangePassword({ isVisible, onRequestClose }: ModalForgetProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const RequestGetNewPassword = () => {
  Alert.alert('Xeghep', 'Gửi yêu cầu thành công!')
    console.log('RequestGetNewPassword')
  }
  return (
    <AppModal isVisible={isVisible} onClose={onRequestClose}  heightPercent={0.6}>
      <AppText textAlign='center' bold fontSize={18}>{'Thay đổi mật khẩu'}</AppText>
      <AppView gap={24} marginTop={30}>
        <AppInput label='Mật khẩu cũ' value={oldPassword} onChangeText={(text) => setOldPassword(text)} placeholder='Nhập mật khẩu cũ' type='password' />
        <AppInput label='Mật khẩu mới' value={newPassword} onChangeText={(text) => setNewPassword(text)} placeholder='Nhập mật khẩu mới' type='password' />
        <AppInput label='Nhập lại mật khẩu ' value={newConfirmPassword} onChangeText={(text) => setNewConfirmPassword(text)} placeholder='Nhập lại mật khẩu' type='password' />
        <ButtonSubmit title='Gửi yêu cầu' onPress={RequestGetNewPassword} />
      </AppView>
    </AppModal>
  )
}

const styles = StyleSheet.create({})