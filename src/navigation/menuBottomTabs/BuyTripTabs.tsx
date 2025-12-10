import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EventEmitter } from 'events'
import GroupAreaScreen from '../../screens/buyTrip/GroupAreaScreen'
import BuyTripScreen from '../../screens/buyTrip/BuyTripScreen'
import SaleTripsScreen from '../../screens/SaleTrips/SaleTripsScreen'
import AppButton from '../../components/common/AppButton'
import IconSort from '../../assets/icons/IconSort'
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip'
import InfoGroupScreen from '../../screens/buyTrip/InfoGroupScreen'
import AppView from '../../components/common/AppView'
import AppText from '../../components/common/AppText'
import MemberGroupScreen from '../../screens/buyTrip/MemberGroupScreen'
import GroupRulesScreen from '../../screens/buyTrip/GroupRulesScreen'
import NotificationScreen from './NotificationScreen'

export type BuyTripStackParamList = {
  GroupArea: undefined
  BuyTrip: {
    nameGroup: string;
    countMember: number;
    id_area: string;
    isJoin?:string;
  }
  SaleTrip: {
    id_area: string;
  };
  InfoGroup: {
    nameGroup: string;
    countMember: number;
  }
  GroupRules: {
    id_area?: string;
  }
  Notification: {
    id_area?: string;
  }
  MemberGroup: undefined;
}

export const buyTripEmitter = new EventEmitter()

const Stack = createNativeStackNavigator<BuyTripStackParamList>()

export default function BuyTripTabs() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [filters, setFilters] = useState({ direction: 'all', time: 'now' })

  const handleApplyFilter = (newFilters: any) => {
    setFilters(newFilters)
    buyTripEmitter.emit('onFilterChanged', newFilters)
    setIsModalVisible(false)
  }

  // ✅ Tạo header button component
  const HeaderRightButton = () => (
    <AppButton onPress={() => setIsModalVisible(true)}>
      <IconSort />
    </AppButton>
  )

  return (
    <>
      <Stack.Navigator >
        <Stack.Group screenOptions={{
          headerShown: true,
          // headerRight: HeaderRightButton,
        }}>
          <Stack.Screen
            name="GroupArea"
            component={GroupAreaScreen}
            options={{ headerTitle: 'Nhóm khu vực' }}
          />
          <Stack.Screen
            name="BuyTrip"
            component={BuyTripScreen}
            options={{
              headerTitleAlign: 'left',
              headerBackTitle: '',

            }}
          />
          <Stack.Screen
            name="InfoGroup"
            component={InfoGroupScreen}
            options={{
              headerBackTitle: '',
              headerTitle: 'Thông tin nhóm',
              headerTitleAlign: 'center'
            }}
          />

          <Stack.Screen
            name="Notification"
            component={NotificationScreen}
            options={{
              headerBackTitle: '',
              headerTitle: 'Thông tin nhóm',
              headerTitleAlign: 'center'
            }}
          />
           <Stack.Screen
            name="GroupRules"
            component={GroupRulesScreen}
            options={{
              headerBackTitle: '',
              headerTitle: 'Quy định nhóm',
              headerTitleAlign: 'center'
            }}
          />
          

        </Stack.Group>
        <Stack.Screen
          name="SaleTrip"
          component={SaleTripsScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Bán chuyến'
            ,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="MemberGroup"
          component={MemberGroupScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Thành viên nhóm'
            ,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>

      {/* ✅ Modal nằm ngoài Navigator để có thể overlay toàn màn hình */}
      <ModalBuyTrip
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        onApplyFilter={handleApplyFilter}
      />
    </>
  )
}