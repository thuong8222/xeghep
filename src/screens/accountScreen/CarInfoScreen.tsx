import { Image, Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconCar from '../../assets/icons/iconCar';
import { DRIVER_STATUS_LABELS } from '../../utils/Helper';
import { AccountTabsParamList } from '../../navigation/menuBottomTabs/AccountTabs';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* ======================
   Component hiển thị 1 dòng
====================== */
const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <AppView gap={4} row justifyContent={'space-between'}>
        <AppText fontSize={14} color={ColorsGlobal.textLight} fontWeight={'600'}>
            {label}
        </AppText>
        <AppText fontSize={16}>
            {value || '--'}
        </AppText>
    </AppView>
);

export default function CarInfoScreen() {
    const route = useRoute<RouteProp<AccountTabsParamList, 'CarInfoScreen'>>();
    const driverPre = route.params.data;
    const insets = useSafeAreaInsets();

    return (
        <AppView
            flex={1}
            backgroundColor={ColorsGlobal.backgroundWhite}
            padding={16}
            gap={24}
            paddingBottom={Platform.OS === 'ios' ? insets.bottom : 16}
        >
            {/* ====== ẢNH XE ====== */}
            <AppView justifyContent="center" alignItems="center">
                <View>
                    {driverPre.image_car ? (
                        <Image
                            source={{ uri: driverPre.image_car }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <AppView
                            padding={40}
                            backgroundColor={ColorsGlobal.backgroundGray}
                            radius={12}
                        >
                            <IconCar size={100} />
                        </AppView>
                    )}
                </View>
            </AppView>

            {/* ====== THÔNG TIN XE ====== */}
            <AppView gap={16} borderWidth={1} padding={16} radius={8} borderColor={ColorsGlobal.borderColorDark} >
                <InfoRow label="Tên xe" value={driverPre.name_car} />
                <InfoRow label="Dòng xe" value={driverPre.model_car} />
                <InfoRow label="Màu xe" value={driverPre.color_car} />
                <InfoRow label="Loại xe" value={driverPre.type_car} />
                <InfoRow label="Biển số xe" value={driverPre.license_number} />
                <InfoRow
                    label="Trạng thái xe"
                    value={DRIVER_STATUS_LABELS[driverPre.status_car]}
                />
            </AppView>
        </AppView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 220,
        height: 220,
        borderRadius: 12,
    },
});
