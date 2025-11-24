import { Alert } from 'react-native';
import React, { useState } from 'react';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import AppInput from '../../common/AppInput';
import ButtonSubmit from '../../common/ButtonSubmit';
import AppView from '../../common/AppView';
import { validatePhoneNumber } from '../../../utils/Helper';


type ModalForgetProps = {
  isVisible: boolean;
  onRequestClose: () => void;
};

export default function ModalForgetPassword({ isVisible, onRequestClose }: ModalForgetProps) {
  const [step, setStep] = useState(1); // 1 = phone, 2 = otp, 3 = new password

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const [confirmation, setConfirmation] = useState<any>(null);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // STEP 1: Gửi OTP
  // -----------------------------------------
  const handleSendOtp = async () => {
    const error = validatePhoneNumber(phoneNumber);
    setPhoneNumberError(error);
    if (error) return;

    try {
      setLoading(true);

      let phone = phoneNumber;
      if (phone.startsWith('0')) phone = '+84' + phone.substring(1);

      // const confirmObj = await auth().signInWithPhoneNumber(phone);
      // setConfirmation(confirmObj);

      setLoading(false);
      setStep(2); // chuyển sang nhập OTP

    } catch (e) {
      console.log(e);
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể gửi mã OTP');
    }
  };

  // -----------------------------------------
  // STEP 2: Xác thực OTP
  // -----------------------------------------
  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP');
      return;
    }

    try {
      setLoading(true);

      await confirmation.confirm(otpCode);

      setLoading(false);
      setStep(3); // chuyển sang đặt mật khẩu

    } catch (e) {
      console.log(e);
      setLoading(false);
      Alert.alert('Sai OTP', 'Mã OTP không đúng.');
    }
  };

  // -----------------------------------------
  // STEP 3: Gửi API đổi mật khẩu
  // -----------------------------------------
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
      return;
    }

    try {
      setLoading(true);

      let phone = phoneNumber;
      if (phone.startsWith('0')) phone = '+84' + phone.substring(1);

      const res = await fetch("https://your_api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          password: newPassword,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data?.success) {
        Alert.alert('Thành công', 'Mật khẩu đã được đặt lại.');
        onRequestClose();
        setStep(1); // reset về đầu
      } else {
        Alert.alert('Lỗi', data?.message || 'Không thể đặt mật khẩu');
      }

    } catch (e) {
      console.log(e);
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể kết nối server');
    }
  };

  // -----------------------------------------
  // UI Render theo từng STEP
  // -----------------------------------------
  const renderStep = () => {

    // STEP 1 — Nhập số điện thoại
    if (step === 1) {
      return (
        <AppView gap={24} marginTop={30}>
          <AppInput
            label='Số điện thoại'
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              setPhoneNumberError(validatePhoneNumber(text));
            }}
            error={phoneNumberError}
            placeholder='Nhập số điện thoại đăng ký'
            keyboardType='phone-pad'
          />

          <ButtonSubmit
            title={loading ? "Đang gửi..." : "Gửi mã OTP"}
            onPress={handleSendOtp}
            disabled={loading}
          />
        </AppView>
      );
    }

    // STEP 2 — Nhập OTP
    if (step === 2) {
      return (
        <AppView gap={24} marginTop={30}>
          <AppText>Mã OTP đã gửi tới {phoneNumber}</AppText>

          <AppInput
            label='Nhập mã OTP'
            value={otpCode}
            onChangeText={setOtpCode}
            placeholder='Nhập mã OTP'
            keyboardType='numeric'
          />

          <ButtonSubmit
            title={loading ? "Đang kiểm tra..." : "Xác thực OTP"}
            onPress={handleVerifyOtp}
            disabled={loading}
          />
        </AppView>
      );
    }

    // STEP 3 — Nhập mật khẩu mới
    return (
      <AppView gap={24} marginTop={30}>
        <AppInput
          label='Mật khẩu mới'
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder='Nhập mật khẩu mới'
          secureTextEntry
        />

        <ButtonSubmit
          title={loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
          onPress={handleResetPassword}
          disabled={loading}
        />
      </AppView>
    );
  };

  return (
    <AppModal isVisible={isVisible} onClose={onRequestClose} heightPercent={0.7}>
      <AppText bold fontSize={18} textAlign='center'>
        Quên mật khẩu
      </AppText>

      {renderStep()}
    </AppModal>
  );
}
