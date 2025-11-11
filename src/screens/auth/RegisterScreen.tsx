import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import ButtonSubmit from "../../components/common/ButtonSubmit";
import Container from "../../components/common/Container";
import AppView from "../../components/common/AppView";
import FastImage from "react-native-fast-image";
import AppText from "../../components/common/AppText";
import { logo } from "../../assets/images";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { StyleGlobal } from "../../components/base/StyleGlobal";
import { ColorsGlobal } from "../../components/base/Colors/ColorsGlobal";
import { Text } from "react-native-gesture-handler";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import ModalOnlySelectProvince from "../../components/component/modals/ModalOnlySelectProvince";
import { RootParamList } from "../../../App";
import { validateConfirmPassword, validatePassword, validatePhoneNumber } from "../../utils/Helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";




type LoginParamList = NativeStackNavigationProp<RootParamList>;

interface Props {
  navigation: LoginParamList;
}
const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setloading] = useState();
  const [isFormValid, setIsFocused] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const handleLogin = () => {
    navigation.goBack()
  };
const handleRegister =()=>{
  
}
  const gotoTerms = () => {
    navigation.navigate('Auth', {
      screen: 'BlankScreen',
      params: { nameScreen: 'Điều khoản sử dụng' }
    });
  }
  const gotoPolicy = () => {
    navigation.navigate('Auth', {
      screen: 'BlankScreen',
      params: { nameScreen: 'Chính sách riêng tư' }
    })
  }
  const openSelectProvince = () => {

    setIsOpenModal(true);

  }
  const handleProvinceSelected = (data: { province: any }) => {
    setSelectedProvince(data.province.name); // cập nhật state với tên tỉnh
    setIsOpenModal(false); // đóng modal
  };
  // Hàm validate khi người dùng nhập xác nhận mật khẩu
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    // Kiểm tra xem xác nhận mật khẩu có khớp với mật khẩu không
    const passwordErrorMessage = validatePassword(text);
    const confirmPasswordErrorMessage = validateConfirmPassword({ value: text, password });

    // Cập nhật lỗi cho xác nhận mật khẩu
    if (passwordErrorMessage || confirmPasswordErrorMessage) {
      setConfirmPasswordError(passwordErrorMessage || confirmPasswordErrorMessage);
    } else {
      setConfirmPasswordError('');
    }
  };
  const insets = useSafeAreaInsets();
  return (

    <ScrollView style={{ flexGrow: 1, backgroundColor: ColorsGlobal.backgroundWhite }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', }}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <AppView flex={1} justifyContent="center" >

          <AppView justifyContent="center" alignItems="center" gap={16}>
            {/* <FastImage source={logo} styles={styles.logo}  /> */}
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <AppView gap={6}>
              <AppText
                style={StyleGlobal.title1}>
                {'Đăng ký'}
              </AppText>
              <AppText
                style={StyleGlobal.textNormal}>
                {'Chào mừng bạn đến với Xe ghép'}
              </AppText>
            </AppView>

          </AppView>
          <KeyboardAvoidingView

            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <AppView gap={16} marginTop={32}>
              <AppInput label="Tên hiển thị"
                value={username}
                onChangeText={setUsername}
                placeholder="Nhập tên hiển thị"
              />
              <AppInput label="Số điện thoại"
                value={phoneNumber}
                keyboardType='decimal-pad'
                onChangeText={(text) => {
                  setPhoneNumber(text)
                  setPhoneNumberError(validatePhoneNumber(text))
                }}
                error={phoneNumberError}
                placeholder="Nhập số điện thoại"
              />
              <AppButton onPress={openSelectProvince}>
                <AppInput label="Khu vực (chọn tỉnh/thành)"
                  value={selectedProvince}
                  type="select"
                  editable={false}
                  placeholder="Khu vực (chọn tỉnh/thành)"
                  toggleSelect={openSelectProvince}
                />
              </AppButton>

              <AppInput label="Mật khẩu"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setPasswordError(validatePassword(text))
                }}
                error={passwordError}
                placeholder="Nhập mật khẩu"
                type={'password'}
              />
              <AppInput label="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                placeholder="Xác nhận mật khẩu"
                type={'password'}
                error={confirmPasswordError}
              />
            </AppView>
          </KeyboardAvoidingView>
          <AppView marginTop={24}>
            <ButtonSubmit title="Đăng ký"
              isLoading={loading}
              onPress={handleRegister}
            />
          </AppView>
          <AppView marginTop={24} justifyContent="center" alignItems="center" row gap={12}>

            <AppText  >
              Bạn đã có tài khoản?
            </AppText>
            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <AppText
                style={{ textDecorationLine: 'underline', fontWeight: 600 }}>
                Đăng nhập
              </AppText>
            </TouchableOpacity>
          </AppView>

        </AppView>
        <AppView justifyContent="center" alignItems="flex-end" row gap={12} paddingBottom={6} >
          <AppButton onPress={gotoTerms} disabled={loading}>
            <AppText
              style={{ color: ColorsGlobal.textLight }}>
              Điều khoản sử dụng
            </AppText>
          </AppButton>
          <AppView width={1} backgroundColor={ColorsGlobal.textLight} height={'100%'} />
          <AppButton onPress={gotoPolicy} disabled={loading}>
            <AppText
              style={{ color: ColorsGlobal.textLight }}>
              Chính sách riêng tư
            </AppText>
          </AppButton>
        </AppView>
      </View>
      <ModalOnlySelectProvince
        isVisible={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSelected={handleProvinceSelected} // callback nhận dữ liệu
      />
    </ScrollView>


  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: ColorsGlobal.backgroundWhite, },
  logo: {
    height: 73,
    width: 180,
    alignSelf: 'center',

  },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 6 },
  forgotPass: {
    fontSize: 14,
    textAlign: 'right',
  },
});
