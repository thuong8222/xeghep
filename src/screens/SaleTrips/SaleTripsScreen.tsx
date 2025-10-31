import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppView from '../../components/common/AppView'
import AppText from '../../components/common/AppText'
import IconTickCircle from '../../assets/icons/IconTickCircle'
import AppButton from '../../components/common/AppButton'
import IconNoneTickCircle from '../../assets/icons/IconNoneTickCircle'
import AppInput from '../../components/common/AppInput'
import IconDotHorizonal from '../../assets/icons/IconDotHorizonal'
import { ColorsGlobal } from '../../components/base/Colors/ColorsGlobal'
import IconPlus from '../../assets/icons/IconPlus'
import IconArowDown from '../../assets/icons/IconArowDown'
import IconMinus from '../../assets/icons/IconMinus'
import ButtonSubmit from '../../components/common/ButtonSubmit'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SaleTripsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDirection, setSelectedDirection] = useState<'go' | 'back'>('go');
  const [moreInputStart, setMoreInputStart] = useState(false);
  const [moreInputEnd, setMoreInputEnd] = useState(false);
  const [placeStart, setPlaceStart] = useState('');
  const [placeEnd, setPlaceEnd] = useState('');
  const toggleMoreDetailStart = () => {
    setMoreInputStart(!moreInputStart)
  }
  const toggleMoreDetailEnd = () => {
    setMoreInputEnd(!moreInputEnd)
  }
  const SubmitToSale =()=>{
    console.log('ddang ban')
  }
  return (

    <AppView flex={1} backgroundColor='#fff' padding={16} gap={24}  >
   
      <AppView row gap={32}>
        <AppButton onPress={() => setSelectedDirection('go')} row gap={8}>
          <AppText>{'Chiều đi'}</AppText>
          {selectedDirection === 'go' ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>
        <AppButton onPress={() => setSelectedDirection('back')} row gap={8}>
          <AppText>{'Chiều về'}</AppText>
          {selectedDirection === 'back' ? <IconTickCircle /> : <IconNoneTickCircle />}
        </AppButton>
      </AppView>
      <ScrollView style={{flex:1}}>
        <AppView gap={24}>
      <AppView gap={6}>
        <AppView gap={6}>
          <AppView row gap={8} alignItems='flex-end' justifyContent={'space-between'}>
            <AppInput label="Điểm đón"
              value={placeStart}
              onChangeText={setPlaceStart}
              placeholder="Nhập điểm đón"
            />
            <AppButton onPress={toggleMoreDetailStart} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={4} height={50} width={50} alignItems='center' justifyContent='center'>
              <IconDotHorizonal />
            </AppButton>

          </AppView>
          {moreInputStart &&
            <AppView row gap={16} >
              <AppInput label="Xã"
                value={placeStart}
                onChangeText={setPlaceStart}
                placeholder="Chọn xã"
              />
              <AppInput label="Tỉnh"
                value={placeStart}
                onChangeText={setPlaceStart}
                placeholder="Chọn tỉnh"
              />
            </AppView>
          }
        </AppView>
        <AppView gap={6}>
          <AppView row gap={8} alignItems='flex-end' justifyContent={'space-between'}>
            <AppInput label="Điểm đón"
              value={placeStart}
              onChangeText={setPlaceStart}
              placeholder="Nhập điểm đón"
            />
            <AppButton onPress={toggleMoreDetailEnd} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={4} height={50} width={50} alignItems='center' justifyContent='center'>
              <IconDotHorizonal />
            </AppButton>

          </AppView>
          {moreInputEnd &&
            <AppView row gap={16} >
              <AppInput label="Xã"
                value={placeStart}
                onChangeText={setPlaceStart}
                placeholder="Chọn xã"
              />
              <AppInput label="Tỉnh"
                value={placeStart}
                onChangeText={setPlaceStart}
                placeholder="Chọn tỉnh"
              />
            </AppView>
          }
        </AppView>

      </AppView>

      <AppView borderTopWidth={1} paddingTop={24} borderTopColor={ColorsGlobal.borderColor} gap={16}>
        <AppView row justifyContent={'space-between'}>
          <AppText>{'Thời gian :'}</AppText>
          <AppView row gap={8}>
            <AppText fontWeight={700}>{'Đi ngay'}</AppText>
            <AppView row gap={8}>
              <AppButton><IconMinus size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
              <AppText fontWeight={700}>{'10ph'}</AppText>
              <AppButton><IconPlus size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
            </AppView>
          </AppView>
        </AppView>
        <AppView row justifyContent={'space-between'}>
          <AppText>{'Hẹn giờ :'}</AppText>
          <AppView row gap={8} alignItems='center'>
            <AppView row gap={4} alignItems='center' paddingVertical={2} paddingHorizontal={4}>
              <AppText color={ColorsGlobal.textLight} fontSize={14} lineHeight={20} >{'Từ'}</AppText>
              <AppText fontWeight={700} borderBottomWidth={1} borderBottomColor={ColorsGlobal.borderColor}>{'00:00'}</AppText>
              <AppButton><IconArowDown size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
            </AppView>
            <AppView row gap={4} alignItems='center' paddingVertical={2} paddingHorizontal={4}>
              <AppText color={ColorsGlobal.textLight} fontSize={14} lineHeight={20} >{'Đến'}</AppText>
              <AppText fontWeight={700}>{'00:00'}</AppText>
              <AppButton><IconArowDown size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
            </AppView>

          </AppView>
        </AppView>
        <AppView row justifyContent={'space-between'}>
          <AppText>{'Số khách :'}</AppText>
          <AppView row gap={8}>

            <AppButton><IconMinus size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
            <AppText fontWeight={700}>{'1 chỗ'}</AppText>
            <AppButton><IconPlus size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>

          </AppView>
        </AppView>
        <AppView row justifyContent={'space-between'}>
          <AppText>{'Giá tiền :'}</AppText>
          <AppView row gap={8}>
            <AppButton><IconMinus size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
            <AppText fontWeight={700}>{'250K'}</AppText>
            <AppButton><IconPlus size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
          </AppView>
        </AppView>
        <AppView row justifyContent={'space-between'}>
          <AppText>{'Điểm bán :'}</AppText>
          <AppView row gap={8}>
            <AppButton><IconMinus size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
            <AppText fontWeight={700}>{'1 điểm'}</AppText>
            <AppButton><IconPlus size={20} color={ColorsGlobal.colorIconNoActive} /></AppButton>
          </AppView>
        </AppView>
      </AppView>


      <AppView borderTopWidth={1} paddingTop={24} borderTopColor={ColorsGlobal.borderColor} gap={16}  width={'100%'}>
        <AppView borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={8} paddingVertical={12} paddingHorizontal={16} width={'100%'}  alignItems='flex-start' justifyContent={'flex-start'}   >
          <AppText fontStyle={'italic'} color={ColorsGlobal.textLight} fontSize={14}>{'Ghi chú: Nhập ghi chú.... '}</AppText>
          <AppView marginTop={10} row gap={8} flexWrap={'wrap'} >
            <AppButton borderWidth={1} borderColor={ColorsGlobal.borderColor} paddingVertical={2} paddingHorizontal={12} radius={99} >
              <AppText fontStyle='italic' color={ColorsGlobal.textLight} fontSize={14}>{'Đón đúng giờ'}</AppText>
            </AppButton>
            <AppButton borderWidth={1} borderColor={ColorsGlobal.borderColor} paddingVertical={2} paddingHorizontal={12} radius={99} >
              <AppText fontStyle='italic' color={ColorsGlobal.textLight} fontSize={14}>{'Xe 7 chỗ'}</AppText>
            </AppButton>
            <AppButton borderWidth={1} borderColor={ColorsGlobal.borderColor} paddingVertical={2} paddingHorizontal={12} radius={99} >
              <AppText fontStyle='italic' color={ColorsGlobal.textLight} fontSize={14}>{'Không ngồi ghế cuối'}</AppText>
            </AppButton>
            <AppButton borderWidth={1} borderColor={ColorsGlobal.borderColor} paddingVertical={2} paddingHorizontal={12} radius={99} >
              <AppText fontStyle='italic' color={ColorsGlobal.textLight} fontSize={14}>{'Thân thiện, hỗ trợ hành lý'}</AppText>
            </AppButton>
            <AppButton borderWidth={1} borderColor={ColorsGlobal.borderColor} paddingVertical={2} paddingHorizontal={12} radius={99} >
              <AppText fontStyle='italic' color={ColorsGlobal.textLight} fontSize={14}>{'Xe mới, sạch sẽ'}</AppText>
            </AppButton>
          </AppView>
        </AppView>
      </AppView>
      </AppView>
      </ScrollView>
      <ButtonSubmit title='Đăng bán'  onPress={SubmitToSale}/>
    </AppView>

  )
}

const styles = StyleSheet.create({})