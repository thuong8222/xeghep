import React, { useState } from 'react';
import { View, Image, Alert, Platform, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import AppModal from '../../common/AppModal';
import AppButton from '../../common/AppButton';
import AppText from '../../common/AppText';

import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import IconArrowDown from '../../../assets/icons/IconArowDown';


interface ModalUploadCarImageProps {
  isDisplay: boolean;
  onClose: () => void;
  onSelectImage: (uri: string) => void;
}
export default function ModalUploadCarImage({ isDisplay, onClose, onSelectImage }: ModalUploadCarImageProps) {

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Quyền truy cập camera',
            message: 'Ứng dụng cần quyền truy cập để chụp ảnh.',
            buttonNeutral: 'Hỏi sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS tự xử lý qua Info.plist
    }
  };
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Lỗi', response.errorMessage || 'Không thể chọn ảnh');
          return;
        }
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          onSelectImage(uri); // 👈 truyền ra ngoài
          onClose();          // đóng modal
        }
      }
    );
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert('Lỗi', 'Bạn chưa cấp quyền camera!');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Lỗi', response.errorMessage || 'Không thể chụp ảnh');
          return;
        }
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          onSelectImage(uri); // 👈 truyền ra ngoài
          onClose();          // đóng modal
        }
      }
    );
  };

  return (
    <AppModal isVisible={isDisplay} onClose={onClose} heightPercent={0.26}>
      <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 30 }}>
        <AppButton onPress={pickImage} padding={10} justifyContent={'space-between'} row>
          <AppText>{'Chọn ảnh từ thư viện'}</AppText>
          <IconArrowDown rotate={-90} />
        </AppButton>
        <AppButton onPress={takePhoto} padding={10} borderTopWidth={1} borderTopColor={ColorsGlobal.borderColor} justifyContent={'space-between'} row>
          <AppText>{'Chụp ảnh mới'}</AppText>
          <IconArrowDown rotate={-90} />
        </AppButton>

      </View>
    </AppModal>
  );
}
