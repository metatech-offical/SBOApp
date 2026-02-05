import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const BookingSuccess = ({
  eventData,
  numOfTicket,
}: {
  eventData?: any;
  numOfTicket?: number;
}) => {
  const navigation = useNavigation();
  const isPoppingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      isPoppingRef.current = true;
      navigateToTop();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const navigateToTop = () => {
    navigation.popToTop();
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        console.log('hardwareBack');
        isPoppingRef.current = true; // prevent loop
        navigateToTop();
        return true;
      };

      const backListener = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        if (isPoppingRef.current) {
          return;
        }
        e.preventDefault();
        isPoppingRef.current = true; // avoid infinite loop
        navigateToTop();
      });

      return () => {
        backListener.remove();
        unsubscribe();
        isPoppingRef.current = false;
      };
    }, [navigation]),
  );

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={{...StyleSheet.absoluteFillObject, opacity: 0.3}}>
        <AnimationBackground
          animationSource={require('@assets/animations/AuthAnimation4.json')}
          zIndex={0}
        />
      </View>
      <View style={styles.successContainer}>
        <FastImage
          source={require('@assets/images/tickIcon.png')}
          style={styles.successCheck}
        />
        <Text style={styles.successTitle}>Thank you for booking!</Text>
        <Text style={styles.successSubtitle}>
          Your ticket is confirmed. A QR code & receipt will be sent to you via
          email.
        </Text>
        <View style={styles.successCard}>
          <FastImage
            source={{
              uri: eventData?.eventCoverImageUrl,
            }}
            style={styles.successImage}
          />
          <View style={styles.successCardContent}>
            <Text style={styles.successEventName}>{eventData?.eventName}</Text>
            <Text style={styles.successTicketCount}>{numOfTicket} tickets</Text>
            {/* <TouchableOpacity>
              <Text style={styles.successQrText}>Show QR code</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookingSuccess;

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCheck: {
    height: 72,
    width: 72,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: fontSize.f16,
    color: '#FFFFFF',
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 8,
  },

  successSubtitle: {
    fontSize: fontSize.f13,
    color: '#FFFFFF60',
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    marginBottom: 24,
  },

  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 20,
    width: '100%',
  },

  successImage: {
    width: 56,
    height: 63,
    borderRadius: 10,
  },

  successCardContent: {
    marginLeft: 12,
    flex: 1,
  },

  successEventName: {
    color: '#fff',
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    marginBottom: 2,
  },

  successTicketCount: {
    color: '#FFFFFf60',
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginBottom: 6,
  },

  successQrText: {
    color: '#FFFFFf',
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    textDecorationLine: 'underline',
  },
});
