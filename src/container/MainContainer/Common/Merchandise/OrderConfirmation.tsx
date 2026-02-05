import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {OrderConfirmationProps} from '@navigation/screens';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import LottieView from 'lottie-react-native';
import CustomButton from '@components/CustomButtons/CustomButton';

const OrderConfirmation = ({navigation, route}: OrderConfirmationProps) => {
  const handleRedirect = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'MainNavigator'}],
    });
  };
  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <LottieView
          source={require('@assets/animations/Success.json')}
          autoPlay
          loop
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={styles.title}>Thank you for shopping!</Text>
        <Text style={styles.description}>
          Your order is confirmed. A tracking link will be sent to you via
          email.
        </Text>
        <CustomButton
          text="Continue"
          onPress={handleRedirect}
          isLoading={false}
          btnStyle={styles.btnStyle}
          textStyle={styles.textStyle}
        />
      </View>
    </View>
  );
};

export default OrderConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: '30%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textAlign: 'center',
    marginTop: 10,
  },
  description: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    textAlign: 'center',
    marginTop: 10,
    width: '80%',
  },
  btnStyle: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  textStyle: {
    color: Colors.black,
  },
});
