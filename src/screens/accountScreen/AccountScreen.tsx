import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import AppText from '../../components/common/AppText'
import AppInput from '../../components/common/AppInput'
import AppButton from '../../components/common/AppButton'
import IconArrowDown from '../../assets/icons/IconArowDown'
import { useFocusEffect } from '@react-navigation/native'
import ModalUploadCarImage from '../../components/component/modals/UploadCarImage'
import { clearWarnings } from 'react-native/types_generated/Libraries/LogBox/Data/LogBoxData'

export default function AccountScreen() {
  const [nameDisplay, setNameDisplay] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [isDisplayModalUploadImage,setIsDisplayModalUploadImage] = useState(false);
  const handleUploadPress =()=>{
    console.log('handleUploadPress')
    setIsDisplayModalUploadImage(true);
  }
  return (
    <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16} gap={24}>
      <AppView gap={16} height={'auto'} >
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
      <AppView gap={16} height={'auto'} >
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

        <AppInput  onUploadPress={handleUploadPress} value={nameDisplay} onChangeText={(text) => setNameDisplay(text)} placeholder='Tải lên hình ảnh xe' label={'Hình ảnh xe'} type='upload' editable={false} />
      </AppView>
      </AppView>
      <AppView gap={16} >
        <AppText fontSize={14} lineHeight={20} fontWeight={700}>{'Tính năng'}</AppText>
        <AppView gap={12}>
          <AppButton row justifyContent={'space-between'} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={6}>
            <AppText color={ColorsGlobal.textLight} >{'Đổi mật khẩu'}</AppText>
            <IconArrowDown rotate={-90} size={20} />
          </AppButton>
          <AppButton row justifyContent={'space-between'} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={6}>
            <AppText color={ColorsGlobal.textLight}   >{'Lịch sử mua/bán điểm'}</AppText>
            <IconArrowDown rotate={-90} size={20} />
          </AppButton>
          <AppButton row justifyContent={'space-between'} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={6}>
            <AppText color={ColorsGlobal.textLight}  >{'Đăng xuất'}</AppText>
            <IconArrowDown rotate={-90} size={20} />
          </AppButton>
        </AppView>

      </AppView>
      <ModalUploadCarImage isDisplay={isDisplayModalUploadImage} onClose={()=>setIsDisplayModalUploadImage(false)} />
    </AppView>
  )
}

const styles = StyleSheet.create({})