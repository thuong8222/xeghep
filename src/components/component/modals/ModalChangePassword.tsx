import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppModal from '../../common/AppModal'
import AppText from '../../common/AppText';
import AppInput from '../../common/AppInput';
import ButtonSubmit from '../../common/ButtonSubmit';
import AppView from '../../common/AppView';
import { validateConfirmPassword, validatePassword } from '../../../utils/Helper';
import { useDriverApi } from '../../../redux/hooks/userDriverApi';

type ModalForgetProps = {
  isVisible: boolean;
  onRequestClose: () => void;
}
export default function ModalChangePassword({ isVisible, onRequestClose }: ModalForgetProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newConfirmPasswordError, setNewConfirmPasswordError] = useState('');
  const { changePassword, loading, successMessage, error, clear } = useDriverApi();

const handleChangePassword = async () => {
  try {
    await changePassword({
      current_password: oldPassword,
      password: newPassword,
      confirm_password: newConfirmPassword,
    });
    onRequestClose()
  } catch (err) {
    console.log('Lỗi đổi mật khẩu:', err);
  }
};
  
  // Hàm validate khi người dùng nhập xác nhận mật khẩu
  const handleConfirmPasswordChange = (text: string) => {
    setNewConfirmPassword(text);
    // Kiểm tra xem xác nhận mật khẩu có khớp với mật khẩu không
    const passwordErrorMessage = validatePassword(text);
    const confirmPasswordErrorMessage = validateConfirmPassword({ value: text, password: newPassword });

    // Cập nhật lỗi cho xác nhận mật khẩu
    if (passwordErrorMessage || confirmPasswordErrorMessage) {
      setNewConfirmPasswordError(passwordErrorMessage || confirmPasswordErrorMessage);
    } else {
      setNewConfirmPasswordError('');
    }
  };
  return (
    <AppModal isVisible={isVisible} onClose={onRequestClose} heightPercent={0.6}>
      <AppText textAlign='center' bold fontSize={18}>{'Thay đổi mật khẩu'}</AppText>
      <AppView gap={24} marginTop={30}>
        <AppInput label='Mật khẩu cũ' value={oldPassword}
          onChangeText={(text) => {
            setOldPassword(text)
            setOldPasswordError(validatePassword(text))
          }}
          error={oldPasswordError}
          placeholder='Nhập mật khẩu cũ'
          type='password' />
        <AppInput label='Mật khẩu mới' value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text)
            setNewPasswordError(validatePassword(text))
          }}
          error={newPasswordError}
          placeholder='Nhập mật khẩu mới'
          type='password' />
        <AppInput
          label='Nhập lại mật khẩu '
          value={newConfirmPassword}
          onChangeText={handleConfirmPasswordChange}
          error={newConfirmPasswordError}
          placeholder='Nhập lại mật khẩu' type='password' />
        <ButtonSubmit title='Gửi yêu cầu' onPress={handleChangePassword} />
      </AppView>
    </AppModal>
  )
}

