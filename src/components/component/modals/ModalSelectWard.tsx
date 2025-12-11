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
  onSelected: () => void;
}

export default function SelectProvinceDistrictModal({ isVisible, onClose, onSelected }: Props) {
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
    setSearchText(''); // reset search khi sang bước huyện

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
  // ⭕ Multi Select
  const toggleSelectDistrict = (district) => {
    setSelectedDistricts(prev => {
      const exists = prev.find(item => item.code === district.code);
      if (exists) {
        return prev.filter(x => x.code !== district.code);
      }
      return [...prev, district];
    });
  };

  // ⭕ Confirm: gửi toàn bộ xã/phường ra ngoài
  const handleConfirm = () => {
    if (!selectedProvince || selectedDistricts.length === 0) return;

    onSelected({
      province: selectedProvince,
      districts: selectedDistricts,
    });

    onClose();
  };
  // const handleSelectDistrict = (district) => {
  //   onSelected({
  //     province: selectedProvince,
  //     district,
  //   });
  //   onClose();
  //   setStep('province');
  //   setSearchText('');
  // };

  // ✅ Lọc danh sách theo searchText
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
        onPress={() => toggleSelectDistrict(item)}
        padding={12}
        row
        justifyContent="space-between"
      >
        <AppText>{item.name}</AppText>
        {isSelected ? <IconTickCircle /> : <IconNoneTickCircle />}
      </AppButton>
    );
  };

  // const renderDistrict = ({ item }) => (
  //   <AppButton onPress={() => handleSelectDistrict(item)} padding={12}>
  //     <AppText>{item.name}</AppText>
  //   </AppButton>
  // );

  return (
    <AppModal isVisible={isVisible} onClose={onClose} heightPercent={0.8}>
      <AppView flex={1} gap={8}>
        {step === 'province' && (
          <>
            <AppText bold fontSize={18}>Chọn Tỉnh / Thành phố</AppText>
            {/* ✅ Ô nhập tìm kiếm tỉnh */}
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
            <AppText bold fontSize={18}>Chọn Xã / Phường thuộc {selectedProvince?.name}</AppText>
            <AppButton onPress={() => { setStep('province'); setSearchText(''); }}>
              <AppText>{"⬅ Quay lại"}</AppText>
            </AppButton>

            <AppInput
              type='search'
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm kiếm xã/phường..."
            />

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
