import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {SplashScreenProps} from '@navigation/screens';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SplashScreen = ({navigation}: SplashScreenProps) => {
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    let [accessToken, refreshToken] = await Promise.all([
      AsyncStorage.getItem('accessToken'),
      AsyncStorage.getItem('refreshToken'),
    ]);
    setTimeout(() => {
      if (!accessToken) {
        navigation.reset({
          index: 0,
          routes: [{name: 'AuthNavigator'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'MainNavigator'}],
        });
      }
    }, 3000);
  };

  return (
    <FastImage
      source={require('@assets/images/SplashScreen.png')}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SplashScreen;
