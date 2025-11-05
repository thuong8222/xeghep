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
import IconUploadIcloud from '../../assets/icons/IconUploadIcloud';
import IconSearch from '../../assets/icons/IconSearch';
import AppView from './AppView';

interface CustomInputProps extends TextInputProps {
    label?: string;
    value: string;
    onChangeText?: (text: string) => void;
    isLoading?: boolean;
    keyboardType?: TextInputProps['keyboardType'];
    marginTop?: number;
    type?: 'number' | 'email' | 'text' | 'phone' | 'password' | 'select' | 'upload' | 'search';
    error?: string;
    onUploadPress?: () => void;
    toggleSelect?: () => void;
    onSearchPress?: () => void;
}
const AppInput: React.FC<CustomInputProps> = ({
    label,
    value,
    onChangeText,
    onUploadPress, toggleSelect, onSearchPress,
    isLoading = false,
    keyboardType = 'default',
    marginTop = 10,
    type,
    error,
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
            {/* Thêm View container bên ngoài */}
            <View style={[styles.container, { marginTop }]}>
                <View style={styles.inputContainer}>
                    {label && (
                        <Text
                            style={[
                                styles.inputLabel,
                                {
                                    color: isFocused ? ColorsGlobal.main2 : ColorsGlobal.textDark,
                                }
                            ]}
                        >
                            {label}
                        </Text>
                    )}
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
                        editable={!isLoading && type !== 'upload'}
                        secureTextEntry={secureTextEntry}
                        {...rest}
                        returnKeyType={type === 'search' ? 'search' : 'done'}
                        onSubmitEditing={
                            type === 'search'
                                ? () => {
                                    Keyboard.dismiss();
                                    onSearchPress?.();
                                }
                                : undefined
                        }
                    />
                    {type === 'password' && (
                        <AppButton onPress={toggleShowPassword} position={'absolute'} right={13} top={12}>
                            {secureTextEntry ? <IconEyeOff size={24} /> : <IconEye size={24} />}
                        </AppButton>
                    )}
                    {type === 'select' && (
                        <AppButton onPress={toggleSelect} position={'absolute'} right={13} top={12}>
                            <IconArowDown />
                        </AppButton>
                    )}
                    {type === 'upload' && (
                        <AppButton onPress={onUploadPress} position={'absolute'} right={13} top={12}>
                            <IconUploadIcloud />
                        </AppButton>
                    )}
                    {type === 'search' && (
                            <AppButton onPress={onSearchPress} position={'absolute'} right={13} top={12}>
                            <IconSearch />
                          </AppButton>
                    )}
                </View>
                {error ? (
                    <AppText color={'red'} style={{ marginTop: 4, fontSize: 12 }}>{error}</AppText>
                ) : null}
            </View>
        </TouchableWithoutFeedback>
    );
}
export default AppInput;
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    inputWrapper: {
        marginBottom: scale(15),
        gap: scale(4)
    },
    labelFocused: {
        color: ColorsGlobal.main2,
    },
    inputLabel: {
        fontSize: 14, lineHeight: 20, fontWeight: '400',
        marginBottom: scale(6), position: 'absolute', top: -10, left: scale(20), zIndex: 4, paddingHorizontal: scale(6), backgroundColor: ColorsGlobal.backgroundWhite,
    },
    inputLabelPass: {
        width: scale(70),
    },
    input: {
        backgroundColor: 'white',
        color: '#000',
        height:scale(50) ,
        padding: scale(10),
        paddingLeft: scale(20),
        borderWidth: 1,

        width: '100%',
        borderRadius: 6,
        position: 'relative'
    },
});