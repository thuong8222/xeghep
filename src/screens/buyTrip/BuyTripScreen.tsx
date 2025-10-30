import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import { listTrips } from '../../dataDemoJson'
import AppButton from '../../components/common/AppButton'
import AppText from '../../components/common/AppText'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip'
import ArrowRight from '../../assets/icons/ArrowRight'

export default function BuyTripScreen() {
const [isOpenModalBuyTrip, setIsOpenModalBuyTrip] = useState(false);

    const renderItem_trip = ({ item }) => {
        return (<Trip data={item} />)
    }
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };
    const buyTrip = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        // const newData = [...listData];
        // const prevIndex = listData.findIndex(item => item.key === rowKey);
        // newData.splice(prevIndex, 1);
        // setListData(newData);
        Alert.alert('thanh cong', `Mua Chuyến thanh cong`);
        setIsOpenModalBuyTrip(true)

    };
    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <AppButton style={[styles.backBtn, styles.backBtnRight]} onPress={() => buyTrip(rowMap, data.item.key)}>
                <Text style={styles.backBtnText}>{'Mua chuyến'}</Text>
            </AppButton>
        </View>
    );
    return (
        <AppView flex={1} backgroundColor='#fff' padding={16} position='relative'>
            <SwipeListView
                data={listTrips}
                renderItem={renderItem_trip} ItemSeparatorComponent={() => <AppView height={16} />}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-131}
                disableRightSwipe={false}
                onRowDidOpen={rowKey => console.log(`Hàng ${rowKey} đã mở`)} />
            <AppButton position={'absolute'} right={16} bottom={37} width={48} height={48} radius={999} backgroundColor={ColorsGlobal.main} justifyContent='center' alignItems='center'><AppText color={'#fff'} fontSize={45}>{'+'}</AppText>
            </AppButton>
            <ModalBuyTrip  visible={isOpenModalBuyTrip} onRequestClose={()=>setIsOpenModalBuyTrip(false)}/>
        </AppView>
    )
}
const Trip = (props) => {

    const renderExpandedNotes = () => {
        return (
            <AppView paddingTop={12} borderTopWidth={1} borderTopColor={ColorsGlobal.borderColor}>
                {props.data.Trip.note && <AppText color={ColorsGlobal.textNote} fontSize={14} lineHeight={20} fontStyle={'italic'} fontWeight={400}>{props.data.Trip.note}</AppText>}
                {props.data.Trip.price_note && <AppText color={ColorsGlobal.textNote} fontSize={14} lineHeight={20} fontStyle={'italic'} fontWeight={400}>{props.data.Trip.price_note}</AppText>}
                {props.data.Trip.service_note1 && <AppText color={ColorsGlobal.textNote} fontSize={14} lineHeight={20} fontStyle={'italic'} fontWeight={400}>{props.data.Trip.service_note1}</AppText>}
                {props.data.Trip.service_note2 && <AppText color={ColorsGlobal.textNote} fontSize={14} lineHeight={20} fontStyle={'italic'} fontWeight={400}>{props.data.Trip.service_note2}</AppText>}
                {props.data.Trip.service_note3 && <AppText color={ColorsGlobal.textNote} fontSize={14} lineHeight={20} fontStyle={'italic'} fontWeight={400}>{props.data.Trip.service_note3}</AppText>}

            </AppView>
        );
    };

    return (
        <AppView padding={16} gap={12} radius={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} backgroundColor={ColorsGlobal.backgroundTrip}>
            <AppView row justifyContent={'space-between'}>
                <AppText fontWeight={600}>{props.data.Trip.full_name_guest}</AppText>
                <AppView row gap={8}>
                    <AppText fontWeight={600}>{moment(props.data.Trip.time_sell).format('hh:mm')}</AppText>
                    <AppText color={ColorsGlobal.main2}>{`+15'`}</AppText>
                </AppView>
            </AppView>
            <AppView row >
                <AppView borderColor={ColorsGlobal.borderColor} borderWidth={1} radius={6} padding={10} paddingLeft={14} flex={1}>
                    <AppText fontSize={14} lineHeight={20}>{props.data.Trip.place_start}</AppText>
                </AppView>
                <AppView marginLeft={-12} zIndex={3} marginRight={-12} alignItems='center' justifyContent='center'  >
                <ArrowRight />
                </AppView>
            
                <AppView borderColor={ColorsGlobal.borderColor} borderWidth={1} radius={6} padding={10} paddingLeft={14} flex={1}>
                    <AppText fontSize={14} lineHeight={20}>{props.data.Trip.place_end}</AppText>
                </AppView>
            </AppView>
            <AppView row justifyContent={'space-between'}>
                <AppText color={ColorsGlobal.main} fontWeight={700}>{props.data.Trip.price_sell + "K"}</AppText>
                <AppText fontWeight={700}>{'-1đ'}</AppText>
                <AppText fontWeight={600}>{'1 khách'}</AppText>
            </AppView>
            {renderExpandedNotes()}
        </AppView>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 50,
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',

        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    backBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 131,
    },
    backBtnRight: {
        backgroundColor: ColorsGlobal.main,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        right: 0,
    },
    backBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
