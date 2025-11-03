import React, { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import AppModal from '../../common/AppModal';
import AppButton from '../../common/AppButton';
import AppText from '../../common/AppText';
import { clearWarnings } from 'react-native/types_generated/Libraries/LogBox/Data/LogBoxData';


interface ModalUploadCarImageProps {
    isDisplay: boolean;
    onClose: () => void;
    // onSubmitOtp?: (otp: string) => void;
  }
export default function ModalUploadCarImage({isDisplay, onClose}:ModalUploadCarImageProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);

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
        if (uri) setImageUri(uri);
      }
    );
  };

  const takePhoto = () => {
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
        if (uri) setImageUri(uri);
      }
    );
  };
console.log('isDisplay',isDisplay)
  return (
    <AppModal isVisible={isDisplay} onClose={onClose}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AppButton  onPress={pickImage}>
        <AppText>{'Chọn ảnh từ thư viện'}</AppText>
      </AppButton>
      <AppButton onPress={takePhoto}>
      <AppText>{'Chụp ảnh xe'}</AppText>
      </AppButton>
      {imageUri && (
        <>
          <AppText style={{ marginTop: 20 }}>Ảnh xe của bạn:</AppText>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, borderRadius: 12, marginTop: 10 }}
            resizeMode="cover"
          />
        </>
      )}
    </View>
    </AppModal>
  );
}
