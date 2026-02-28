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
  provinceName?: string;
  districtCode?: string;
  districtCodes?: string[]; // multi
}

export default function SelectProvinceDistrictModal({
  isVisible,
  onClose,
  onSelected,
  multiSelect = false, // ⭐ Default là single select
  provinceName, districtCode, districtCodes
}: Props) {
  const [step, setStep] = useState<'province' | 'district'>('province');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  console.log('provinceName: ', provinceName)
  console.log('districtCodes: ', districtCodes)
  useEffect(() => {

    if (
      multiSelect &&
      districtCodes?.length > 0 &&
      districts.length > 0
    ) {

      const newSelected = districts.filter(d =>
        districtCodes.includes(d.code)
      );

      setSelectedDistricts(newSelected);

    }

  }, [districtCodes, districts, multiSelect]);
  useEffect(() => {
    fetch('https://production.cas.so/address-kit/2025-07-01/provinces', {
      headers: { Accept: 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        // setProvinces(data.provinces);
        const list = data.provinces;

        setProvinces(list);

        // ⭐ auto chọn province theo currentArea

        if (provinceName) {

          const found = list.find(
            p => removeVietnameseTones(p.name)
              .includes(removeVietnameseTones(provinceName))
          );

          if (found) {

            setSelectedProvince(found);

            // ⭐ single select auto vào district
            if (!multiSelect) {

              handleSelectProvince(found);

            }

          }

        }


      })
      .catch(err => console.error('❌ Lỗi tải tỉnh:', err));
  }, [provinceName]);

  const handleSelectProvince = async (province) => {

    setSelectedProvince(province);
    setStep('district');
    setSearchText('');

    try {

      const res = await fetch(
        `https://production.cas.so/address-kit/2025-07-01/provinces/${province.code}/communes`
      );

      const data = await res.json();

      setDistricts(data.communes);

      // ⭐ SINGLE SELECT highlight
      if (!multiSelect && districtCode) {

        const found = data.communes.find(
          d => d.code === districtCode
        );

        if (found) {

          setSelectedDistrict(found);

        }

      }

      // ⭐ MULTI SELECT highlight
      // ⭐ MULTI SELECT highlight từ props
      if (multiSelect && districtCodes?.length > 0) {

        const newSelected = data.communes.filter(d =>
          districtCodes.includes(d.code)
        );
        setSelectedDistricts(newSelected);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ⭐ Xử lý chọn district
  const handleSelectDistrict = (district) => {
    if (multiSelect) {
      toggleSelectDistrict(district);
    } else {
      setSelectedDistrict(district); // ⭐ highlight
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
    })
    onClose();
    resetState();
  };

  // Reset state khi đóng modal
  const resetState = () => {
    setSearchText('')
    if (multiSelect) {
      setStep('province');
    } else {
      if (provinceName) {
        setStep('district');
      } else {
        setStep('province');
      }
    }
  };

  const filteredProvinces = provinces.filter((item) =>
    removeVietnameseTones(item.name).includes(removeVietnameseTones(searchText))
  );

  const filteredDistricts = districts.filter((item) =>
    removeVietnameseTones(item.name).includes(removeVietnameseTones(searchText))
  );

  const renderProvince = ({ item }) => {
    const isSelected =
      selectedProvince?.code === item.code;
    return (
      <AppButton
        onPress={() => handleSelectProvince(item)}
        padding={12}
      >
        <AppText
          color={
            isSelected
              ? ColorsGlobal.main
              : "#000"
          }
        >
          {item.name}
        </AppText>
      </AppButton>
    );
  };

  const renderDistrict = ({ item }) => {
    let isSelected = false;
    if (multiSelect) {
      isSelected =
        selectedDistricts.some(
          d => d.code === item.code
        );
    } else {
      isSelected =
        selectedDistrict?.code === item.code;
    }

    return (
      <AppButton
        onPress={() => handleSelectDistrict(item)}
        padding={12}
        row
        justifyContent="space-between"
      >
        <AppText
          color={
            isSelected
              ? ColorsGlobal.main
              : "#000"
          }
        >
          {item.name}
        </AppText>
        {isSelected &&
          <IconTickCircle />
        }
      </AppButton>
    );
  }

  return (
    <AppModal isVisible={isVisible} onClose={() => { onClose(); resetState(); }} heightPercent={0.8}>
      <AppView flex={1} gap={8}>
        {/* {step === 'province' && !provinceName && ( */}
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