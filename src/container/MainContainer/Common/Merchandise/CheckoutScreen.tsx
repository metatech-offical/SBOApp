import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import React, {useState} from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import {CheckoutScreenProps} from '@navigation/screens';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import CheckoutListItem from '@components/ScreenLayouts/UserMerchandise/CheckoutListItem';
import useAddress from '@hooks/useAddress';
import AddressDetail from '@components/ScreenLayouts/UserMerchandise/AddressDetail';
import CustomButton from '@components/CustomButtons/CustomButton';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {useToastMessage} from '@hooks/useToastMessage';

const CheckoutScreen = ({navigation, route}: CheckoutScreenProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [isPaying, setIsPaying] = useState(false);
  const {cartData, screenType} = route?.params || {
    cartData: [],
    screenType: 'from_cart',
  };
  const {selectedAddress, handleCreateOrder, isCreatingOrder} = useAddress();

  const handleAddAddress = () => {
    navigation.navigate('GetAllAddress');
  };

  const openPaymentSheet = async (clientSecret: string) => {
    const {error: initError} = await initPaymentSheet({
      merchantDisplayName: 'SBO',
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: false,
      returnURL: 'sbo://stripe-redirect',
    });

    if (initError) {
      showError(initError.message || 'Unable to start payment');
      return false;
    }

    const {error: presentError} = await presentPaymentSheet();
    if (presentError) {
      if (presentError.code !== 'Canceled') {
        showError(presentError.message || 'Payment failed');
      }
      return false;
    }

    return true;
  };

  const handleCreateOrderPress = async () => {
    if (!selectedAddress) {
      showError('Please select an address');
      return;
    }

    const payload = {
      addressId: selectedAddress?._id || '',
      checkoutType: screenType,
      checkoutItems: cartData.map(item => ({
        productId: item?.productId?._id || '',
        quantity: item?.quantity || 1,
        variant: {
          size: item?.variant?.size || '',
          color: item?.variant?.color || '',
          sku: item?.variant?.sku || '',
          price: item?.variant?.price || 0,
        },
      })),
    };

    setIsPaying(true);
    try {
      const result = await handleCreateOrder(payload);
      const clientSecret = result?.data?.clientSecret;

      if (!result?.success || !clientSecret) {
        if (result?.success && !clientSecret) {
          showError('Payment could not be started. Please try again.');
        }
        return;
      }

      const paid = await openPaymentSheet(clientSecret);
      if (paid) {
        showSuccess('Payment successful');
        navigation.navigate('OrderConfirmation');
      }
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <StackHeader title="Checkout" onBackPress={() => navigation.goBack()} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={cartData}
          renderItem={({item}) => (
            <CheckoutListItem
              item={item}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  _id: item?.productId?._id,
                })
              }
            />
          )}
        />
        {selectedAddress ? (
          <AddressDetail
            selectedAddress={selectedAddress}
            addressOnPress={() => navigation.navigate('GetAllAddress')}
            editAddressOnPress={() =>
              navigation.navigate('AddAddressScreen', {
                addressId: selectedAddress?._id,
              })
            }
            isEditable={true}
          />
        ) : (
          <TouchableOpacity
            onPress={handleAddAddress}
            style={styles.addressContainer}>
            <Text style={styles.addressText}>Delivery Address</Text>
            <TouchableOpacity
              onPress={handleAddAddress}
              style={styles.addAddressContainer}>
              <Text style={styles.addAddressText}>Add</Text>
              <FastImage
                source={require('@assets/images/editAddressIcon.png')}
                style={styles.addressIcon}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        <CustomButton
          text="Pay with card"
          onPress={handleCreateOrderPress}
          isLoading={isCreatingOrder || isPaying}
          btnStyle={styles.btnStyle}
          textStyle={styles.textStyle}
        />
      </View>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  btnStyle: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  textStyle: {
    color: Colors.black,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginTop: 30,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 10,
    padding: 10,
    minHeight: 55,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '94%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  addAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  addressIcon: {
    width: 20,
    height: 20,
  },
  addressText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  addAddressText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
});
