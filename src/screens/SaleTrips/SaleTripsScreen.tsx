import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import AppText from '../../components/common/AppText'
import IconTickCircle from '../../assets/icons/IconTickCircle'
import AppButton from '../../components/common/AppButton'
import IconNoneTickCircle from '../../assets/icons/IconNoneTickCircle'
import AppInput from '../../components/common/AppInput'
import IconDotHorizonal from '../../assets/icons/IconDotHorizonal'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'

import ButtonSubmit from '../../components/common/ButtonSubmit'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import NoteInputSection from '../../components/component/NoteInputSection'


import TripOptionsSection from '../../components/component/TripOptionsSection'
import { useDispatch, useSelector } from 'react-redux'
import { createTrip, CreateTripPayload, fetchTrips } from '../../redux/slices/tripsSlice'
import moment from 'moment'
import { useAppContext } from '../../context/AppContext'

import ModalSelectLocationByArea from '../../components/component/modals/ModalSelectLocationByArea'

interface Props {
  route: any;
  navigation: any;
}
export default function SaleTripsScreen({ route, navigation }: Props) {

  const { id_area } = route.params;
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const { setUpdateTrips, currentArea } = useAppContext()
  const [selectedDirection, setSelectedDirection] = useState(1);
  const [isCommuneWard, setIsCommuneWard] = useState(false);
  const [isCommuneWardTo, setIsCommuneWardTo] = useState(false);

  const [placeStart, setPlaceStart] = useState('');
  const [placeEnd, setPlaceEnd] = useState('');
  const [communeWard, setCommuneWard] = useState('');
  const [communeWardTo, setCommuneWardTo] = useState('');
  const { loading } = useSelector((state: any) => state.trips);
  const [districtCode, setDistrictCode] = useState('');
  const [districtCodeTo, setDistrictCodeTo] = useState('');
  const [selectedStartLocation, setSelectedStartLocation] = useState<any[]>([]);
  const [selectedEndLocation, setSelectedEndLocation] = useState<any[]>([]);
  const [tripOptions, setTripOptions] = useState({
    numGuests: 1,
    price: '250',
    points: '1',
    guestType: 'normal',
    timeStart: null as number | null,
    typeCar: null as { type: string; name: string } | null
  });
  const [noteOptions, setNoteOptions] = useState();

  const handleTripOptionsChange = (
    numGuests: number | null,
    price?: string,
    points?: string | number,
    guestType?: string,
    timeStart?: number | null,
    typeCar?: { type: string; name: string } | null
  ) => {

    setTripOptions(prev => ({
      numGuests: numGuests ?? prev.numGuests,
      price: price ?? prev.price,
      points: points?.toString() ?? prev.points,
      guestType: guestType ?? prev.guestType,
      timeStart: timeStart ?? prev.timeStart,
      typeCar: typeCar !== undefined ? typeCar : prev.typeCar
    }));
  };

  const handleNoteChange = (val?: string) => {
    setNoteOptions(val ?? "");
  };

  const handleCreateTrip = async () => {
    const place_start = [placeStart,
      selectedStartLocation[0]?.name
    ].filter(Boolean).join(', ')

    const place_end = [placeEnd,
      selectedEndLocation[0]?.name
    ].filter(Boolean).join(', ')
    if (!place_start || !place_end) {
      Alert.alert('Thông báo', 'Điểm đi/Điểm đến không được để trống!')
      return;
    }
    const defaultTimeStart = Math.floor(Date.now() / 1000) + 15 * 60;
    const payload: CreateTripPayload = {
      area_id: id_area,
      direction: selectedDirection,
      guests: tripOptions?.numGuests || 1,
      time_start: tripOptions?.timeStart || defaultTimeStart,
      price_sell: Number(tripOptions.price) || 250,
      place_start: place_start,
      place_end: place_end,
      point: Number(tripOptions?.points),
      note: noteOptions || '',
      type_car: tripOptions?.guestType,
      cover_car: tripOptions.guestType === 'normal' ? 0 : 1,
    };


    try {
      await dispatch(createTrip(payload)).unwrap();
      setUpdateTrips(moment().unix());
      setSelectedDirection(1);
      setPlaceStart("");
      setPlaceEnd("");
      setCommuneWard("");
      setCommuneWardTo('');

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

  // Mở modal chọn tỉnh/huyện cho điểm đón
  const handleSelectCommuneWardStart = () => {
    setIsCommuneWardTo(true);
  };

  // Mở modal chọn tỉnh/huyện cho điểm trả
  const handleSelectCommuneWardEnd = () => {
    setIsCommuneWard(true);
  };
  const handleChangeDirection = (direction: number) => {

    if (direction === selectedDirection) return;
    // swap place
    const newPlaceStart = placeEnd;
    const newPlaceEnd = placeStart;
    // swap commune
    const newCommuneStart = communeWard;
    const newCommuneEnd = communeWardTo;
    // swap districtCode
    const newDistrictStart = districtCode;
    const newDistrictEnd = districtCodeTo;

    setPlaceStart(newPlaceStart);
    setPlaceEnd(newPlaceEnd);

    setCommuneWardTo(newCommuneStart);
    setCommuneWard(newCommuneEnd);

    setDistrictCodeTo(newDistrictStart);
    setDistrictCode(newDistrictEnd);
    setSelectedDirection(direction);
  };
  const areaLevel1Names =
    selectedDirection === 1
      ? currentArea?.level1_pickup_names
      : currentArea?.level1_dropoff_names;

  const labelText = `Điểm xuất phát khu vực ${areaLevel1Names?.length ? areaLevel1Names.join(', ') : ''
    }`;
  const areaLevel1NamesTo =
    selectedDirection === 1
      ? currentArea?.level1_dropoff_names
      : currentArea?.level1_pickup_names;

  const labelTextTo = `Điểm đến khu vực ${areaLevel1NamesTo?.length ? areaLevel1NamesTo.join(', ') : ''}`;
  return (
    <AppView
      flex={1}
      backgroundColor='#fff'
      paddingHorizontal={16}
      paddingTop={16}

      paddingBottom={Platform.OS === 'ios' ? insets.bottom : 0}
      position='relative'
    >
      {loading && (
        <AppView>
          <AppView alignItems="center" gap={12}>
            <ActivityIndicator size="large" color={ColorsGlobal.main} />
            <AppText color={ColorsGlobal.main} title={'Đang tạo chuyến...'} />
          </AppView>
        </AppView>
      )}

      {/* Chọn chiều đi/về */}
      <AppView row gap={32} marginBottom={16} >
        <AppButton onPress={() => handleChangeDirection(1)} row gap={8} height={40} alignItems='center' flex={1}>
          <AppText>{'Chiều đi'}</AppText>
          {selectedDirection === 1 ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>
        <AppButton onPress={() => handleChangeDirection(0)} row gap={8} height={40} alignItems='center' flex={1}>
          <AppText>{'Chiều về'}</AppText>
          {selectedDirection === 0 ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>
      </AppView>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <AppView gap={18}>
          <AppView gap={12}>
            {/* ĐIỂM ĐÓN */}
            <AppView gap={6}>
              <AppView row gap={8} alignItems='flex-end'>
                <AppView flex={1}>
                  <AppInput
                    label={labelText}
                    value={[placeStart,
                      selectedStartLocation[0]?.name
                    ].filter(Boolean).join(', ')}
                    onChangeText={setPlaceStart}
                    placeholder="Nhập chi tiết điểm đón"
                  />
                </AppView>
                <AppButton
                  onPress={handleSelectCommuneWardStart}
                  padding={7}
                  radius={6}
                  borderColor={ColorsGlobal.borderColor} borderWidth={1}
                >
                  <IconDotHorizonal />
                </AppButton>
              </AppView>


            </AppView>

            {/* ĐIỂM TRẢ */}
            <AppView gap={6}>
              <AppView row gap={8} alignItems='flex-end'>
                <AppView flex={1}>
                  <AppInput
                    label={labelTextTo}
                    value={[placeEnd,
                      selectedEndLocation[0]?.name
                    ].filter(Boolean).join(', ')}
                    onChangeText={setPlaceEnd}
                    placeholder="Nhập chi tiết điểm trả"
                  />
                </AppView>
                <AppButton
                  onPress={handleSelectCommuneWardEnd}
                  padding={7}
                  radius={6}
                  borderColor={ColorsGlobal.borderColor} borderWidth={1}
                >
                  <IconDotHorizonal />
                </AppButton>
              </AppView>

            </AppView>
          </AppView>

          <TripOptionsSection onTripOptionsChange={handleTripOptionsChange} />
          <NoteInputSection onNoteChange={handleNoteChange} />
        </AppView>
      </ScrollView>

      <ButtonSubmit title='Đăng bán' onPress={handleCreateTrip} />
      <ModalSelectLocationByArea
        multiSelect={false}
        isVisible={isCommuneWardTo}
        locationType={selectedDirection === 1 ? 'pickup' : 'dropoff'}
        areaId={id_area}
        defaultSelected={selectedStartLocation}
        onClose={() => setIsCommuneWardTo(false)}
        onSelected={(value) => {
          setSelectedStartLocation([value]);
        }}
        parentIds={selectedDirection === 1 ? currentArea?.level1_pickup_ids : currentArea?.level1_dropoff_ids}
      />

      <ModalSelectLocationByArea
        multiSelect={false}
        isVisible={isCommuneWard}
        locationType={selectedDirection === 1 ? 'dropoff' : 'pickup'}
        areaId={id_area}
        defaultSelected={selectedEndLocation}
        onClose={() => setIsCommuneWard(false)}
        onSelected={(value) => {
          setSelectedEndLocation([value]);
        }}
        parentIds={selectedDirection === 1 ? currentArea?.level1_dropoff_ids : currentArea?.level1_pickup_ids}
      />


    </AppView>
  )
}