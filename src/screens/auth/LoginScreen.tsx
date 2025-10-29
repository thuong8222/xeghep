import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import ButtonSubmit from "../../components/common/ButtonSubmit";
import Container from "../../components/common/Container";
import AppView from "../../components/common/AppView";
import FastImage from "react-native-fast-image";
import AppText from "../../components/common/AppText";
import {logo} from "../../assets/images";
import { RootStackParamList } from "../../navigation/RootNavigator";


type LoginScreenNavProp = StackNavigationProp<RootStackParamList, "ChatScreen">;

interface Props {
  navigation: LoginScreenNavProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState();
  const [isFormValid, setIsFocused] = useState(false);
  const handleLogin = () => {
    // Giả sử xác thực thành công
    navigation.navigate("ChatScreen", { username });
  };
  const gotoRegiste = () => {
    // Điều hướng đến màn hình đăng ký

  };
  const ForgotPassword =()=>{

  }

  return (
 
      <ScrollView style={{flexGrow: 1}} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
           <View style={styles.container}>
      <AppView justifyContent="center" alignItems="center" marginBottom={20} gap={12}>
        {/* <FastImage source={logo} styles={styles.logo}  /> */}
        <Image source={logo} style={styles.logo}  />
        <AppText
          style={{
            fontSize: 24,
            color: '#007927',
            textAlign: 'center',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}>
          {'Đăng nhập'}
        </AppText>
      </AppView>

      <AppInput label="Tên đăng nhập *"
        value={username}
        onChangeText={setUsername}
        placeholder="Nhập tên đăng nhập"
      />
      <AppInput label="Mật khẩu *"
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu"
        secureTextEntry
      />
      <TouchableOpacity onPress={ForgotPassword} disabled={loading}>
          <AppText
            style={[
              styles.forgotPass,
              {
                color: loading ? '#B0B0B0' : '#007927',
              
              },
            ]}>
            Quên mật khẩu?
          </AppText>
        </TouchableOpacity>
      <ButtonSubmit title="ĐĂNG NHẬP"
        isLoading={loading}
        onPress={handleLogin}
        disabled={!isFormValid} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}>
        <AppText style={{ fontSize: 14, color: '#5C5C5C' }}>
          Bạn chưa có tài khoản?
        </AppText>
        <TouchableOpacity onPress={gotoRegiste} disabled={loading}>
          <AppText
            style={{ fontSize: 16, color: loading ? '#B0B0B0' : '#007927' }}>
            Đăng ký ngay
          </AppText>
        </TouchableOpacity>
      </View>
      </View>
      </ScrollView>


  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 , backgroundColor: '#fff', gap:24},
  logo: {
    height: 60,
    width: 167,
    marginBottom: 30,
    alignSelf: 'center',

  },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 6 },
  forgotPass: {
    fontSize: 14,
    textAlign: 'right',
  },
});
