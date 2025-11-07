import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import AppText from '../../components/common/AppText'
import AppInput from '../../components/common/AppInput'
import AppButton from '../../components/common/AppButton'

import ModalUploadCarImage from '../../components/component/modals/ModalUploadCarImage'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootParamList } from '../../../App'
import ModalChangePassword from '../../components/component/modals/ModalChangePassword'
import { validatePhoneNumber, validatePlateVN, validateYear } from '../../utils/Helper'
import FunctionSection from '../../components/component/FunctionSection'

type AccountScreenNavProp = NativeStackNavigationProp<RootParamList>;

interface Props {
  navigation: AccountScreenNavProp;
}
export default function AccountScreen({ navigation }: Props) {
  const [nameDisplay, setNameDisplay] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [nameCar, setNameCar] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [yearCar, setYearCar] = useState('');
  const [yearCarError, setYearCarError] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [licensePlateError, setLicensePlateError] = useState('');
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
  const gotoHistoryBuySalePoint = () => {
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
              onChangeText={(text) => {
                setNumberPhone(text)
                setPhoneNumberError(validatePhoneNumber(text))
              }}
              error={phoneNumberError}
              placeholder="Nhập số điện thoại"

            />
          </AppView>

        </AppView>
        <AppView gap={6} height={'auto'} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Thông tin xe'}</AppText>
          <AppView row gap={20}>
            <AppView flex={1}>
              <AppInput value={nameCar} onChangeText={(text) => setNameCar(text)} placeholder='Nhập tên xe' label={'Tên xe'} />
            </AppView>
            <AppView flex={1}>
              <AppInput label="Năm"
                value={yearCar}
                keyboardType={'decimal-pad'}
                onChangeText={(text) => {
                  setYearCar(text)
                  setYearCarError(validateYear(text))
                }}
                error={yearCarError}
                placeholder="Năm"
              />
            </AppView>
          </AppView>
          <AppView row>
            <AppInput value={licensePlate}
              onChangeText={(text) => {
                setLicensePlate(text)
                setLicensePlateError(validatePlateVN(text))
              }}
              error={licensePlateError}
              placeholder='Biển số xe' label={'Biển số'} />
          </AppView>
          <AppButton row onPress={handleUploadPress}>
            <AppInput onUploadPress={handleUploadPress} value={imageUri} onChangeText={(text) => setImageUri(text)} placeholder='Tải lên hình ảnh xe' label={'Hình ảnh xe'} type='upload' editable={false} />
          </AppButton>
          {imageUri && (
            <AppView justifyContent="center" alignItems="center" marginTop={8}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
                {/* Nút X để xoá ảnh */}
                <AppButton
                  onPress={() => setImageUri(null)}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AppText color="#fff" fontSize={14}>×</AppText>
                </AppButton>
              </View>
            </AppView>
          )}

        </AppView>
        <AppView gap={6} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Tính năng'}</AppText>
          <AppView gap={12}>
            <FunctionSection label='Đổi mật khẩu' onPress={() => setIsModalChangePw(true)} />
            <FunctionSection label='Lịch sử mua/bán điểm' onPress={gotoHistoryBuySalePoint} />
            <FunctionSection label='Đăng xuất' onPress={Logout} />
          </AppView>

        </AppView>
        <ModalUploadCarImage isDisplay={isDisplayModalUploadImage} onClose={() => setIsDisplayModalUploadImage(false)}
          onSelectImage={(uri) => setImageUri(uri)} />
        <ModalChangePassword isVisible={isModalChangePw} onRequestClose={() => setIsModalChangePw(false)} />
      </AppView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})