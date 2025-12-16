import { Alert, Image, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconUser from '../../assets/icons/IconUser';
import ButtonSubmit from '../../components/common/ButtonSubmit';
import AppButton from '../../components/common/AppButton';
import AppText from '../../components/common/AppText';
import ModalUploadCarImage from '../../components/component/modals/ModalUploadCarImage';
import IconCamera from '../../assets/icons/IconCamera';

import { RouteProp, useRoute } from '@react-navigation/native';
import { AccountTabsParamList } from '../../navigation/menuBottomTabs/AccountTabs';
import { useDriverApi } from '../../redux/hooks/userDriverApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootParamList } from '../../../App';
import { NumberFormat } from '../../utils/Helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AccountScreenNavProp = NativeStackNavigationProp<RootParamList>;

interface Props {
    navigation: AccountScreenNavProp;
}

export default function AccountInfoScreen({ navigation }: Props) {
    const route = useRoute<RouteProp<AccountTabsParamList, 'AccountInfoScreen'>>();
    const driverPre = route.params.data;

    const { driver, loading, error, successMessage, editDriver, clear } = useDriverApi();

    const [isDisplayModalUploadImage, setIsDisplayModalUploadImage] = useState(false);
    const [imageUri, setImageUri] = useState(driverPre?.image_avatar || '');
    const [experienceYears, setExperienceYears] = useState(driverPre?.experience_years || "--");

    useEffect(() => {
        if (successMessage) {
            Alert.alert('Thành công', successMessage, [
                {
                    text: 'OK',
                    onPress: () => {
                        clear();
                        navigation.navigate('RootNavigator');
                    },
                },
            ]);
        }

        if (error) {
            Alert.alert('Lỗi', error, [{ text: 'OK', onPress: clear }]);
        }
    }, [successMessage, error]);


    const SaveChangeInfo = async () => {
        try {
            const model = {
                image_avatar: imageUri,
                experience_years: experienceYears,
            };

            await editDriver(model);
        } catch (err: any) {
            Alert.alert('Thất bại', err?.message || 'Có lỗi xảy ra');
        }
    };

    const insets = useSafeAreaInsets();

    return (
        <AppView flex={1} backgroundColor={ColorsGlobal.backgroundWhite} padding={16} paddingBottom={Platform.OS === 'ios' ? insets.bottom : 0} gap={16}>

            {/* Avatar */}
            <AppButton justifyContent='center' alignItems='center' paddingBottom={40}>
                <View style={{ position: 'relative' }}>
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={{ width: 150, height: 150, borderRadius: 999 }}
                            resizeMode="cover"
                        />
                    ) : (
                        <AppView backgroundColor={ColorsGlobal.backgroundGray} radius={999} padding={20}>
                            <IconUser size={100} />
                        </AppView>
                    )}

                    {/* <AppButton
                        onPress={() => setIsDisplayModalUploadImage(true)}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: '#00000066',
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <IconCamera size={20} color="white" />
                    </AppButton> */}
                </View>
            </AppButton>

            {/* Info */}
            <AppView gap={16} borderWidth={1} borderColor={ColorsGlobal.borderColorDark} radius={10} padding={16}>

                <Item label="Tên hiển thị" value={driverPre.full_name} row />
                <Item label="Số điện thoại" value={driverPre.phone} row />
                <Item label="Địa chỉ" value={driverPre.address || 'Chưa cập nhật'}  row />
                <Item label="Năm kinh nghiệm" value={experienceYears} row />

                <AppView row gap={10}>
                    <Item label="Điểm hiện tại" value={String(NumberFormat(driverPre.current_points))} flex={1} />
                    <Item label="Chuyến nhận" value={String(NumberFormat(driverPre.total_trips_received))} flex={1} />
                    <Item label="Chuyến bán" value={String(NumberFormat(driverPre.total_trips_sold))} flex={1} />
                </AppView>

            </AppView>

            {/* <AppView marginTop={30}>
                <ButtonSubmit title='Lưu thay đổi' onPress={SaveChangeInfo} />
            </AppView> */}

            <ModalUploadCarImage
                isDisplay={isDisplayModalUploadImage}
                onClose={() => setIsDisplayModalUploadImage(false)}
                onSelectImage={(uri) => setImageUri(uri)}
            />
        </AppView>
    )
}

const Item = ({ label, value, flex ,row }: any) => (
    <AppView flex={flex} padding={row ?0: 12} backgroundColor={row?'transparent': '#F5F5F7'} radius={10} row={row} gap={10}  justifyContent={row?'space-between':'center'}>
        <AppText textAlign='center' fontWeight='600' marginBottom={4} color="#555">{label}</AppText>
        <AppText textAlign='center'  fontSize={row?16:20} bold={!row} color="#000">{value}</AppText>
    </AppView>
);

