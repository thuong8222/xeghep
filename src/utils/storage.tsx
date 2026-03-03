import AsyncStorage from '@react-native-async-storage/async-storage';

// Lưu credentials
const saveBiometricCredentials = async (phone: string, password: string) => {
    try {
        await AsyncStorage.setItem('biometric_phone', phone);
        await AsyncStorage.setItem('biometric_password', password);
    } catch (e) {
        console.warn('Save credentials error:', e);
    }
};

// Lấy credentials
const getBiometricCredentials = async () => {
    try {
        const phone = await AsyncStorage.getItem('biometric_phone');
        const password = await AsyncStorage.getItem('biometric_password');
        if (phone && password) return { username: phone, password };
        return null;
    } catch (e) {
        return null;
    }
};
export { saveBiometricCredentials, getBiometricCredentials };