import { Alert, Image, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import AppView from '../../components/common/AppView';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { validatePlateVN, validateYear } from '../../utils/Helper';
import ModalUploadCarImage from '../../components/component/modals/ModalUploadCarImage';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconCar from '../../assets/icons/iconCar';
import IconCamera from '../../assets/icons/IconCamera';
import ButtonSubmit from '../../components/common/ButtonSubmit';
import { useDriverApi } from '../../redux/hooks/userDriverApi';
import { AccountTabsParamList } from '../../navigation/menuBottomTabs/AccountTabs';
import { RouteProp, useRoute } from '@react-navigation/native';

export default function CarInfoScreen() {
    // --- gọi hook useRoute bên trong component ---
    const route = useRoute<RouteProp<AccountTabsParamList, 'CarInfoScreen'>>();
    const { driver, loading, error, successMessage, editDriver, clear } = useDriverApi();
    const driverPre = route.params.data;

    const [carInfo, setCarInfo] = useState({
        name: driverPre.name_car || '',
        year: driverPre.year_car || '',
        status: '',
        licensePlate: driverPre.license_number || '',
        brand: '',
        model: driverPre.model_car || '',
        color: driverPre.color_car || '',
        version: '',
        type: driverPre?.type_car || '',
        imageUri: driverPre.image_car || '',
    });

    const [errors, setErrors] = useState({
        year: '',
        licensePlate: '',
    });

    const [isDisplayModalUploadImage, setIsDisplayModalUploadImage] = useState(false);

    const handleChange = (key: keyof typeof carInfo, value: string) => {
        setCarInfo(prev => ({ ...prev, [key]: value }));
        if (key === 'year') setErrors(prev => ({ ...prev, year: validateYear(value) }));
        if (key === 'licensePlate') setErrors(prev => ({ ...prev, licensePlate: validatePlateVN(value) }));
    };

    const SaveChangeInfo = async () => {
        try {
            // Chuẩn bị dữ liệu từ state
            const model = {

                image_car: carInfo.imageUri || '',
                license_number: carInfo.licensePlate || '',
                name_car: carInfo.name || '',
                model_car: carInfo.model || '',
                year_car: carInfo.year || '',
                color_car: carInfo.color || '',

            };

            // Gọi API thông qua hook hoặc dispatch redux
            await editDriver(model);

        } catch (err: any) {
            Alert.alert('Thất bại', err?.message || 'Có lỗi xảy ra');
        }
    };
    const handleUploadPress = () => setIsDisplayModalUploadImage(true);

    return (
        <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16} gap={16}>
            {/* ====== ẢNH XE ====== */}
            <AppView justifyContent="center" alignItems="center" marginTop={8}>
                <View style={{ position: 'relative' }}>
                    {carInfo.imageUri ? (
                        <Image
                            source={{ uri: carInfo.imageUri }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <AppView padding={40} backgroundColor={ColorsGlobal.backgroundGray} radius={12}>
                            <IconCar size={100} />
                        </AppView>
                    )}

                    <AppButton
                        onPress={handleUploadPress}
                        style={styles.cameraButton}
                    >
                        <IconCamera size={18} />
                    </AppButton>
                </View>
            </AppView>

            {/* ====== FORM NHẬP ====== */}
            <AppView gap={8} flex={1}>
                <AppView row gap={12}>
                    <AppInput
                        flex={1}
                        value={carInfo.name}
                        onChangeText={(text) => handleChange('name', text)}
                        placeholder="Toyota, Kia..."
                        label="Tên xe"
                    />
                    <AppInput
                        flex={1}
                        value={carInfo.model}
                        onChangeText={(text) => handleChange('model', text)}
                        placeholder="Vios, Ranger..."
                        label="Dòng xe"
                    />
                </AppView>

                <AppView row gap={12}>
                    <AppInput
                        flex={1}
                        value={carInfo.color}
                        onChangeText={(text) => handleChange('color', text)}
                        placeholder="Đỏ, Trắng, Đen..."
                        label="Màu xe"
                    />
                    <AppInput
                        flex={1}
                        value={carInfo.year}
                        onChangeText={(text) => handleChange('year', text)}
                        keyboardType="decimal-pad"
                        error={errors.year}
                        placeholder="Năm sản xuất"
                        label="Năm"
                    />
                </AppView>
                <AppInput
                    value={carInfo.licensePlate}
                    onChangeText={(text) => handleChange('licensePlate', text)}
                    error={errors.licensePlate}
                    placeholder="VD: 51A-123.45"
                    label="Biển số xe"
                />
                <AppInput
                    value={carInfo.type}
                    onChangeText={(text) => handleChange('type', text)}
                    placeholder="4 chỗ, 7 chỗ..."
                    label="Loại xe"
                />
                <AppInput
                    value={carInfo.status}
                    onChangeText={(text) => handleChange('status', text)}
                    placeholder="Sẵn sàng/ Đang sửa..."
                    label="Trạng thái xe"
                />
            </AppView>
            <AppView>
                <ButtonSubmit title='Lưu thay đổi' onPress={SaveChangeInfo} />
            </AppView>

            {/* MODAL UPLOAD ẢNH */}
            <ModalUploadCarImage
                isDisplay={isDisplayModalUploadImage}
                onClose={() => setIsDisplayModalUploadImage(false)}
                onSelectImage={(uri) => setCarInfo(prev => ({ ...prev, imageUri: uri }))}
            />
        </AppView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    cameraButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
