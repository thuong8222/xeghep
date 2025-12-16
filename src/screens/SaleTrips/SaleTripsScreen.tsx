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
  navigation: any;
}
export default function SaleTripsScreen({ route, navigation }: Props) {
  const { id_area } = route.params;
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const { setUpdateTrips } = useAppContext()
  const [selectedDirection, setSelectedDirection] = useState(1);
  const [isCommuneWard, setIsCommuneWard] = useState(false);
  const [isCommuneWardTo, setIsCommuneWardTo] = useState(false);
  const [moreInputEnd, setMoreInputEnd] = useState(false);
  const [moreInput, setMoreInput] = useState(false);

  const [placeStart, setPlaceStart] = useState('');
  const [placeEnd, setPlaceEnd] = useState('');
  const [communeWard, setCommuneWard] = useState('');
  const [communeWardTo, setCommuneWardTo] = useState('');

  // ✅ Initial state với giá trị mặc định
  const [tripOptions, setTripOptions] = useState({
    numGuests: 1,
    price: '250',
    points: '1',
    guestType: 'normal',
    timeStart: null as number | null,
    typeCar: null as { type: string; name: string } | null
  });
  const [noteOptions, setNoteOptions] = useState();


  // ✅ FIX: Hàm này phải UPDATE state với giá trị MỚI, không phải giá trị cũ
  const handleTripOptionsChange = (
    numGuests: number | null,
    price?: string,
    points?: string | number,
    guestType?: string,
    timeStart?: number | null,
    typeCar?: { type: string; name: string } | null
  ) => {
    console.log('📊 Trip options changed:', {
      numGuests,
      price,
      points,
      guestType,
      timeStart,
      typeCar
    });

    // ✅ Update với giá trị MỚI từ params
    setTripOptions(prev => ({
      numGuests: numGuests ?? prev.numGuests,
      price: price ?? prev.price,
      points: points?.toString() ?? prev.points,
      guestType: guestType ?? prev.guestType,
      timeStart: timeStart ?? prev.timeStart,
      typeCar: typeCar !== undefined ? typeCar : prev.typeCar  // ✅ Cho phép null
    }));
  };

  const handleNoteChange = (val?: string) => {
    setNoteOptions(val ?? "");
    console.log("Ghi chú nhận được từ con:", val);
  };
  const handleCreateTrip = async () => {

    if (!placeStart || !placeEnd) {
      Alert.alert('Điểm đi/ Điểm đến không được để trống!')
      return;
    }

    console.log('selectedDirection: ', selectedDirection)

    console.log('tripOptions: ', tripOptions)
    const payload: CreateTripPayload = {
      area_id: id_area,
      direction: selectedDirection,
      guests: tripOptions?.numGuests || 1,
      time_start: tripOptions?.timeStart || (Math.floor(Date.now() / 1000)),
      price_sell: Number(tripOptions.price) || 250,
      place_start: placeStart,
      place_end: placeEnd + ', ' + communeWard,
      point: Number(tripOptions?.points),
      note: noteOptions || '',
      type_car: tripOptions?.guestType,
      cover_car: tripOptions.guestType === 'normal' ? 0 : 1,
    };
    console.log('payload handleCreateTrip: ', payload)

    try {
      const res = await dispatch(createTrip(payload)).unwrap();
      await fetchTrips(id_area); // nếu cần refetch
      console.log("🎉 Kết quả API trả về:", res);
      setUpdateTrips(moment().unix());
      setSelectedDirection();
      setPlaceStart("");
      setPlaceEnd("");
      setCommuneWard("");
      setCommuneWardTo('')
      setMoreInputEnd(false);
      setMoreInput(false);

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
      navigation.goBack()
    } catch (err) {
      Alert.alert('Lỗi tạo chuyến', JSON.stringify(err, null, 2));

      console.log('Lỗi tạo chuyến:', JSON.stringify(err, null, 2));
    }
  };

  const selectCommuneWard = () => {
    setIsCommuneWard(true); // mở modal chọn xã/phường
  };
  const selectCommuneWardTo = () => {
    setIsCommuneWardTo(true); // mở modal chọn xã/phường
  };
  const toggleMoreDetailEnd = () => {
    setMoreInputEnd(!moreInputEnd)
  }
  const toggleMoreInput = () => {
    setMoreInput(!moreInput)
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
                  type='select'
                  toggleSelect={toggleMoreInput}
                />
              </AppView>
              {moreInput &&
                <AppView row gap={16} >
                  <AppInput
                    value={communeWardTo}
                    onChangeText={setCommuneWardTo}
                    placeholder="Chọn xã/phường"
                    type='select'
                    editable={false}
                    toggleSelect={selectCommuneWardTo}
                  />
                </AppView>
              }
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
      <SelectProvinceDistrictModal
        isVisible={isCommuneWardTo}
        onClose={() => {
          setIsCommuneWardTo(false);
        }}
        onSelected={(value) => {
          console.log('✅ Kết quả chọn:', value);
          // Ví dụ: value = { province: {...}, district: {...} }

          setCommuneWardTo(`${value.province.name} - ${value.district.name}`);
        }}
      />

    </AppView>

  )
}

