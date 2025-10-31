import { Animated, TouchableWithoutFeedback, Platform, StyleSheet, Text, TextInput, TextInputProps, View, Keyboard, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import AppButton from './AppButton';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import { scale } from '../../utils/Helper';
import AppText from './AppText';
import { StyleGlobal } from '../base/StyleGlobal';
import IconEyeOff from '../../assets/icons/iconEyeOff';
import IconEye from '../../assets/icons/iconEyeOpen';
import IconArowDown from '../../assets/icons/IconArowDown';

interface CustomInputProps extends TextInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    isLoading?: boolean;
    keyboardType?: TextInputProps['keyboardType'];
    marginTop?: number;
    type?: 'number' | 'email' | 'text' | 'phone' | 'password' | 'select';
    error?: string;
}
const AppInput: React.FC<CustomInputProps> = ({
    label,
    value,
    onChangeText,
    isLoading = false,
    keyboardType = 'default',
    marginTop = 0,
    type, error,

    ...rest

}) => {

    const [isFocused, setIsFocused] = useState(false);
    const animated = useRef(new Animated.Value(value ? 1 : 0)).current;
    const [secureTextEntry, setSecureTextEntry] = useState(type === 'password');
    useEffect(() => {
        Animated.timing(animated, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);
    const toggleShowPassword = () => {
        setSecureTextEntry(prev => !prev);
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[{ marginTop }, { flex: 1, marginTop: 10, flexDirection: 'row', alignItems: 'center' }]}>
{label && 
                <Text
                    style={[
                        {
                            color: isFocused ? ColorsGlobal.main2 : ColorsGlobal.textDark,
                        },
                        styles.inputLabel
                    ]}
                >
                    {label}
                </Text>
            }
                <TextInput
                    style={[
                        styles.input,
                        { borderColor: isFocused ? ColorsGlobal.main2 : ColorsGlobal.borderColor },
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    placeholderTextColor={ColorsGlobal.placeholderText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    editable={!isLoading}
                    {...rest}
                />
                {type === 'password' && (
                    <AppButton onPress={toggleShowPassword} position={'absolute'} right={13}>
                        {secureTextEntry ?
                            <IconEyeOff size={24} /> : <IconEye size={24} />
                        }
                    </AppButton>

                )}
                {type === 'select' && (
                    <AppButton onPress={toggleShowPassword} position={'absolute'} right={13}>
                        <IconArowDown />
                    </AppButton>

                )}


                {error ? (
                    <AppText color={'red'} style={{ marginTop: 4, fontSize: 12 }}>{error}</AppText>
                ) : null}

            </View>
        </TouchableWithoutFeedback>
    );
}
export default AppInput;
const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 15,
        gap: 4
    },
    labelFocused: {
        color: '#007927',
    },
    inputLabel: {
        fontSize: 14, lineHeight: 20, fontWeight: '400',
        marginBottom: 6, position: 'absolute', top: -10, left: 20, zIndex: 4, paddingHorizontal: 6, backgroundColor: ColorsGlobal.backgroundWhite,
    },
    inputLabelPass: {
        width: 70,
    },
    input: {
        backgroundColor: 'white',
        color: '#000',
        height: 50,
        padding: 10,
        paddingLeft: 20,
        borderWidth: 1,

        width: '100%',
        borderRadius: 6,
        position: 'relative'
    },
});