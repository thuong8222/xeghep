import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BuyTripTabs from './menuBottomTabs/BuyTripTabs';
import ReceivingScheduleTabs from './menuBottomTabs/ReceivingScheduleTabs';
import SaleTripsTabs from './menuBottomTabs/SaleTripsTabs';
import PointTabs from './menuBottomTabs/PointTabs';
import AccountTabs from './menuBottomTabs/AccountTabs';

export type BottomTabParamList = {
    BuyTripTabs: undefined;
    ReceivingScheduleTabs: undefined;
    SaleTripsTabs: undefined;
    PointTabs: undefined;
    AccountTabs: undefined;
};
const Tabs = createBottomTabNavigator<BottomTabParamList>();
export default function MenuBottomTabs() {

    return (
        <Tabs.Navigator>
            <Tabs.Screen name="BuyTripTabs" component={BuyTripTabs} options={{ tabBarLabel: 'Mua chuyến' }} />
            <Tabs.Screen name="ReceivingScheduleTabs" component={ReceivingScheduleTabs} options={{ tabBarLabel: 'Lịch nhận' }} />
            <Tabs.Screen name="SaleTripsTabs" component={SaleTripsTabs} options={{ tabBarLabel: 'Bán chuyến' }} />
            <Tabs.Screen name="PointTabs" component={PointTabs} options={{ tabBarLabel: 'Đổi điểm' }} />
            <Tabs.Screen name="AccountTabs" component={AccountTabs} options={{ tabBarLabel: 'Tài khoản' }} />
        </Tabs.Navigator>
    );
};
