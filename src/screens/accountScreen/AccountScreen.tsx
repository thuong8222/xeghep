import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import AppText from '../../components/common/AppText'
import AppInput from '../../components/common/AppInput'
import AppButton from '../../components/common/AppButton'
import IconArrowDown from '../../assets/icons/IconArowDown'
import { useFocusEffect } from '@react-navigation/native'
import ModalUploadCarImage from '../../components/component/modals/ModalUploadCarImage'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootParamList } from '../../../App'
import ModalChangePassword from '../../components/component/modals/ModalChangePassword'

type AccountScreenNavProp = NativeStackNavigationProp<RootParamList>;

interface Props {
  navigation: AccountScreenNavProp;
}
export default function AccountScreen({ navigation }: Props) {
  const [nameDisplay, setNameDisplay] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [isDisplayModalUploadImage, setIsDisplayModalUploadImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isModalChangePw, setIsModalChangePw] = useState(false);
  const handleUploadPress = () => {
    console.log('handleUploadPress')
    setIsDisplayModalUploadImage(true);
  }
  const Logout = () => {
    Alert.alert(
      'Xeghep',
      'Bạn có muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: () => {
            //Xoá token / user state ở redux hay context
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth', state: { routes: [{ name: 'LoginScreen' }] } }],
            });
            console.log('Đã đăng xuất');
          },
        },
      ]
    );

  }
  const gotoHistoryBuySalePoint =()=>{
    console.log('gotoHistoryBuySalePoint')
    navigation.navigate('RootNavigator', {
      screen: 'BottomTabs',      // bước 1: đi vào bottom tabs
      params: {
        screen: 'AccountTabs',       // bước 2: vào account tab
        params: {
          screen: 'HistoryBuySalePoint'// bước 3: tới màn hình History
         
        }
      }
    });
    
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: ColorsGlobal.backgroundWhite }}>
      <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16} gap={24}>
        <AppView gap={6} height={'auto'} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Thông tin cá nhân'}</AppText>
          <AppView row>
            <AppInput value={nameDisplay} onChangeText={(text) => setNameDisplay(text)} placeholder='Nhập tên hiển thị' label={'Tên hiển thị'} />
          </AppView>
          <AppView row>
            <AppInput label="Số điện thoại"
              value={numberPhone}
              keyboardType={'decimal-pad'}
              onChangeText={(text) => setNumberPhone(text)}
              placeholder="Nhập số điện thoại"
            />
          </AppView>

        </AppView>
        <AppView gap={6} height={'auto'} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Thông tin xe'}</AppText>
          <AppView row gap={20}>
            <AppInput value={nameDisplay} onChangeText={(text) => setNameDisplay(text)} placeholder='Nhập tên xe' label={'Tên xe'} />

            <AppInput label="Năm"
              value={numberPhone}
              keyboardType={'decimal-pad'}
              onChangeText={(text) => setNumberPhone(text)}
              placeholder="Năm"
            />
          </AppView>
          <AppView row>
            <AppInput value={nameDisplay} onChangeText={(text) => setNameDisplay(text)} placeholder='Biển số xe' label={'Biển số'} />
          </AppView>
          <AppView row>

            <AppInput onUploadPress={handleUploadPress} value={nameDisplay} onChangeText={(text) => setNameDisplay(text)} placeholder='Tải lên hình ảnh xe' label={'Hình ảnh xe'} type='upload' editable={false} />

          </AppView>
          {imageUri && (
            <>
              <AppView justifyContent='center' alignItems='center'>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 200, height: 200, borderRadius: 12, marginTop: 0 }}
                  resizeMode="cover"
                />
              </AppView>

            </>
          )}
        </AppView>
        <AppView gap={6} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Tính năng'}</AppText>
          <AppView gap={12}>
            <AppButton onPress={()=>setIsModalChangePw(true)} row justifyContent={'space-between'} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={6}>
              <AppText color={ColorsGlobal.textLight} >{'Đổi mật khẩu'}</AppText>
              <IconArrowDown rotate={-90} size={20} />
            </AppButton>
            <AppButton row justifyContent={'space-between'} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={6}>
              <AppText color={ColorsGlobal.textLight} onPress={gotoHistoryBuySalePoint}  >{'Lịch sử mua/bán điểm'}</AppText>
              <IconArrowDown rotate={-90} size={20} />
            </AppButton>
            <AppButton onPress={Logout} row justifyContent={'space-between'} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={6}>
              <AppText color={ColorsGlobal.textLight}  >{'Đăng xuất'}</AppText>
              <IconArrowDown rotate={-90} size={20} />
            </AppButton>
          </AppView>

        </AppView>
        <ModalUploadCarImage isDisplay={isDisplayModalUploadImage} onClose={() => setIsDisplayModalUploadImage(false)}
          onSelectImage={(uri) => setImageUri(uri)} />
          <ModalChangePassword isVisible={isModalChangePw}  onRequestClose={()=>setIsModalChangePw(false)}/>
      </AppView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})