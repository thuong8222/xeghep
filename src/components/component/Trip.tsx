import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../common/AppView';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import AppText from '../common/AppText';
import IconChevronLeftDouble from '../../assets/icons/IconChevronLeftDouble';
import moment from 'moment';
import ArrowRight from '../../assets/icons/ArrowRight';
import AppButton from '../common/AppButton';
import IconNote from '../../assets/icons/IconNote';

export default function Trip(props) {
    const isAppearance = props.data.Trip.note || props.data.Trip.price_note || props.data.Trip.service_note1 || props.data.Trip.service_note2 || props.data.Trip.service_note3;
    const [expandsNotes, setExpandsNotes] = useState(false);
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
    const expandNotes = () => {
        setExpandsNotes(!expandsNotes)
    }

    return (
        <AppView padding={16} gap={12} radius={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} backgroundColor={ColorsGlobal.backgroundTrip}>
            <AppView row justifyContent={'space-between'}>
                <AppView row alignItems='center' gap={8}>
                    {isAppearance &&
                        <AppButton onPress={expandNotes}>
                            <IconNote />
                        </AppButton>
                    }
                    <AppText fontWeight={600} color={props.data.Trip.direction === 1 ? ColorsGlobal.main : ColorsGlobal.main2}>{props.data.Trip.full_name_guest}</AppText>
                    <IconChevronLeftDouble rotate={props.data.Trip.direction === 1 ? 0 : 180} color={props.data.Trip.direction === 1 ? ColorsGlobal.main : ColorsGlobal.main2} />
                </AppView>

                <AppView row gap={8}>
                    <AppText fontWeight={600}>{moment(props.data.Trip.time_sell).format('hh:mm')}</AppText>
                    <AppText color={ColorsGlobal.main2}>{`+15'`}</AppText>
                </AppView>
            </AppView>
            <AppView row gap={8} >
                <AppView borderBottomColor={ColorsGlobal.borderColor} borderBottomWidth={1} paddingVertical={10} flex={1}>
                    <AppText fontSize={14} lineHeight={20}>{props.data.Trip.place_start.split(',')[0].trim()}</AppText>
                </AppView>
                <AppView alignItems='center' justifyContent='center'  >
                    <ArrowRight />
                </AppView>

                <AppView borderBottomColor={ColorsGlobal.borderColor} borderBottomWidth={1} paddingVertical={10} flex={1}>
                    <AppText fontSize={14} lineHeight={20}>{props.data.Trip.place_end.split(',')[0].trim()}</AppText>
                </AppView>
            </AppView>
            <AppView row justifyContent={'space-between'}>
                <AppText color={ColorsGlobal.main} fontWeight={700}>{props.data.Trip.price_sell + "K"}</AppText>
                <AppText fontWeight={700}>{'-' + props.data.Trip.point + ' đ'}</AppText>
                <AppText fontWeight={600}>{props.data.Trip.guests + ' khách'}</AppText>
            </AppView>
            {expandsNotes && renderExpandedNotes()}
        </AppView>
    )
}


