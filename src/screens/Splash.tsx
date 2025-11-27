// src/screens/LottieSplash.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import SplashScreen from 'react-native-splash-screen';

const LottieSplash = ({ onFinish }) => {

  useEffect(() => {
    // Ẩn native splash
    SplashScreen.hide();

    // // Thời gian chờ để hiển thị animation (nếu cần)
    // const timer = setTimeout(() => {
    //   SplashScreen.hide(); // Ẩn native splash sau khi animation kết thúc
    // }, 3000); // Thời gian chờ (3 giây)

    // return () => clearTimeout(timer);
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
  
});

export default LottieSplash;
