import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BuyTripTabs from './menuBottomTabs/BuyTripTabs';
import ReceivingScheduleTabs from './menuBottomTabs/ReceivingScheduleTabs';
import SaleTripsTabs from './menuBottomTabs/SaleTripsTabs';
import PointTabs from './menuBottomTabs/PointTabs';
import AccountTabs from './menuBottomTabs/AccountTabs';
import IconMenu from '../assets/icons/IconMenu';
import IconReceiveHistory from '../assets/icons/IconReceiveHistory';
import IconTranferPoint from '../assets/icons/IconTranferPoint';
import IconUser from '../assets/icons/IconUser';
import { ColorsGlobal } from '../components/base/Colors/ColorsGlobal';

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
        <Tabs.Navigator  screenOptions={({ route }) => 
        ({
          
            tabBarActiveTintColor: ColorsGlobal.main,
            tabBarInactiveTintColor: ColorsGlobal.colorIconNoActive,

        })} >
            <Tabs.Screen name="BuyTripTabs" component={BuyTripTabs} 
            options={{ tabBarLabel: 'Mua chuyến',
            tabBarIcon: ({ color, size, focused })=> <IconMenu color={color} 
          />,
          headerShown:false
            }} />
            <Tabs.Screen name="ReceivingScheduleTabs" component={ReceivingScheduleTabs} options={{ tabBarLabel: 'Lịch nhận',
                   tabBarIcon: ({ color, size, focused })=> <IconReceiveHistory color={color}  />
             }} />
           
            <Tabs.Screen name="PointTabs" component={PointTabs} options={{ tabBarLabel: 'Đổi điểm' ,
                   tabBarIcon: ({ color, size, focused })=> <IconTranferPoint color={color}  />
            }} />
            <Tabs.Screen name="AccountTabs" component={AccountTabs} options={{ tabBarLabel: 'Tài khoản',
                   tabBarIcon: ({ color, size, focused })=> <IconUser color={color} />
             }} />
        </Tabs.Navigator>
    );
};
