import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import ButtonSubmit from "../../components/common/ButtonSubmit";

import AppView from "../../components/common/AppView";
import FastImage from "react-native-fast-image";
import AppText from "../../components/common/AppText";
import { logo } from "../../assets/images";

import { StyleGlobal } from "../../components/base/StyleGlobal";
import { ColorsGlobal } from "../../components/base/Colors/ColorsGlobal";

import IconTouch from "../../assets/icons/IconTouch";
import ReactNativeBiometrics from 'react-native-biometrics'
import { RootParamList } from "../../../App";
import ModalForgetPassword from "../../components/component/modals/ModalForgetPassword";
import { validatePassword, validatePhoneNumber } from "../../utils/Helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthApi } from "../../redux/hooks/useAuthApi";
import Container from "../../components/common/Container";
import { useSocket } from "../../context/SocketContext";
import { useAppContext } from "../../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginParamList = NativeStackNavigationProp<RootParamList>;

interface Props {
  navigation: LoginParamList;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, token, loading, error, successMessage, clear } = useAuthApi();
  const [phoneNumber, setPhoneNumber] = useState("0987987987");
  const [password, setPassword] = useState("Admin123456@");
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
const {setCurrentDriver } = useAppContext();

  const [isOpenModal, setIsOpenModal] = useState(false);


  const rnBiometrics = new ReactNativeBiometrics()
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

  const handleLogin = async () => {
    if (phoneNumberError || passwordError || !phoneNumber || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin hợp lệ');
      return;
    }

    try {
      await login({ phone: phoneNumber, password });
     navigation.navigate('RootNavigator');
      setCurrentDriver(JSON.parse((await AsyncStorage.getItem("driver")) || 'null'));
    } catch (err: any) {
      Alert.alert('Đăng nhập thất bại', err || 'Có lỗi xảy ra');
    }
  };



  const gotoRegister = () => {
    navigation.navigate('Auth', { screen: 'RegisterScreen' });

  };
  const ForgotPassword = () => {
    setIsOpenModal(true);
  }
  const gotoTerms = () => {
    navigation.navigate('Auth', {
      screen: 'BlankScreen',
      params: { typeScreen: 'terms' }
    });

  }
  const gotoPolicy = () => {
    navigation.navigate('Auth', {
      screen: 'BlankScreen',
      params: { typeScreen: 'privacy' }
    })

  }

  const handleLoginWithBiometric = async () => {
    try {
      // kiểm tra thiết bị có hỗ trợ biometrics không
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        Alert.alert('Không hỗ trợ biometric trên thiết bị này');
        return;
      }

      // hiện prompt
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage: 'Xác thực để đăng nhập',
      });

      if (success) {
        // authenticated locally — bạn có thể set local session/token
        Alert.alert('Xác thực thành công — đăng nhập!');
        handleLogin()
        // gọi API backend để lấy token nếu cần, hoặc unlock local data
      } else {
        Alert.alert('Xác thực thất bại hoặc bị hủy');
      }
    } catch (e) {
      console.warn(e);
      Alert.alert('Lỗi khi xác thực biometric', e?.message || String(e));
    }
  };
  const insets = useSafeAreaInsets()
  // const { isConnected } = useSocket();
  return (

    <ScrollView style={{ flexGrow: 1, backgroundColor: ColorsGlobal.backgroundWhite }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', }} showsVerticalScrollIndicator={false}>
      <Container showTopInset loading={loading}>
        <AppView flex={1} justifyContent="center" >

          <AppView justifyContent="center" alignItems="center" marginBottom={20} gap={16}>
          {/* <AppText>Socket status: {isConnected ? "✅ Connected" : "❌ Disconnected"}</AppText> */}
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <AppView gap={6}>
              <AppText
                style={StyleGlobal.title1}>
                {'Đăng nhập'}
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
              <AppInput label="Số điện thoại"
                value={phoneNumber}
                keyboardType={'decimal-pad'}
                onChangeText={(text) => {
                  setPhoneNumber(text)
                  setPhoneNumberError(validatePhoneNumber(text))
                }}
                error={phoneNumberError}
                placeholder="Nhập số điện thoại"

              />
              <AppInput label="Mật khẩu"
                type={'password'}
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setPasswordError(validatePassword(text))
                }}
                error={passwordError}
                placeholder="Nhập mật khẩu"

              />

            </AppView>
          </KeyboardAvoidingView>
          <AppView row justifyContent="space-between" marginTop={18} alignItems="center">
            <AppButton onPress={handleLoginWithBiometric} disabled={loading} row gap={4}>
              <IconTouch />
              <AppText  >
                Đăng nhập bằng vân tay
              </AppText>
            </AppButton>
            <AppButton onPress={ForgotPassword} disabled={loading}>
              <AppText
                style={{ color: ColorsGlobal.main, textDecorationLine: 'underline' }}>
                Quên mật khẩu
              </AppText>
            </AppButton>
          </AppView>
          <AppView marginTop={24}>
            <ButtonSubmit title="Đăng nhập"
              isLoading={loading}
              onPress={handleLogin}
            />
          </AppView>

          <AppView marginTop={24} justifyContent="center" alignItems="center" row gap={12}>

            <AppText  >
              Bạn chưa có tài khoản?
            </AppText>
            <TouchableOpacity onPress={gotoRegister} disabled={loading}>
              <AppText
                style={{ textDecorationLine: 'underline', fontWeight: 600 }}>
                Đăng ký ngay
              </AppText>
            </TouchableOpacity>
          </AppView>

        </AppView>
        <AppView justifyContent="center" alignItems="flex-end" row gap={12} paddingBottom={6}>
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
      </Container>
      <ModalForgetPassword isVisible={isOpenModal} onRequestClose={() => setIsOpenModal(false)} />
    </ScrollView>


  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: ColorsGlobal.backgroundWhite },
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
