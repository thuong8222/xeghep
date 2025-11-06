import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AppView from '../../common/AppView';
import AppInput from '../../common/AppInput';
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import { removeVietnameseTones } from '../../../utils/Helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type ModalOnlySelectProvinceProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelected?: (data: { province: any }) => void;
}
export default function ModalOnlySelectProvince({ isVisible, onClose, onSelected }: ModalOnlySelectProvinceProps) {
  console.log('isVisible ModalOnlySelectProvince: ', isVisible);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    fetch('https://production.cas.so/address-kit/2025-07-01/provinces', {
      headers: { Accept: 'application/json' },
    })
      .then(res => res.json())
      .then(data => setProvinces(data.provinces))
      .catch(err => console.error('❌ Lỗi tải tỉnh:', err));
  }, []);

  const handleSelectProvince = async (province) => {
    setSelectedProvince(province);

    setSearchText('');
    onSelected?.({ province });
    onClose();
  };



  // ✅ Lọc danh sách theo searchText
  const filteredProvinces = provinces.filter((item) =>
    removeVietnameseTones(item?.name).includes(removeVietnameseTones(searchText))
  );



  const renderProvince = ({ item }) => (
    <AppButton onPress={() => handleSelectProvince(item)} padding={12}>
      <AppText>{item.name}</AppText>
    </AppButton>
  );


  return (
    <AppModal isVisible={isVisible} onClose={onClose} heightPercent={0.8}>
      <AppView flex={1} gap={8} >
        <AppText bold fontSize={18}>Chọn Tỉnh / Thành phố</AppText>

        <AppInput
          type='search'
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm tỉnh/thành phố..."
        />

        <AppView flex={1}>
          <FlatList
            data={filteredProvinces}
            keyExtractor={(item) => item.code}
            renderItem={renderProvince}
            keyboardShouldPersistTaps="handled" // Quan trọng!
            ItemSeparatorComponent={() => (
              <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />
            )}
          />
        </AppView>
      </AppView>


    </AppModal>
  );
}
