import { Modal, Linking, StyleSheet, Alert } from 'react-native';
import React, { useDeferredValue, useState } from 'react';
import AppView from '../../common/AppView';
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import AppButton from '../../common/AppButton';
import AppText from '../../common/AppText';
import IconClose from '../../../assets/icons/IconClose';
import ButtonSubmit from '../../common/ButtonSubmit';

interface ModalConfirmBuyTripProps {
  visible?: boolean;
  onRequestClose?: () => void;
  data: any
}

export default function ModalConfirmBuyTrip({
  visible,
  onRequestClose,
  data
}: ModalConfirmBuyTripProps) {

  const handleOk = () => {
    onRequestClose?.();
  };


  const driverPhone = data?.driver_sell?.phone
  const handleCallDriver = () => {
    const phoneNumber = data.driver_sell?.phone;

    if (!phoneNumber) {
      Alert.alert('Thông báo', 'Số điện thoại tài xế không tồn tại');
      return;
    }

    const url = `tel:${phoneNumber}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('Thông báo', 'Thiết bị của bạn không hỗ trợ gọi điện');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('Lỗi khi gọi điện:', err));
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <AppView
        flex={1}
        backgroundColor="#00000050"
        justifyContent="center"
        alignItems="center"
      >
        <AppView
          width="90%"
          maxHeight="85%"
          backgroundColor="#fff"
          radius={12}
          padding={16}
          gap={16}
        >
          {/* Đóng modal */}
          <AppButton alignItems="flex-end" onPress={onRequestClose}>
            <IconClose />
          </AppButton>


          <AppText >
            {'Bạn đã mua chuyến thành công. Vui lòng bấm "Gọi tài xế" để lấy số điện thoại khách hàng.'}
          </AppText>
          {/* Nút gọi tài xế */}
          {driverPhone && (
            <AppButton
              onPress={handleCallDriver}
            >
              <AppText style={{ color: ColorsGlobal.main, textAlign: 'center', fontWeight: '700' }}>
                "Gọi tài xế"
              </AppText>
            </AppButton>
          )}
          <AppText bold >
            {'Địa chỉ chi tiết của khách hàng '}
          </AppText>
          <AppView padding={10} backgroundColor={ColorsGlobal.backgroundLight} radius={10} >
            <AppText color={ColorsGlobal.main2} fontSize={14}>{data?.place_start}</AppText>
            <AppText color={ColorsGlobal.main}>{'->'}</AppText>
            <AppText color={ColorsGlobal.main2} fontSize={14}>{data?.place_end}</AppText>
          </AppView>





          {/* Nút OK */}
          <ButtonSubmit title="OK" onPress={handleOk} />
        </AppView>
      </AppView>
    </Modal>
  );
}
