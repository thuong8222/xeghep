import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView, Alert } from "react-native";
import {NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import IconTouch from "../../assets/icons/IconTouch";
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'



type RootNavProp = NativeStackNavigationProp<RootStackParamList>;
type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;
type LoginParamList = AuthNavProp & RootNavProp;

interface Props {
  navigation: LoginParamList;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState();
  const [isFormValid, setIsFocused] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics()


  const handleLogin = () => {

    navigation.navigate('RootNavigator', { screen: 'BottomTabs' });

  };
  const gotoRegiste = () => {
    navigation.navigate("RegisterScreen");

  };
  const ForgotPassword = () => {
    setIsOpenModal(true);
  }
  const gotoTerms = () => { }
  const gotoPolicy = () => { }

  const handleLoginWithBiometric = async () => {
    try {
      // kiểm tra thiết bị có hỗ trợ biometrics không
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();
      if (!available) {
        Alert.alert('Không hỗ trợ biometric trên thiết bị này');
        return;
      }

      // hiện prompt
      const {success, error} = await rnBiometrics.simplePrompt({
        promptMessage: 'Xác thực để đăng nhập',
      });

      if (success) {
        // authenticated locally — bạn có thể set local session/token
        Alert.alert('Xác thực thành công — đăng nhập!');
        // gọi API backend để lấy token nếu cần, hoặc unlock local data
      } else {
        Alert.alert('Xác thực thất bại hoặc bị hủy');
      }
    } catch (e) {
      console.warn(e);
      Alert.alert('Lỗi khi xác thực biometric', e.message || String(e));
    }
  };
  return (

    <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={styles.container}>
        <AppView flex={1} justifyContent="center" >

          <AppView justifyContent="center" alignItems="center" marginBottom={20} gap={16}>
         
            <Image source={logo} style={styles.logo} />
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
          <AppView gap={16} marginTop={32}>
            <AppInput label="Số điện thoại"
              value={username}
              keyboardType={'decimal-pad'}
              onChangeText={setUsername}
              placeholder="Nhập số điện thoại"
            />
            <AppInput label="Mật khẩu"
            type={'password'}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              secureTextEntry
            />
          </AppView>
          <AppView row justifyContent="space-between" marginTop={18}  alignItems="center">
            <AppButton onPress={handleLoginWithBiometric} disabled={loading} row gap={6}>
              <IconTouch />
              <AppText fontSize={18} lineHeight={26} >
                Đăng nhập bằng vân tay
              </AppText>
            </AppButton>
            <TouchableOpacity onPress={ForgotPassword} disabled={loading}>
              <AppText fontSize={18} lineHeight={26}
                style={{ color: ColorsGlobal.main, textDecorationLine: 'underline' }}>
                Quên mật khẩu
              </AppText>
            </TouchableOpacity>
          </AppView>
<AppView marginTop={32}>
<ButtonSubmit title="Đăng nhập" 
            isLoading={loading}
            onPress={handleLogin}
            
         />
</AppView>
          
          <AppView marginTop={24} justifyContent="center" alignItems="center" row gap={12}>

            <AppText  >
              Bạn chưa có tài khoản?
            </AppText>
            <TouchableOpacity onPress={gotoRegiste} disabled={loading}>
              <AppText
                style={{ textDecorationLine: 'underline' ,fontWeight:600 }}>
                Đăng ký ngay
              </AppText>
            </TouchableOpacity>
          </AppView>

        </AppView>
        <AppView justifyContent="center" alignItems="flex-end" row gap={12}>
          <TouchableOpacity onPress={gotoTerms} disabled={loading}>
            <AppText
              style={{ color: ColorsGlobal.textLight }}>
               Điều khoản sử dụng   |
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoPolicy} disabled={loading}>
            <AppText
              style={{ color: ColorsGlobal.textLight }}>
              Chính sách riêng tư
            </AppText>
          </TouchableOpacity>
        </AppView>
      </View>

    </ScrollView>


  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: ColorsGlobal.backgroundWhite },
  logo: {
    height: 68,
    width: 180,

    alignSelf: 'center',

  },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 6 },
  forgotPass: {
    fontSize: 14,
    textAlign: 'right',
  },
});
