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
import IconUser from '../../assets/icons/IconUser'

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
  const gotoInfoAccount = () => {
    navigation.navigate('RootNavigator', {
      screen: 'BottomTabs',      // bước 1: đi vào bottom tabs
      params: {
        screen: 'AccountTabs',       // bước 2: vào account tab
        params: {
          screen: 'AccountInfoScreen'

        }
      }
    });
  }
  const gotoInfoCar = () => {
    navigation.navigate('RootNavigator', {
      screen: 'BottomTabs',      // bước 1: đi vào bottom tabs
      params: {
        screen: 'AccountTabs',       // bước 2: vào account tab
        params: {
          screen: 'CarInfoScreen'

        }
      }
    });
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: ColorsGlobal.backgroundWhite }}>
      <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16} gap={12}>
        <AppView justifyContent='center' alignItems='center' paddingBottom={10} gap={8} >
          <AppView backgroundColor={ColorsGlobal.backgroundGray} radius={999} padding={20}>
            <IconUser size={100} />
          </AppView>
          <AppView alignItems='center'>
            <AppText bold color={ColorsGlobal.main}>{'Nguyen van a'}</AppText>
            <AppText color={ColorsGlobal.main2}>{'Tài xế'}</AppText>
          </AppView>

        </AppView>
        <AppView gap={6} height={'auto'} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Tài khoản'}</AppText>
          <FunctionSection label='Thông tin cá nhân' onPress={gotoInfoAccount} />
        </AppView>
        <AppView gap={6} height={'auto'} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Thông tin xe'}</AppText>
          <FunctionSection label='Thông tin xe' onPress={gotoInfoCar} />


        </AppView>
        <AppView gap={6} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Tính năng'}</AppText>
          <AppView gap={8}>
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