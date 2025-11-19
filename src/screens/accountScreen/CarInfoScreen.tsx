import { Alert, Image, Platform, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import AppView from '../../components/common/AppView';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { DRIVER_STATUS, DRIVER_STATUS_LABELS, validatePlateVN, validateYear } from '../../utils/Helper';
import ModalUploadCarImage from '../../components/component/modals/ModalUploadCarImage';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconCar from '../../assets/icons/iconCar';
import IconCamera from '../../assets/icons/IconCamera';
import ButtonSubmit from '../../components/common/ButtonSubmit';
import { useDriverApi } from '../../redux/hooks/userDriverApi';
import { AccountTabsParamList } from '../../navigation/menuBottomTabs/AccountTabs';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalSelectStatus from '../../components/component/modals/ModalSelectStatusCar';

export default function CarInfoScreen() {
    // --- gọi hook useRoute bên trong component ---
    const route = useRoute<RouteProp<AccountTabsParamList, 'CarInfoScreen'>>();
    const { driver, loading, error, successMessage, editDriver, clear } = useDriverApi();
    const driverPre = route.params.data;
    console.log('driverPre info xe: ', driverPre)
    const [carInfo, setCarInfo] = useState({
        name: driverPre.name_car || '',
        year: driverPre.year_car || '',
        status: driverPre.status_car || 1,
        licensePlate: driverPre.license_number || '',

        model: driverPre.model_car || '',
        color: driverPre.color_car || '',

        type: driverPre?.type_car || '',
        imageUri: driverPre.image_car || '',
    });

    const [errors, setErrors] = useState({
        year: '',
        licensePlate: '',
    });

    const [isDisplayModalUploadImage, setIsDisplayModalUploadImage] = useState(false);
    const [status, setStatus] = useState(driverPre?.status_car ?? DRIVER_STATUS.MAINTENANCE);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const closeModalSelectStatus = () => {
        setIsStatusModalVisible(false)
    }
    const handleChange = (key: keyof typeof carInfo, value: string) => {
        setCarInfo(prev => ({ ...prev, [key]: value }));
        if (key === 'year') setErrors(prev => ({ ...prev, year: validateYear(value) }));
        if (key === 'licensePlate') setErrors(prev => ({ ...prev, licensePlate: validatePlateVN(value) }));
    };

    const SaveChangeInfo = async () => {
        try {

            const model = {
                image_car: carInfo.imageUri || '',
                license_number: carInfo.licensePlate || '',
                name_car: carInfo.name || '',
                model_car: carInfo.model || '',
                year_car: carInfo.year || '',
                color_car: carInfo.color || '',
                status_car: carInfo.status || '',
                type_car: carInfo.type || ''
            };
            console.log('model: ', model)

            await editDriver(model);

        } catch (err: any) {
            Alert.alert('Thất bại', err?.message || 'Có lỗi xảy ra');
        }
    };
    const handleUploadPress = () => setIsDisplayModalUploadImage(true);
    const insets = useSafeAreaInsets()
    return (
        <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16} gap={16} paddingBottom={Platform.OS === 'ios' ? insets.bottom : 0}>
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
                    {/* <AppInput
                        flex={1}
                        value={carInfo.year}
                        onChangeText={(text) => handleChange('year', text)}
                        keyboardType="decimal-pad"
                        error={errors.year}
                        placeholder="Năm sản xuất"
                        label="Năm"
                    /> */}
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
                    value={DRIVER_STATUS_LABELS[status] || carInfo.status}
                    onChangeText={(text) => handleChange('status', text)}
                    placeholder="Sẵn sàng/ Đang bảo chì..."
                    label="Trạng thái xe"
                    type='select'
                    toggleSelect={() => setIsStatusModalVisible(true)}
                />
            </AppView>
            <AppView>
                <ButtonSubmit title='Lưu thay đổi' onPress={SaveChangeInfo} />
            </AppView>
            <ModalSelectStatus isVisible={isStatusModalVisible} onClose={closeModalSelectStatus} selectedStatus={status}
                onSelect={(id) => setStatus(id)} />
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
