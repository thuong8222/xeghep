import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import AppText from '../../components/common/AppText'


import ModalUploadCarImage from '../../components/component/modals/ModalUploadCarImage'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootParamList } from '../../../App'
import ModalChangePassword from '../../components/component/modals/ModalChangePassword'

import FunctionSection from '../../components/component/FunctionSection'
import IconUser from '../../assets/icons/IconUser'
import { useDriverApi } from '../../redux/hooks/userDriverApi'

type AccountScreenNavProp = NativeStackNavigationProp<RootParamList>;

interface Props {
  navigation: AccountScreenNavProp;
}
export default function AccountScreen({ navigation }: Props) {

  const { driver, loading, error, successMessage, getDriver, clear } = useDriverApi();


  const [isModalChangePw, setIsModalChangePw] = useState(false);



  // Lấy thông tin driver khi vào màn hình
  useEffect(() => {
    if (!driver) {
      getDriver().catch(err => {
        console.log('Lỗi lấy thông tin driver:', err);
      });
    }
  }, [driver]);

  // Hiện thông báo error hoặc success
  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error, [{ text: 'OK', onPress: () => clear() }]);
    }
    if (successMessage) {
      Alert.alert('Thành công', successMessage, [{ text: 'OK', onPress: () => clear() }]);
    }
  }, [error, successMessage]);

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
      screen: 'BottomTabs',       // bước 1: đi vào BottomTabs
      params: {
        screen: 'AccountTabs',    // bước 2: vào AccountTabs
        params: {
          screen: 'AccountInfoScreen',  // bước 3: vào màn AccountInfoScreen
          params: {
            data: driver,              // truyền object driver
          },
        },
      },
    });
  }
  const gotoInfoCar = () => {
    navigation.navigate('RootNavigator', {
      screen: 'BottomTabs',      // bước 1: đi vào bottom tabs
      params: {
        screen: 'AccountTabs',       // bước 2: vào account tab
        params: {
          screen: 'CarInfoScreen',
          params: {
            data: driver,              // truyền object driver
          },
        }
      }
    });
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: ColorsGlobal.backgroundWhite }}>
      <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16} gap={12}>
        <AppView justifyContent='center' alignItems='center' paddingBottom={10} gap={8} >
          {/* {driver?.image_car ?
            <Image
              source={{ uri: driver?.image_car }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 999,
              }}
              resizeMode="cover"
            />
            : */}
          <AppView backgroundColor={ColorsGlobal.backgroundGray} radius={999} padding={20}>
            <IconUser size={100} />
          </AppView>
          {/* } */}
          <AppView alignItems='center'>
            <AppText bold color={ColorsGlobal.main}>{driver?.full_name}</AppText>
            {/* <AppText color={ColorsGlobal.main2}>{'Tài xế'}</AppText> */}
          </AppView>

        </AppView>
        <AppView gap={6} height={'auto'} >
          <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Tài khoản'}</AppText>
          <FunctionSection label='Thông tin cá nhân' onPress={gotoInfoAccount} data={driver} />
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
            <FunctionSection label='Lịch sử mua/bán chuyến' onPress={gotoHistoryBuySalePoint} />
            <FunctionSection label='Danh sách điểm' onPress={gotoHistoryBuySalePoint} />
            <FunctionSection label='Đăng xuất' onPress={Logout} />
          </AppView>

        </AppView>


        <ModalChangePassword isVisible={isModalChangePw} onRequestClose={() => setIsModalChangePw(false)} />
      </AppView>
    </ScrollView>
  )
}

