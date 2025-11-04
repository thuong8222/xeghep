import { Modal, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../common/AppView'

import AppText from '../../common/AppText'

import ButtonSubmit from '../../common/ButtonSubmit'

interface ModalRequestJoinGroupProps {
  visible?: boolean;
  onRequestClose?: () => void;

}

export default function ModalRequestJoinGroup({ visible, onRequestClose }: ModalRequestJoinGroupProps) {
 
  const handleOk = () => {
    onRequestClose?.()
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
          paddingVertical={32}
          paddingHorizontal={16}
          gap={16}
        >
         
         <AppText fontWeight={500} textAlign='center'>
                  {'Yêu cầu vào nhóm của bạn đang đợi trưởng nhóm phê duyệt'}
                </AppText>

    
          <ButtonSubmit height={36} title="OK" onPress={handleOk}  />
        </AppView>
      </AppView>
    </Modal>
  )
}


