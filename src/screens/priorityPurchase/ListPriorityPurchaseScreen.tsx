import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '../../components/common/Container'
import AppText from '../../components/common/AppText'
import AppButton from '../../components/common/AppButton'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import IconPlus from '../../assets/icons/IconPlus'
import { useNavigation } from '@react-navigation/native'
import AppView from '../../components/common/AppView'
import IconPencil from '../../assets/icons/iconPencil'
import IconArrowDown from '../../assets/icons/IconArowDown'
import IconClock from '../../assets/icons/IconClock'
import IconLocation from '../../assets/icons/iconLocation'
import IconMinus from '../../assets/icons/IconMinus'


export default function ListPriorityPurchaseScreen() {
    const navigation = useNavigation()
    const addNewTripAuto = () => {
        navigation.navigate('PriorityPurchaseScreen')
    }
    return (
        <Container style={{ position: 'relative' }}>
            <AppText textAlign='center' color={ColorsGlobal.main2} fontWeight={600}>{'[Danh sách khu vực bạn đăng ký mua chuyến tự động]'}</AppText>
            <AppView flex={1}>
                <AppView  gap={16} paddingTop={20} >
                    <AppView row backgroundColor={ColorsGlobal.backgroundLight} padding={10} radius={10} >
                        <AppView flex={1} gap={6}>
                            <AppView row justifyContent={'space-between'} >
                                <IconLocation />
                                <AppText fontSize={14}>{'Hà Đông, Hà Nội'}</AppText>
                                <IconArrowDown rotate={-90} color={ColorsGlobal.main2} />
                                <AppText fontSize={14}>{'Bãi Cháy, Quảng Ninh'}</AppText>
                            </AppView>
                            <AppView row gap={4} justifyContent={'space-between'} alignItems='center' >
                                <AppView row alignItems='center'>
                                    <AppText textAlign='center' fontSize={14}>{'Tối đa:'}</AppText>
                                    <AppText textAlign='center' color={ColorsGlobal.main} bold>{'10 điểm '}</AppText>
                                </AppView>


                                <IconMinus color={ColorsGlobal.main2} />
                                <AppText textAlign='center' color={ColorsGlobal.main2} bold>{' 200K'}</AppText>
                            </AppView>
                            <AppView row gap={4} >
                                <IconClock />
                                <AppText fontSize={14} color={ColorsGlobal.textLight} >{'dd/mm/yyyy-dd/mm/yyyy'}</AppText>
                            </AppView>

                        </AppView>

                        <AppButton paddingLeft={16} justifyContent='center'>
                            <IconPencil color={ColorsGlobal.main} size={18} />
                        </AppButton>
                    </AppView>
                    <AppView row backgroundColor={ColorsGlobal.backgroundLight} padding={10} radius={10} >
                        <AppView flex={1} gap={6}>
                            <AppView row justifyContent={'space-between'} >
                                <IconLocation />
                                <AppText fontSize={14}>{'Hà Đông, Hà Nội'}</AppText>
                                <IconArrowDown rotate={-90} color={ColorsGlobal.main2} />
                                <AppText fontSize={14}>{'Bãi Cháy, Quảng Ninh'}</AppText>
                            </AppView>
                            <AppView row gap={4} justifyContent={'space-between'} alignItems='center' >
                                <AppView row alignItems='center'>
                                    <AppText textAlign='center' fontSize={14}>{'Tối đa:'}</AppText>
                                    <AppText textAlign='center' color={ColorsGlobal.main} bold>{'10 điểm '}</AppText>
                                </AppView>


                                <IconMinus color={ColorsGlobal.main2} />
                                <AppText textAlign='center' color={ColorsGlobal.main2} bold>{' 200K'}</AppText>
                            </AppView>
                            <AppView row gap={4} >
                                <IconClock />
                                <AppText fontSize={14} color={ColorsGlobal.textLight} >{'dd/mm/yyyy-dd/mm/yyyy'}</AppText>
                            </AppView>

                        </AppView>

                        <AppButton paddingLeft={16} justifyContent='center'>
                            <IconPencil color={ColorsGlobal.main} size={18} />
                        </AppButton>
                    </AppView>
                </AppView>
            </AppView>
            <AppButton onPress={addNewTripAuto} position={'absolute'} right={36} bottom={34} width={48} height={48} radius={999} backgroundColor={ColorsGlobal.main} justifyContent='center' alignItems='center'>
                <IconPlus size={20} />
            </AppButton>
        </Container>
    )
}

const styles = StyleSheet.create({})