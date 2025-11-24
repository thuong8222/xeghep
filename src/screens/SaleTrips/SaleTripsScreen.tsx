import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { createTrip, CreateTripPayload, fetchTrips } from '../../redux/slices/tripsSlice'
import moment from 'moment'
import { useAppContext } from '../../context/AppContext'
interface Props {
  route: any;
}
export default function SaleTripsScreen({ route }: Props) {
  const { id_area } = route.params;
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const { setUpdateTrips } = useAppContext()
  const [selectedDirection, setSelectedDirection] = useState(1);
  const [isCommuneWard, setIsCommuneWard] = useState(false);
  const [moreInputEnd, setMoreInputEnd] = useState(false);
  const [placeStart, setPlaceStart] = useState('');
  const [placeEnd, setPlaceEnd] = useState('');
  const [communeWard, setCommuneWard] = useState('');

  const [tripOptions, setTripOptions] = useState({
    numGuests: 1,
    price: 250,
    points: '1',
    guestType: 'normal',
    timeStart: null as number | null,
    typeCar: null as { type: string; name: string } | null
  });
  const [noteOptions, setNoteOptions] = useState();
  console.log('tripOptions SaleTripsScreen: ', tripOptions)


  // Hàm này sẽ được gọi mỗi khi TripOptionsSection thay đổi dữ liệu
  const handleTripOptionsChange = (
    numGuests: number | null,
    price?: string,
    points?: string,
    guestType?: string,
    timeStart?: number,
    typeCar?: { type: string; name: string } | null
  ) => {
    setTripOptions({
      numGuests: numGuests ?? tripOptions.numGuests,
      price: price ?? tripOptions.price,
      points: points ?? tripOptions.points,
      guestType: guestType ?? tripOptions.guestType,
      timeStart: timeStart ?? tripOptions.timeStart,
      typeCar: typeCar ?? tripOptions.typeCar
    });
  };
  const handleNoteChange = (val?: string) => {
    setNoteOptions(val ?? "");
    console.log("Ghi chú nhận được từ con:", val);
  };
  const handleCreateTrip = async () => {
    console.log('tripOptions handleCreateTrip: ', tripOptions)
    if (!placeStart || !placeEnd) {
      Alert.alert('Điểm đi/ Điểm đến không được để trống!')
      return;
    }
    console.log('tripOptions handleCreateTrip: ', tripOptions)
    if (tripOptions.guestType === 'normal' && !tripOptions.typeCar) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn loại xe!");
      return;
    }

    console.log('handleCreateTrip')
    const payload: CreateTripPayload = {
      area_id: id_area,
      direction: selectedDirection || 1,
      guests: tripOptions?.numGuests || 1,
      time_start: tripOptions?.timeStart || (Math.floor(Date.now() / 1000)),
      price_sell: Number(tripOptions.price) || 250,
      place_start: placeStart,
      place_end: placeEnd + ', ' + communeWard,
      point: tripOptions?.points,
      note: noteOptions || '',
      type_car: tripOptions?.typeCar?.type || 'car5',
      cover_car: tripOptions.typeCar ? 0 : 1,


    };
    console.log('payload handleCreateTrip: ', payload)

    try {
      const res = await dispatch(createTrip(payload)).unwrap();
      await fetchTrips(id_area); // nếu cần refetch
      console.log("🎉 Kết quả API trả về:", res);
      setUpdateTrips(moment().unix());
      setSelectedDirection(1);
      setPlaceStart("");
      setPlaceEnd("");
      setCommuneWard("");
      setMoreInputEnd(false);

      setTripOptions({
        numGuests: 1,
        price: '250',
        points: '1',
        guestType: 'normal',
        timeStart: null,
        typeCar: null
      });

      setNoteOptions("");
      Alert.alert('Thành công', 'Tạo chuyến thành công!');
    } catch (err) {
      console.log('Lỗi tạo chuyến:', JSON.stringify(err, null, 2));
    }
  };

  const selectCommuneWard = () => {
    setIsCommuneWard(true); // mở modal chọn xã/phường
  };

  const toggleMoreDetailEnd = () => {
    setMoreInputEnd(!moreInputEnd)
  }




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
          <NoteInputSection onNoteChange={handleNoteChange} />
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