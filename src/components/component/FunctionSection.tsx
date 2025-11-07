
import React from 'react'
import AppButton from '../common/AppButton'
import { ColorsGlobal } from '../base/Colors/ColorsGlobal'
import AppText from '../common/AppText'
import IconArrowDown from '../../assets/icons/IconArowDown'

interface Props {
    label: string;
    onPress?: () => void;
}
export default function FunctionSection({ label = 'Đổi mật khẩu', onPress }: Props) {

    return (
        <AppButton onPress={onPress} row justifyContent={'space-between'} padding={12} borderWidth={1} borderColor={ColorsGlobal.borderColor} radius={6}>
            <AppText color={ColorsGlobal.textLight} >{label}</AppText>
            <IconArrowDown rotate={-90} size={20} />
        </AppButton>
    )
}

