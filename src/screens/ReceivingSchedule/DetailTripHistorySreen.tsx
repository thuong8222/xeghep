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
import IconComment from '../../assets/icons/iconComment';
import { useAppContext } from '../../context/AppContext';

export default function DetailTripHistorySreen({ route, navigation }) {
    const data = route?.params?.data;
    // console.log('data DetailTripHistorySreen: ', data)
    const { currentDriver } = useAppContext();
    const isSeller = currentDriver?.id === data?.id_driver_sell;
    // console.log('isSeller: ', isSeller)
    const driverSell = data?.driver_sell || {};
    const driverReceive = data?.driver_receive;
    const isSold = data?.is_sold;
    const formatTime = (value) => {
        if (!value) return "--";

        // Nếu là số → có thể là seconds hoặc milliseconds
        if (typeof value === "number") {
            const ts = value.toString().length > 10 ? value / 1000 : value;
            return moment.unix(ts).format("DD-MM-YYYY HH:mm");
        }

        // Nếu là chuỗi nhưng là số
        if (!isNaN(value)) {
            const num = Number(value);
            const ts = value.length > 10 ? num / 1000 : num;
            return moment.unix(ts).format("DD-MM-YYYY HH:mm");
        }

        // Trường hợp chuỗi dạng ISO
        const m = moment(value);
        if (m.isValid()) return m.format("DD-MM-YYYY HH:mm");

        return "--";
    };
    const gotoChat = () => {
        navigation.navigate('ChatScreen', { data: data })
    }
    let status_ = '';

    if (isSold === 1) {
        status_ = isSeller ? 'Đã bán' : 'Đã nhận';
    } else if (isSold === 2 && data?.status === 0) {
        status_ = 'Đã huỷ';
    } else {
        status_ = 'Không bán được';
    }
    return (
        <AppView style={styles.container}>
            <AppView padding={16} marginBottom={16} borderWidth={1} borderColor={isSold === 1 ? 'green' : 'red'} radius={999} row justifyContent={'space-between'}>
                <AppText  >{'Trạng thái: '}</AppText>
                <AppText textAlign={'right'} color={isSold === 1 ? 'green' : 'red'}>{status_}</AppText>
            </AppView>
            {/* --- Header tài xế bán chuyến --- */}
            {isSold === 1 &&
                <View style={styles.section}>

                    <AppView>


                        <AppText style={styles.sectionTitle}>{isSeller ? 'Tài xế nhận chuyến' : 'Tài xế bán chuyến: '}</AppText>
                        {isSeller ?
                            <View style={styles.row}>
                                <IconUser size={22} />
                                <AppText style={styles.value}>
                                    {driverReceive?.full_name} ({driverReceive?.phone})
                                </AppText>
                            </View> :
                            <View style={styles.row}>
                                <IconUser size={22} />
                                <AppText style={styles.value}>
                                    {driverSell?.full_name} ({driverSell?.phone})
                                </AppText>
                            </View>
                        }
                    </AppView>

                    <AppView row justifyContent={'space-between'} alignItems={'center'}>
                        <AppButton
                            row gap={6}
                            onPress={gotoChat}
                        >
                            <IconComment color={ColorsGlobal.main} />
                            <AppText color={ColorsGlobal.main}>{isSeller ? 'Chat với lái xe nhận' : 'Chat với lái xe bán'}</AppText>
                        </AppButton>
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
                    </AppView>
                </View>
            }
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
                        {formatTime(data.time_start)}
                    </AppText>
                </View>

                <View style={styles.row}>
                    <IconClock />
                    <AppText style={styles.label}>Giờ nhận chuyến:</AppText>
                    <AppText style={styles.value} color={ColorsGlobal.main2}>
                        {formatTime(data.time_receive)}
                    </AppText>
                </View>

            </View>

            {/* --- Giá – Point --- */}
            <View style={styles.section}>
                <AppText style={styles.sectionTitle}>Thanh toán & Điểm</AppText>

                <View style={styles.row}>
                    <AppText style={styles.label}>Điểm chuyến:</AppText>
                    <AppText style={styles.value}>{'-' + data.point + ' điểm'}</AppText>
                </View>

                <View style={styles.row}>
                    <AppText style={styles.label}>Thu khách:</AppText>
                    <AppText style={styles.price}>{data.price_sell}K</AppText>
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

