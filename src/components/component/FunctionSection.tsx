
import React from 'react'
import { ActivityIndicator } from 'react-native'
import AppButton from '../common/AppButton'
import { ColorsGlobal } from '../base/Colors/ColorsGlobal'
import AppText from '../common/AppText'
import IconArrowDown from '../../assets/icons/IconArowDown'

interface Props {
    label: string;
    onPress?: () => void;
    loading?: boolean;
}
export default function FunctionSection({ label = 'Đổi mật khẩu', onPress, loading }: Props) {

    return (
        <AppButton onPress={onPress} row justifyContent={'space-between'} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={6} disabled={loading}>
            <AppText color={ColorsGlobal.textLight} >{label}</AppText>
            {loading ? <ActivityIndicator size="small" color={ColorsGlobal.main} /> : <IconArrowDown rotate={-90} size={20} />}
        </AppButton>
    )
}

