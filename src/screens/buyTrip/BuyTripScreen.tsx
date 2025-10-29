import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppInput from '../../components/common/AppInput'

export default function BuyTripScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  return (
    <View>
      <Text>BuyTripScreen</Text>
     <AppInput label="Số điện thoại *"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Nhập số điện thoại" 
        keyboardType="numeric" />
         <AppInput label="Số điện thoại *"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Nhập số điện thoại"
        keyboardType="numeric" />
    </View>
  )
}

const styles = StyleSheet.create({})