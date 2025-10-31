import { Animated, TouchableWithoutFeedback, Platform, StyleSheet, Text, TextInput, TextInputProps, View, Keyboard, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import AppButton from './AppButton';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import { scale } from '../../utils/Helper';
import AppText from './AppText';
import { StyleGlobal } from '../base/StyleGlobal';

interface CustomInputProps extends TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    isLoading?: boolean;
    keyboardType?: TextInputProps['keyboardType'];
    marginTop?: number;
}
const AppInput: React.FC<CustomInputProps> = ({
    label,
    value,
    onChangeText,
    isLoading = false,
    keyboardType = 'default',
    marginTop = 0,
    ...rest

}) => {

    const [isFocused, setIsFocused] = useState(false);
    const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animated, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[{ marginTop }, { flex: 1, marginTop: 10 }]}>

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