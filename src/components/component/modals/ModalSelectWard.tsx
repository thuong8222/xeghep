// ModalSelectWard.tsx
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AppView from '../../common/AppView';
import AppInput from '../../common/AppInput';
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import { removeVietnameseTones } from '../../../utils/Helper';
import IconTickCircle from '../../../assets/icons/IconTickCircle';
import IconNoneTickCircle from '../../../assets/icons/IconNoneTickCircle';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSelected: (value: any) => void;
  multiSelect?: boolean; // ⭐ Thêm prop này
}

export default function SelectProvinceDistrictModal({ 
  isVisible, 
  onClose, 
  onSelected,
  multiSelect = false // ⭐ Default là single select
}: Props) {
  const [step, setStep] = useState<'province' | 'district'>('province');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://production.cas.so/address-kit/2025-07-01/provinces', {
      headers: { Accept: 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        setProvinces(data.provinces);
      })
      .catch(err => console.error('❌ Lỗi tải tỉnh:', err));
  }, []);

  const handleSelectProvince = async (province) => {
    setSelectedProvince(province);
    setStep('district');
    setSearchText('');

    try {
      const res = await fetch(
        `https://production.cas.so/address-kit/2025-07-01/provinces/${province.code}/communes`,
        { headers: { Accept: 'application/json' } }
      );

      const text = await res.text();
      const data = JSON.parse(text);
      setDistricts(data.communes);
    } catch (err) {
      console.error('❌ Lỗi tải huyện:', err);
    }
  };

  // ⭐ Xử lý chọn district
  const handleSelectDistrict = (district) => {
    if (multiSelect) {
      // Multi select: toggle checkbox
      toggleSelectDistrict(district);
    } else {
      // Single select: chọn xong đóng luôn
      onSelected({
        province: selectedProvince,
        district,
      });
      onClose();
      resetState();
    }
  };

  // Multi Select
  const toggleSelectDistrict = (district) => {
    setSelectedDistricts(prev => {
      const exists = prev.find(item => item.code === district.code);
      if (exists) {
        return prev.filter(x => x.code !== district.code);
      }
      return [...prev, district];
    });
  };

  // Confirm cho multi select
  const handleConfirm = () => {
    if (!selectedProvince || selectedDistricts.length === 0) return;

    onSelected({
      province: selectedProvince,
      districts: selectedDistricts,
    });

    onClose();
    resetState();
  };

  // Reset state khi đóng modal
  const resetState = () => {
    setStep('province');
    setSearchText('');
    setSelectedDistricts([]);
    setSelectedProvince(null);
  };

  const filteredProvinces = provinces.filter((item) =>
    removeVietnameseTones(item.name).includes(removeVietnameseTones(searchText))
  );

  const filteredDistricts = districts.filter((item) =>
    removeVietnameseTones(item.name).includes(removeVietnameseTones(searchText))
  );

  const renderProvince = ({ item }) => (
    <AppButton onPress={() => handleSelectProvince(item)} padding={12}>
      <AppText>{item.name}</AppText>
    </AppButton>
  );

  const renderDistrict = ({ item }) => {
    const isSelected = selectedDistricts.some(d => d.code === item.code);

    return (
      <AppButton
        onPress={() => handleSelectDistrict(item)}
        padding={12}
        row
        justifyContent="space-between"
      >
        <AppText>{item?.name}</AppText>
        {/* ⭐ Chỉ hiển thị checkbox khi multiSelect = true */}
        {multiSelect && (isSelected ? <IconTickCircle /> : <IconNoneTickCircle />)}
      </AppButton>
    );
  };

  return (
    <AppModal isVisible={isVisible} onClose={() => { onClose(); resetState(); }} heightPercent={0.8}>
      <AppView flex={1} gap={8}>
        {step === 'province' && (
          <>
            <AppText bold fontSize={18}>Chọn Tỉnh / Thành phố</AppText>
            <AppInput
              type='search'
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm kiếm tỉnh/thành phố..."
            />
            <FlatList
              data={filteredProvinces}
              scrollEnabled={false}
              keyExtractor={(item) => item.code}
              renderItem={renderProvince}
              ItemSeparatorComponent={() => (
                <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />
              )}
            />
          </>
        )}

        {step === 'district' && (
          <>
            <AppText bold fontSize={18}>
              Chọn Xã / Phường thuộc {selectedProvince?.name}
            </AppText>
            <AppButton onPress={() => { setStep('province'); setSearchText(''); }}>
              <AppText>{"⬅ Quay lại"}</AppText>
            </AppButton>

            <AppInput
              type='search'
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm kiếm xã/phường..."
            />

            {/* ⭐ Chỉ hiển thị nút xác nhận khi multiSelect = true */}
            {multiSelect && (
              <AppButton
                backgroundColor={ColorsGlobal.main}
                padding={12}
                radius={10}
                onPress={handleConfirm}
              >
                <AppText color="#fff" textAlign="center">
                  Xác nhận ({selectedDistricts.length})
                </AppText>
              </AppButton>
            )}

            <FlatList
              data={filteredDistricts}
              scrollEnabled={false}
              keyExtractor={(item) => item.code}
              renderItem={renderDistrict}
              ItemSeparatorComponent={() => (
                <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />
              )}
            />
          </>
        )}
      </AppView>
    </AppModal>
  );
}