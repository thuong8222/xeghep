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
import { useDispatch } from 'react-redux'
import { createTrip, CreateTripPayload } from '../../redux/slices/tripsSlice'

export default function SaleTripsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDirection, setSelectedDirection] = useState<1 | 0>(1);
  const [isCommuneWard, setIsCommuneWard] = useState(false);
  const [moreInputEnd, setMoreInputEnd] = useState(false);
  const [placeStart, setPlaceStart] = useState('');
  const [placeEnd, setPlaceEnd] = useState('');
  const [communeWard, setCommuneWard] = useState('');
  const dispatch = useDispatch();

  const handleCreateTrip = async () => {
    const payload: CreateTripPayload = {
      direction: selectedDirection,
      guests: tripOptions?.numGuests||1,
      time_start: tripOptions?.timeStart|| '2025-11-20 02:59:53',
      price_sell: tripOptions?.price_sell|| 250000,
      place_start: placeStart ||'Phở Bò',
      place_end:placeEnd+', '+communeWard || 'Phở Cồ',
      point: tripOptions?.point,
      note: 'thích như nào cũng được',
      area_id: '019a9a23-1780-717b-a07d-82bdfa06d772',
      type_car: '7-cho',
      cover_car: 0,
      time_receive: '2025-11-20 15:59:53',
      phone_number_guest: '0987654321'
    };
    console.log('payload handleCreateTrip: ',payload)
  return;
    try {
      await dispatch(createTrip(payload)).unwrap();
      console.log('Tạo chuyến thành công');
    } catch (err) {
      console.log('Lỗi tạo chuyến:', err);
    }
  };
  
  const selectCommuneWard = () => {
    setIsCommuneWard(true); // mở modal chọn xã/phường
  };

  const toggleMoreDetailEnd = () => {
    setMoreInputEnd(!moreInputEnd)
  }
  const [tripOptions, setTripOptions] = useState({
    numGuests: 1,
    price: '250',
    points: '1',
    guestType: 'normal',
    timeStart: null as number | null
  });
console.log('tripOptions: ',tripOptions)
  // Hàm này sẽ được gọi mỗi khi TripOptionsSection thay đổi dữ liệu
  const handleTripOptionsChange = (
    numGuests: number | null,
    price?: string,
    points?: string,
    guestType?: string,
    timeStart?: number
  ) => {
    setTripOptions({
      numGuests: numGuests ?? tripOptions.numGuests,
      price: price ?? tripOptions.price,
      points: points ?? tripOptions.points,
      guestType: guestType ?? tripOptions.guestType,
      timeStart: timeStart ?? tripOptions.timeStart
    });

    console.log('Trip Options Updated:', {
      numGuests,
      price,
      points,
      guestType,
      timeStart
    });
  };


  return (

    <AppView flex={1} backgroundColor='#fff' paddingHorizontal={16} paddingTop={16} gap={18} paddingBottom={Platform.OS === 'ios' ? insets.bottom : 0}  >

      <AppView row gap={32}>
        <AppButton onPress={() => setSelectedDirection(1)} row gap={8}>
          <AppText>{'Chiều đi'}</AppText>
          {selectedDirection === 1 ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>
        <AppButton onPress={() => setSelectedDirection(0)} row gap={8}>
          <AppText>{'Chiều về'}</AppText>
          {selectedDirection === 0 ? <IconTickCircle /> : <IconNoneTickCircle />}
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
          <TripOptionsSection onTripOptionsChange={handleTripOptionsChange} />
          <NoteInputSection />
        </AppView>
      </ScrollView>
      <ButtonSubmit title='Đăng bán' onPress={handleCreateTrip} />
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