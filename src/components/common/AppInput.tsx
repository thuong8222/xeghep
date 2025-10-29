import { Animated, TouchableWithoutFeedback, Platform, StyleSheet, Text, TextInput, TextInputProps, View, Keyboard, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import AppButton from './AppButton';
import { ColorsGlobal } from '../base/Colors/ColorsGlobal';
import { scale } from '../../utils/Helper';
import AppText from './AppText';

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

    const labelStyle = {
        position: "absolute",
        left: 20,
        top: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [18, -8],
        }),
        fontSize: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [14, 12],
        }),
        color: "#007927",
        opacity: animated, // 👈 Fade in/out mượt
        backgroundColor: "#fff",
        paddingHorizontal: 4,
        zIndex: 3,
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[ { marginTop }]}>
                <View style={{ position: 'relative' }}>
                    {/* Animated Text label */}
                    <Animated.Text style={labelStyle}>{label}</Animated.Text>

                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: isFocused ? '#007927' : '#ccc' },
                        ]}
                        value={value}
                        onChangeText={onChangeText}
                        keyboardType={keyboardType}
                        placeholderTextColor="#999"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        editable={!isLoading}
                        {...rest}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
export default AppInput;
const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 15,
    },
    labelFocused: {
        color: '#007927',
    },
    inputLabel: {
        position: 'absolute',
        top: -8,          // đẩy label lên một chút
        left: 20,         // canh vị trí
        fontSize: 12,
        color: '#5C5C5C',
        zIndex: 2,
        paddingHorizontal: 4, // để tạo khoảng trống nhỏ giữa border
        backgroundColor: 'transparent', // không cần nền
    },
    inputLabelPass: {
        width: 70,
    },
    input: {
        backgroundColor: 'white',
        color: '#000',
        height: 52,
        padding: 10,
        paddingLeft: 20,
        borderWidth: 1,
        marginBottom: 5,
        width: '100%',
        borderRadius: 6,

    },
});