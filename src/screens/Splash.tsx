// src/screens/LottieSplash.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import SplashScreen from 'react-native-splash-screen';

const LottieSplash = ({ onFinish }) => {

  useEffect(() => {
    // Ẩn native splash
    SplashScreen.hide();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/man_waiting_car.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish} // Khi animation xong -> vào app chính
        style={styles.animation}
      />
      <Text style={styles.title}>Welcome to My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: { width: 250, height: 250 },
  title: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginTop: 20 },
});

export default LottieSplash;
