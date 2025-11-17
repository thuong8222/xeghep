import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import AppModal from '../../common/AppModal';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AppView from '../../common/AppView';
import AppInput from '../../common/AppInput';
import { ColorsGlobal } from '../../base/Colors/ColorsGlobal';
import { removeVietnameseTones } from '../../../utils/Helper';
import { provinces } from '../../../utils/province';
import Container from '../../common/Container';

type ModalOnlySelectProvinceProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelected?: (data: { province: any }) => void;
};

export default function ModalOnlySelectProvince({
  isVisible,
  onClose,
  onSelected,
}: ModalOnlySelectProvinceProps) {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Filtered list based on search
  const filteredProvinces = provinces.filter((item) =>
    removeVietnameseTones(item?.name)
      .includes(removeVietnameseTones(searchText))
  );

  const handleSelectProvince = (province) => {
    setSelectedProvince(province);
    setSearchText('');
    onSelected?.({ province });
    onClose();
  };

  const renderProvince = ({ item }) => (
    <AppButton onPress={() => handleSelectProvince(item)} padding={12}>
      <AppText>{item.name}</AppText>
    </AppButton>
  );

  return (
    <AppModal isVisible={isVisible} onClose={onClose} heightPercent={0.8}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Container>
          <AppText bold fontSize={18} style={{ marginBottom: 12 }}>
            Chọn Tỉnh / Thành phố
          </AppText>

          {/* FlatList Header */}
          <FlatList
            data={filteredProvinces}
            keyExtractor={(item) => item.code}
            renderItem={renderProvince}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => (
              <AppView height={1} backgroundColor={ColorsGlobal.borderColor} />
            )}
            ListHeaderComponent={

              <AppInput
                type="search"
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Tìm kiếm tỉnh/thành phố..."

              />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </Container>
      </KeyboardAvoidingView>
    </AppModal>
  );
}
