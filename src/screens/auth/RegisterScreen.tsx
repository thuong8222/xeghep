import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView } from "react-native";
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


type RegisterScreenNavProp = NativeStackNavigationProp<AuthStackParamList, "LoginScreen">;

interface Props {
  navigation: RegisterScreenNavProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState();
  const [isFormValid, setIsFocused] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleLogin = () => {
   navigation.navigate("LoginScreen");

  };

  const gotoTerms = () => { }
  const gotoPolicy = () => { }
  return (

    <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={styles.container}>
        <AppView flex={1} justifyContent="center" >

          <AppView justifyContent="center" alignItems="center" gap={16}>
            {/* <FastImage source={logo} styles={styles.logo}  /> */}
            <Image source={logo} style={styles.logo} />
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
          <AppView gap={16} marginTop={32}>
          <AppInput label="Tên hiển thị"
              value={username}
              onChangeText={setUsername}
              placeholder="Nhập tên hiển thị"
            />
            <AppInput label="Số điện thoại"
              value={username}
              keyboardType='decimal-pad'
              onChangeText={setUsername}
              placeholder="Nhập số điện thoại"
            />
              <AppInput label="Khu vực (chọn tỉnh/thành)"
              value={username}
              type="select"
              onChangeText={setUsername}
              placeholder="Khu vực (chọn tỉnh/thành)"
            />
            <AppInput label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              type={'password'}
            />
               <AppInput label="Xác nhận mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="Xác nhận mật khẩu"
              secureTextEntry
              type={'password'}

            />
          </AppView>
        
          <AppView marginTop={32}>
          <ButtonSubmit title="Đăng ký"
            isLoading={loading}
            onPress={handleLogin}
            disabled={!isFormValid} />
                 </AppView>
          <AppView marginTop={24} justifyContent="center" alignItems="center" row gap={12}>

            <AppText  >
              Bạn đã có tài khoản?
            </AppText>
            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <AppText
                style={{ textDecorationLine: 'underline', fontWeight:600 }}>
                Đăng nhập
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

export default RegisterScreen;

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
