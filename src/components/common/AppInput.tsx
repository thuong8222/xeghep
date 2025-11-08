import { Animated, TouchableWithoutFeedback, Platform, StyleSheet, Text, TextInput, TextInputProps, View, Keyboard, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import AppButton from './AppButton';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import { scale } from '../../utils/Helper';
import AppText from './AppText';

import IconEyeOff from '../../assets/icons/iconEyeOff';
import IconEye from '../../assets/icons/iconEyeOpen';
import IconArowDown from '../../assets/icons/IconArowDown';
import IconUploadIcloud from '../../assets/icons/IconUploadIcloud';
import IconSearch from '../../assets/icons/IconSearch';
import IconCalendar from '../../assets/icons/IconCalendar';
import { ViewBaseProps } from 'react-native/types_generated/Libraries/Components/View/ViewPropTypes';


interface CustomInputProps extends TextInputProps {
    label?: string;
    flex?: ViewBaseProps['flex'];
    value: string
    onChangeText?: (text: string) => void;
    isLoading?: boolean;
    keyboardType?: TextInputProps['keyboardType'];
    marginTop?: number;
    type?: 'number' | 'email' | 'text' | 'phone' | 'password' | 'select' | 'upload' | 'search' | 'default' | 'calendar';
    error?: string;
    onUploadPress?: () => void;
    toggleSelect?: () => void;
    onSearchPress?: () => void;
    onCalendarPress?: () => void;
}
const AppInput: React.FC<CustomInputProps> = ({
    label,flex,
    value,
    onChangeText,
    onUploadPress, toggleSelect, onSearchPress, onCalendarPress,
    isLoading = false,
    keyboardType = 'default',
    marginTop = 10,
    type = 'default',
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
            <View style={[styles.container, { marginTop, flex }]}>
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
                            { borderColor: isFocused ? ColorsGlobal.main2 : ColorsGlobal.borderColor, paddingRight: type !== 'default' ? 40 : 20 },
                        ]}
                        value={value}
                        onChangeText={onChangeText}
                        keyboardType={keyboardType}
                        placeholderTextColor={ColorsGlobal.placeholderText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        editable={!isLoading && type !== 'upload'}
                        secureTextEntry={secureTextEntry}
                        autoComplete='password'

                        key={secureTextEntry ? 'secure' : 'not-secure'}
                        autoCorrect={false}

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
                        <AppButton onPress={toggleShowPassword} position={'absolute'} paddingHorizontal={13} right={0} top={scale(12)}>
                            {secureTextEntry ? <IconEyeOff size={24} /> : <IconEye size={24} />}
                        </AppButton>
                    )}
                    {type === 'select' && (
                        <AppButton onPress={toggleSelect} position={'absolute'} paddingHorizontal={13} right={0} top={scale(13)}>
                            <IconArowDown />
                        </AppButton>
                    )}
                    {type === 'upload' && (
                        <AppButton onPress={onUploadPress} position={'absolute'} paddingHorizontal={13} right={0} top={10}>
                            <IconUploadIcloud />
                        </AppButton>
                    )}
                    {type === 'search' && (
                        <AppButton disabled onPress={onSearchPress} position={'absolute'} paddingHorizontal={13} right={0} top={scale(13)}>
                            <IconSearch />
                        </AppButton>
                    )}

                    {type === 'calendar' && (
                        <AppButton  onPress={onCalendarPress} position={'absolute'} paddingHorizontal={13} right={0} top={scale(13)}>
                            <IconCalendar />
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
        height: scale(50),
        padding: scale(10),
        paddingLeft: scale(20),
        borderWidth: 1,

        width: '100%',
        borderRadius: 6,
        position: 'relative'
    },
});