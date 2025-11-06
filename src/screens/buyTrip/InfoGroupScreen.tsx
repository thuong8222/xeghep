import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import IconArowDown from '../../assets/icons/IconArowDown';
import ModalRequestJoinGroup from '../../components/component/modals/ModalRequestJoinGroup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyTripStackParamList } from '../../navigation/menuBottomTabs/BuyTripTabs';


type BuyTripProps = NativeStackNavigationProp<BuyTripStackParamList>;
interface Props {
    navigation: BuyTripProps;
}

export default function InfoGroupScreen({ route, navigation }:Props) {
    const { nameGroup, countMember } = route.params;
    const [isModalRequestJoinGroup, setIsModalRequestJoinGroup] = useState(false);
    const RequestJoinGroup = () => {
        setIsModalRequestJoinGroup(true)
    }
    return (
        <AppView padding={20} flex={1} backgroundColor={ColorsGlobal.backgroundWhite}>
            <AppView alignItems='center' padding={12}>
                <AppText fontSize={18} fontWeight={700} lineHeight={26}>{nameGroup}</AppText>
                <AppText fontWeight={500} >{countMember + ' thành viên'}</AppText>
            </AppView>
            <AppView>
                <AppButton onPress={() => navigation.navigate('MemberGroup')} row justifyContent={'space-between'} padding={12}>
                    <AppText >{'Danh sách thành viên '}</AppText>
                    <IconArowDown rotate={-90} size={20} />
                </AppButton>
                <AppButton onPress={() => Alert.alert('Đang phát triển')} row justifyContent={'space-between'} padding={12}>
                    <AppText >{'Thông báo'}</AppText>
                    <IconArowDown rotate={-90} size={20} />
                </AppButton>
                <AppButton onPress={() => Alert.alert('Đang phát triển')} row justifyContent={'space-between'} padding={12}>
                    <AppText >{'Quy định nhóm'}</AppText>
                    <IconArowDown rotate={-90} size={20} />
                </AppButton>
                <AppButton onPress={RequestJoinGroup} row justifyContent={'space-between'} padding={12}>
                    <AppText >{'Xin vào nhóm'}</AppText>
                </AppButton>
            </AppView>
            <ModalRequestJoinGroup visible={isModalRequestJoinGroup} onRequestClose={() => setIsModalRequestJoinGroup(false)} />
        </AppView>
    )
}

const styles = StyleSheet.create({})