import { Alert, Image, NativeAppEventEmitter, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppModal from '../../common/AppModal'
import AppText from '../../common/AppText';
import AppInput from '../../common/AppInput';
import ButtonSubmit from '../../common/ButtonSubmit';
import AppView from '../../common/AppView';
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import ModalUploadCarImage from './ModalUploadCarImage';
import AppButton from '../../common/AppButton';
import IconUploadIcloud from '../../../assets/icons/IconUploadIcloud';
import { uploadTransferProof } from '../../../redux/data/API';


type ModalForgetProps = {
  isVisible: boolean;
  onRequestClose: () => void;
  data: any;
}
export default function ModalShowInfoTranferMoney({ isVisible, onRequestClose, data }: ModalForgetProps) {
  const [isDisplayModalUploadImage, setIsDisplayModalUploadImage] = useState(false);
  const [evidenceImage, setEvidenceImage] = useState('');
  const [idTranferMoney, setIdTranferMoney] = useState('');

  const handleSubmit = async () => {
    try {
      if (!idTranferMoney || !evidenceImage.imageUri) {
        Alert.alert('Lỗi', 'Vui lòng nhập mã giao dịch và chọn ảnh minh chứng');
        return;
      }
  
      const formData = new FormData();
      formData.append('transaction_code', idTranferMoney); // string
      formData.append('image', {
        uri: evidenceImage.imageUri, // local uri
        name: 'transfer.jpg',        // tên file
        type: 'image/jpeg',          // MIME type
      } as any); // cast để TS không lỗi
    
        const response = await uploadTransferProof(data.id, formData);
    
      if (response.data.status === 1) {
        Alert.alert('Thành công', 'Đã gửi bằng chứng chuyển khoản');
        onRequestClose();
      } else {
        Alert.alert('Lỗi', response.data.message || 'Gửi thất bại');
      }
    } catch (err: any) {
      console.log('Upload error:', err.response || err);
      Alert.alert('Lỗi', err.response?.data?.message || 'Gửi thất bại');
    }
  };

  const bankInfo = data?.bank_info ? JSON.parse(data.bank_info) : {
    bank_name: '',
    account_number: '',
    account_name: '',
  };

  const openModalSelectImage = () => {
    setIsDisplayModalUploadImage(true)
  }
  return (

    <AppModal isVisible={isVisible} onClose={onRequestClose} heightPercent={0.8}>
      <AppText textAlign='center' bold >{'Chuyển khoản cho người bán và gửi minh chứng vào đây'}</AppText>
      <AppView gap={24} marginTop={30}>
        <AppView radius={16} padding={16} gap={8} backgroundColor={ColorsGlobal.backgroundGray}>
          <AppView row justifyContent={'space-between'}>
            <AppText fontSize={14}>{'Số tài khoản: '}</AppText>
            <AppText>{bankInfo.account_number}</AppText>
          </AppView>
          <AppView row justifyContent={'space-between'}>
            <AppText fontSize={14}>{'Tên ngân hàng: '}</AppText>
            <AppText>{bankInfo.bank_name}</AppText>
          </AppView>
          <AppView row justifyContent={'space-between'}>
            <AppText fontSize={14}>{'Chủ tài khoản: '}</AppText>
            <AppText>{bankInfo.account_name}</AppText>
          </AppView>
        </AppView>
        <AppView gap={8}>
          <AppText bold>{'Mã chuyển khoản'}</AppText>
          <AppInput label='Mã chuyển khoản' value={idTranferMoney} onChangeText={(text) => setIdTranferMoney(text)} placeholder='Nhập mã giao dịch của bạn vào đây' />
          <AppText bold>{'Ảnh minh chứng'}</AppText>
          <AppButton justifyContent='center' alignItems='center' onPress={openModalSelectImage} >
            {evidenceImage?.imageUri ? (
              <Image
                source={{ uri: evidenceImage.imageUri }}
                style={{ height: 200, borderWidth: 1, width: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <AppView justifyContent='center' alignItems='center' >
                <IconUploadIcloud size={100} />
                <AppText color={ColorsGlobal.textLight}>{'Tải ảnh minh chứng lên đây'}</AppText>
              </AppView>)}


          </AppButton>
        </AppView>
        <ButtonSubmit title='Gửi minh chứng' onPress={handleSubmit} />
      </AppView>
      <ModalUploadCarImage
        isDisplay={isDisplayModalUploadImage}
        onClose={() => setIsDisplayModalUploadImage(false)}
        onSelectImage={(uri) => setEvidenceImage(prev => ({ ...prev, imageUri: uri }))}
      />
    </AppModal>
  )
}

