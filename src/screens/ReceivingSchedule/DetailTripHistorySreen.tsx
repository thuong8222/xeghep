import { Linking, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import IconUser from '../../assets/icons/IconUser';
import AppButton from '../../components/common/AppButton';
import IconClock from '../../assets/icons/IconClock';
import IconLocation from '../../assets/icons/iconLocation';
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal';
import IconPhone from '../../assets/icons/iconPhone';
import moment from 'moment';

export default function DetailTripHistorySreen({ route }) {
    const data = route.params.data;
    const driverSell = data.driver_sell || {};

    return (
        <AppView style={styles.container}>

            {/* --- Header tài xế bán chuyến --- */}
            <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Tài xế bán chuyến</AppText>

                <View style={styles.row}>
                    <IconUser size={22} />
                    <AppText style={styles.value}>
                        {driverSell.full_name} ({driverSell.phone})
                    </AppText>

                    <AppButton

                        onPress={() => {
                            Linking.openURL(`tel:${driverSell.phone}`);
                        }}
                        style={styles.callBtn}
                        row gap={8} alignItems='center'
                    >
                        <IconPhone />
                        <AppText color={ColorsGlobal.main2}>{'Gọi'}</AppText>

                    </AppButton>
                </View>
            </View>

            {/* --- Thông tin hành trình --- */}
            <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Thông tin chuyến</AppText>

                <View style={styles.row}>
                    <IconLocation />
                    <AppText style={styles.label}>Điểm đi:</AppText>
                    <AppText style={styles.value}>{data.place_start}</AppText>
                </View>

                <View style={styles.row}>
                    <IconLocation />
                    <AppText style={styles.label}>Điểm đến:</AppText>
                    <AppText style={styles.value}>{data.place_end}</AppText>
                </View>

                <View style={styles.row}>
                    <IconUser />
                    <AppText style={styles.label}>Số khách:</AppText>
                    <AppText style={styles.value}>{data.guests}</AppText>
                </View>

                <View style={styles.row}>
                    <IconClock />
                    <AppText style={styles.label}>Giờ xuất phát:</AppText>
                    <AppText style={styles.value}>
                        {moment(data.time_start).format('DD-MM-YYYY hh:mm')}
                    </AppText>
                </View>

                <View style={styles.row}>
                    <IconClock />
                    <AppText style={styles.label}>Giờ nhận chuyến:</AppText>
                    <AppText style={styles.value}>
                        {moment(data.time_receive).format('DD-MM-YYYY hh:mm')}
                    </AppText>
                </View>
            </View>

            {/* --- Giá – Point --- */}
            <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Thanh toán & Điểm</AppText>

                <View style={styles.row}>
                    <AppText style={styles.label}>Điểm chuyến:</AppText>
                    <AppText style={styles.value}>{data.point}</AppText>
                </View>

                <View style={styles.row}>
                    <AppText style={styles.label}>Giá bán:</AppText>
                    <AppText style={styles.price}>{data.price_sell}k</AppText>
                </View>
            </View>

            {/* --- Ghi chú --- */}
            {data.note ? (
                <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>Ghi chú</AppText>
                    <AppText style={styles.note}>{data.note}</AppText>
                </View>
            ) : null}

            {/* --- Nút quay lại --- */}
            <AppButton
                title="Quay lại"
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
            />

        </AppView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,

    },
    label: {
        fontSize: 14,
        width: 110,
        color: '#555',
        marginLeft: 6,

    },
    value: {
        fontSize: 14,
        color: '#111',
        flex: 1,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#d9534f',
    },
    note: {
        fontSize: 14,
        color: '#444',
        marginTop: 6,
    },
    callBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    backBtn: {
        marginTop: 10,
    }
});

