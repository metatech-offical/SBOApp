import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import {CheckoutScreenProps} from '@navigation/screens';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import CheckoutListItem from '@components/ScreenLayouts/UserMerchandise/CheckoutListItem';
import useAddress from '@hooks/useAddress';
import FastImage from 'react-native-fast-image';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {useToastMessage} from '@hooks/useToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronDownSmallIcon} from '@assets/svg/HomeScreenIcon';
import Svg, {Path, Rect} from 'react-native-svg';
import {
  DUMMY_DELIVERY_ADDRESS,
  isDummyProductId,
} from '@utils/dummyMerchandise';

type PaymentMethod = 'card' | 'paypal' | 'google_pay' | 'cod';

const formatAddressLine = (address?: any) =>
  [
    address?.streetNo,
    address?.buildingName,
    address?.city,
    address?.areaDistrict,
    address?.landmark,
  ]
    .filter(Boolean)
    .join(', ');

const CardIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Rect
      x={1.5}
      y={3.5}
      width={13}
      height={9}
      rx={1.6}
      stroke="white"
      strokeWidth={1.4}
    />
    <Path d="M1.5 6.2H14.5" stroke="white" strokeWidth={1.4} />
    <Path
      d="M4.3 10.2H4.31"
      stroke="white"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M7 10.2H8.4"
      stroke="white"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

const CashIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Rect
      x={2}
      y={4.5}
      width={14}
      height={9}
      rx={2}
      stroke="#CAC9CE"
      strokeWidth={1.25}
    />
    <Path
      d="M9 6.2V12.8"
      stroke="#CAC9CE"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeDasharray="4 4"
    />
  </Svg>
);

const PayPalLogo = () => (
  <Text style={styles.payPalText}>
    <Text style={styles.payPalPay}>Pay</Text>
    <Text style={styles.payPalPal}>Pal</Text>
  </Text>
);

const GooglePayLogo = () => (
  <View style={styles.googlePayRow}>
    <Text style={styles.googleG}>
      <Text style={{color: '#4285F4'}}>G</Text>
    </Text>
    <Text style={styles.googlePayText}>Pay</Text>
  </View>
);

const GradientOutline = ({
  children,
  style,
  innerStyle,
}: {
  children: React.ReactNode;
  style?: any;
  innerStyle?: any;
}) => (
  <LinearGradient
    colors={['#1AD655', '#8800FF']}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
    style={[styles.gradientOutline, style]}>
    <View style={[styles.gradientInner, innerStyle]}>{children}</View>
  </LinearGradient>
);

