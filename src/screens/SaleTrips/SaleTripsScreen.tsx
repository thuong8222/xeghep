import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import AppText from '../../components/common/AppText'
import IconTickCircle from '../../assets/icons/IconTickCircle'
import AppButton from '../../components/common/AppButton'
import IconNoneTickCircle from '../../assets/icons/IconNoneTickCircle'
import AppInput from '../../components/common/AppInput'
import IconDotHorizonal from '../../assets/icons/IconDotHorizonal'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import IconPlus from '../../assets/icons/IconPlus'
import IconArowDown from '../../assets/icons/IconArowDown'
import IconMinus from '../../assets/icons/IconMinus'
import ButtonSubmit from '../../components/common/ButtonSubmit'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import NoteInputSection from '../../components/component/NoteInputSection'

import SelectProvinceDistrictModal from '../../components/component/modals/ModalSelectWard'
import TripOptionsSection from '../../components/component/TripOptionsSection'

export default function SaleTripsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDirection, setSelectedDirection] = useState<'go' | 'back'>('go');
  const [isCommuneWard, setIsCommuneWard] = useState(false);
  const [moreInputEnd, setMoreInputEnd] = useState(false);
  const [placeStart, setPlaceStart] = useState('');
  const [placeEnd, setPlaceEnd] = useState('');
  const [communeWard, setCommuneWard] = useState('');

  const selectCommuneWard = () => {
    setIsCommuneWard(true); // mở modal chọn xã/phường
  };

  const toggleMoreDetailEnd = () => {
    setMoreInputEnd(!moreInputEnd)
  }
  const SubmitToSale = () => {
    console.log('ddang ban')
  }
  return (

    <AppView flex={1} backgroundColor='#fff' paddingHorizontal={16} paddingTop={16} gap={18} paddingBottom={Platform.OS === 'ios' ? insets.bottom : 0}  >

      <AppView row gap={32}>
        <AppButton onPress={() => setSelectedDirection('go')} row gap={8}>
          <AppText>{'Chiều đi'}</AppText>
          {selectedDirection === 'go' ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>
        <AppButton onPress={() => setSelectedDirection('back')} row gap={8}>
          <AppText>{'Chiều về'}</AppText>
          {selectedDirection === 'back' ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>
      </AppView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <AppView gap={18}>
          <AppView gap={6}>
            <AppView gap={6}>
              <AppView row gap={8} alignItems='flex-end' justifyContent={'space-between'}>
                <AppInput
                  label={placeStart ? 'Điểm đón' : ''}
                  value={placeStart}
                  onChangeText={setPlaceStart}
                  placeholder="Nhập điểm đón"
                />

              </AppView>

            </AppView>
            <AppView gap={6}>
              <AppView row gap={8} alignItems='flex-end' justifyContent={'space-between'}>
                <AppInput
                  label={placeEnd ? 'Điểm trả' : ''}
                  value={placeEnd}
                  onChangeText={setPlaceEnd}
                  placeholder="Nhập điểm trả"
                  type='select'
                  toggleSelect={toggleMoreDetailEnd}
                />

              </AppView>
              {moreInputEnd &&
                <AppView row gap={16} >

                  <AppInput
                    value={communeWard}
                    onChangeText={setCommuneWard}
                    placeholder="Chọn xã/phường"
                    type='select'
                    editable={false}
                    toggleSelect={selectCommuneWard}
                  />
                </AppView>
              }
            </AppView>
          </AppView>
          <TripOptionsSection />
          <NoteInputSection />
        </AppView>
      </ScrollView>
      <ButtonSubmit title='Đăng bán' onPress={SubmitToSale} />
      <SelectProvinceDistrictModal
        isVisible={isCommuneWard}
        onClose={() => {
          setIsCommuneWard(false);
        }}
        onSelected={(value) => {
          console.log('✅ Kết quả chọn:', value);
          // Ví dụ: value = { province: {...}, district: {...} }
          setCommuneWard(`${value.province.name} - ${value.district.name}`);
        }}
      />
    </AppView>

  )
}

const styles = StyleSheet.create({})