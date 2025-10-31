import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EventEmitter } from 'events' // ✅ Import đúng
import GroupAreaScreen from '../../screens/buyTrip/GroupAreaScreen'
import BuyTripScreen from '../../screens/buyTrip/BuyTripScreen'
import SaleTripsScreen from '../../screens/SaleTrips/SaleTripsScreen'
import AppButton from '../../components/common/AppButton'
import IconSort from '../../assets/icons/IconSort'
import ModalBuyTrip from '../../components/component/modals/ModalBuyTrip'

export type BuyTripStackParamList = {
  GroupArea: undefined
  BuyTrip: undefined
  SaleTrip: undefined
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
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerRight: HeaderRightButton, // ✅ Pass component reference
        }}
      >
        <Stack.Screen
          name="GroupArea"
          component={GroupAreaScreen}
          options={{ headerTitle: 'Nhóm khu vực' }}
        />
        <Stack.Screen
          name="BuyTrip"
          component={BuyTripScreen}
          options={{ headerTitle: 'Mua chuyến' }}
        />
        <Stack.Screen
          name="SaleTrip"
          component={SaleTripsScreen}
          options={{
            headerTitle: 'Bán chuyến',
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