const CheckoutScreen = ({navigation, route}: CheckoutScreenProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {bottom} = useSafeAreaInsets();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const {cartData, screenType} = route?.params || {
    cartData: [],
    screenType: 'from_cart',
  };
  const {selectedAddress, handleCreateOrder, isCreatingOrder} = useAddress();
  const isDummyCheckout = cartData?.some(item =>
    isDummyProductId(item?.productId?._id),
  );
  const deliveryAddress = isDummyCheckout
    ? DUMMY_DELIVERY_ADDRESS
    : selectedAddress;
  const totalAmount = useMemo(
    () =>
      (cartData || []).reduce(
        (sum, item) => sum + (item?.variant?.price || 0) * (item?.quantity || 1),
        0,
      ),
    [cartData],
  );

  const handleAddAddress = () => {
    navigation.navigate('GetAllAddress');
  };

  const openPaymentSheet = async (clientSecret: string) => {
    const {error: initError} = await initPaymentSheet({
      merchantDisplayName: 'Smart App',
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

  const handlePayNow = async () => {
    if (isDummyCheckout) {
      navigation.navigate('OrderConfirmation');
      return;
    }

    if (!selectedAddress) {
      showError('Please select an address');
      return;
    }

    if (paymentMethod === 'cod') {
      showError('Cash on delivery is not available for this order yet');
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
      <GlowBackground />
      <View style={styles.contentOverlay}>
        <MerchandiseHeader
          onBackPress={() => navigation.goBack()}
          onCartPress={() => navigation.navigate('CartListScreen')}
          isCartVisible={false}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: Math.max(bottom, 16) + 8},
          ]}>
          <View style={styles.list}>
            {(cartData || []).map((item, index) => (
              <CheckoutListItem
                key={`${item?.productId?._id}-${item?.variant?.sku || index}`}
                item={item}
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    _id: item?.productId?._id,
                  })
                }
              />
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAddAddress}
            style={styles.card}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressLabel}>Delivery Address</Text>
              <TouchableOpacity onPress={handleAddAddress} hitSlop={12}>
                <FastImage
                  source={require('@assets/images/editAddressIcon.png')}
                  style={styles.addressIcon}
                />
              </TouchableOpacity>
            </View>
            {deliveryAddress ? (
              <>
                <View style={styles.addressNameRow}>
                  <Text style={styles.addressName}>
                    {deliveryAddress.fullName}
                  </Text>
                  {!!(
                    deliveryAddress.countryCode || deliveryAddress.mobileNumber
                  ) && (
                    <>
                      <View style={styles.addressDivider} />
                      <Text style={styles.addressPhone}>
                        {deliveryAddress.countryCode}{' '}
                        {deliveryAddress.mobileNumber}
                      </Text>
                    </>
                  )}
                </View>
                <Text style={styles.addressLine}>
                  {formatAddressLine(deliveryAddress)}
                </Text>
              </>
            ) : (
              <Text style={styles.addressLine}>Add a delivery address</Text>
            )}
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.paymentsTitle}>Payments</Text>
            <Text style={styles.paymentsSubtitle}>
              Use credit / debit card
            </Text>
            <TouchableOpacity
              style={styles.methodRow}
              activeOpacity={0.8}
              onPress={() => setPaymentMethod('card')}>
              <View
                style={[
                  styles.radio,
                  paymentMethod === 'card' && styles.radioSelected,
                ]}>
                <CardIcon />
              </View>
              <Text style={styles.methodText}>+ Add new card</Text>
            </TouchableOpacity>
            <Text style={styles.orPayWith}>or pay with</Text>
            <View style={styles.walletRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPaymentMethod('paypal')}
                style={
                  paymentMethod === 'paypal' ? styles.walletSelected : undefined
                }>
                <GradientOutline
                  style={styles.paypalButton}
                  innerStyle={styles.paypalInner}>
                  <PayPalLogo />
                </GradientOutline>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPaymentMethod('google_pay')}
                style={
                  paymentMethod === 'google_pay'
                    ? styles.walletSelected
                    : undefined
                }>
                <GradientOutline
                  style={styles.gpayButton}
                  innerStyle={styles.gpayInner}>
                  <GooglePayLogo />
                </GradientOutline>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.codRow}
            activeOpacity={0.8}
            onPress={() => setPaymentMethod('cod')}>
            <View
              style={[
                styles.radio,
                paymentMethod === 'cod' && styles.radioSelected,
              ]}>
              <CashIcon />
            </View>
            <Text style={styles.codText}>Cash on Delivery</Text>
            <ChevronDownSmallIcon
              width={10}
              height={6}
              stroke="#FFFFFF"
              strokeOpacity={0.43}
            />
          </TouchableOpacity>

          <View style={styles.totalBlock}>
            <View style={styles.inclusiveRow}>
              <View style={styles.inclusiveDot} />
              <Text style={styles.inclusiveText}>*inclusive all taxes</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>£{totalAmount}</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePayNow}
            disabled={isCreatingOrder || isPaying}
            style={styles.payNowWrap}>
            <GradientOutline
              style={styles.payNowBorder}
              innerStyle={styles.payNowInner}>
              <Text style={styles.payNowText}>
                {isCreatingOrder || isPaying ? 'Please wait...' : 'Pay Now'}
              </Text>
            </GradientOutline>
          </TouchableOpacity>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
  },
  list: {
    rowGap: 16,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 20,
    marginTop: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.5)',
  },
  addressIcon: {
    width: 20,
    height: 20,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addressName: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
  },
  addressDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E9E9EC',
    marginHorizontal: 8,
  },
  addressPhone: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
  },
  addressLine: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    marginTop: 8,
    lineHeight: 20,
  },
  paymentsTitle: {
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  paymentsSubtitle: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    marginBottom: 18,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  radio: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  methodText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  orPayWith: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.8)',
    marginTop: 18,
    marginBottom: 12,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  walletSelected: {
    opacity: 1,
  },
  gradientOutline: {
    borderRadius: 10,
    padding: 1.5,
    overflow: 'hidden',
  },
  gradientInner: {
    backgroundColor: Colors.white,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  paypalButton: {
    width: 102,
    height: 42,
  },
  paypalInner: {
    flex: 1,
    width: '100%',
  },
  gpayButton: {
    width: 90,
    height: 42,
  },
  gpayInner: {
    flex: 1,
    width: '100%',
  },
  payPalText: {
    includeFontPadding: false,
  },
  payPalPay: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: '#003087',
  },
  payPalPal: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: '#009CDE',
  },
  googlePayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  googleG: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Bold'],
    includeFontPadding: false,
  },
  googlePayText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: '#5F6368',
    includeFontPadding: false,
  },
  codRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    paddingHorizontal: 4,
  },
  codText: {
    flex: 1,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    marginLeft: 12,
  },
  totalBlock: {
    marginTop: 28,
  },
  inclusiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginBottom: 6,
  },
  inclusiveDot: {
    width: 8.5,
    height: 8.5,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  inclusiveText: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.55)',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  totalValue: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  payNowWrap: {
    marginTop: 16,
  },
  payNowBorder: {
    width: '100%',
    height: 44,
  },
  payNowInner: {
    flex: 1,
    width: '100%',
  },
  payNowText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.black,
  },
});
