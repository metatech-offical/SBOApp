import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import {OrderDetailScreenProps} from '@navigation/screens';
import StackHeader from '@components/CustomHeaders/StackHeader';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {
  useAcceptOrderMutation,
  useGetOrderDetailQuery,
  useRejectOrderMutation,
} from '@rtkServices/HomeService';
import Loader from '@components/CustomLoader/Loader';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {hp, wp} from '@constant/fontSize';
import FastImage from 'react-native-fast-image';
import {BottomArrowIcon} from '@assets/svg/CommonIcons';
import AddressDetail from '@components/ScreenLayouts/UserMerchandise/AddressDetail';
import CustomButton from '@components/CustomButtons/CustomButton';
import {getStatusInfo} from '@utils/general';
import {useToastMessage} from '@hooks/useToastMessage';
import {getDummyOrderById, isDummyHomeId} from '@utils/dummyHome';

const OrderDetailScreen = ({navigation, route}: OrderDetailScreenProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {orderId, screenType} = route.params || {};
  const isDummyOrder = isDummyHomeId(orderId);
  const {data, isLoading} = useGetOrderDetailQuery(
    {orderId},
    {skip: isDummyOrder || !orderId},
  );
  const dummyOrder = isDummyOrder ? getDummyOrderById(orderId) : undefined;
  const orderByIdData = dummyOrder || data?.data?.order;
  const [rejectOrder, {isLoading: isRejectLoading}] = useRejectOrderMutation();
  const [acceptOrder, {isLoading: isAcceptLoading}] = useAcceptOrderMutation();

  const renderProductCard = () => (
    <FlatList
      data={orderByIdData?.items || []}
      renderItem={({item}) => {
        return (
          <View style={styles.productCard}>
            <View style={styles.productImageContainer}>
              <FastImage
                source={{uri: item?.media[0]}}
                style={styles.productImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View style={styles.productInfo}>
              {item?.productName && (
                <Text style={styles.productName} numberOfLines={2}>
                  {item?.productName}
                </Text>
              )}
              {item?.variant?.price || item?.itemPrice && (
                <Text style={styles.productPrice}>
                  Price: {item?.variant?.price || item?.itemPrice}
                </Text>
              )}

              {item?.variant && (
                <View style={styles.sizeContainer}>
                  <Text style={styles.sizeLabel}>
                    Size: {item?.variant?.size}
                  </Text>
                  <BottomArrowIcon
                    width={12}
                    height={12}
                    stroke={Colors.white}
                    opacity={0.6}
                  />
                </View>
              )}
            </View>
          </View>
        );
      }}
    />
  );

  const renderDeliveryAddress = () => (
    <View>
      <AddressDetail
        selectedAddress={orderByIdData?.address}
        addressOnPress={() => {}}
        editAddressOnPress={() => {}}
        style={styles.addressDetail}
        isEditable={false}
      />
    </View>
  );

  const renderOrderDetails = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Order details</Text>
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <View style={styles.totalLeft}>
            <FastImage
              source={require('@assets/images/CartIcon.png')}
              style={styles.totalIcon}
            />
            <Text style={styles.totalLabel}>Total</Text>
          </View>
          <Text style={styles.totalAmount}>{orderByIdData?.totalAmount}</Text>
        </View>
      </View>
    </View>
  );

  const renderStatusSection = () => {
    const statusInfo = getStatusInfo(orderByIdData?.status || '');
    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, {color: statusInfo.color}]}>
            {statusInfo.text}
          </Text>
          <TouchableOpacity style={styles.trackButton} onPress={() => {}}>
            <Text style={styles.trackButtonText}>Track your order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleRejectOrder = async () => {
    const payload = {
      status: 'rejected',
      orderId,
    };
    await rejectOrder(payload).then(res => {
      if (res.data?.success) {
        showSuccess(res?.data?.message || '');
        navigation.goBack();
      } else {
        showError(res?.error?.data?.message || 'Order rejected failed');
      }
    });
  };

  const handleAcceptOrder = async () => {
    const payload = {
      status: 'accepted',
      orderId,
    };
    await acceptOrder(payload).then(res => {
      if (res.data?.success) {
        showSuccess(res?.data?.message || '');
        navigation.goBack();
      } else {
        showError(res?.error?.data?.message || 'Order accepted failed');
      }
    });
  };

  return (
    <View style={styles.container}>
      <StackHeader
        title="Order Detail"
        onBackPress={() => navigation.goBack()}
      />
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <View style={{flex: 1}}>
          <ScrollView
            style={styles.contentOverlay}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.orderIdText}>
              Order Id: {orderByIdData?._id}
            </Text>
            {renderProductCard()}
            {renderDeliveryAddress()}
            {renderOrderDetails()}
            {renderStatusSection()}
          </ScrollView>
          {orderByIdData?.status === 'pending' &&
            screenType == 'OrderManagement' && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  text="Reject Order"
                  onPress={handleRejectOrder}
                  btnStyle={{width: '48%'}}
                  isLoading={isRejectLoading}
                />
                <CustomButton
                  text="Accept Order"
                  onPress={handleAcceptOrder}
                  btnStyle={{width: '48%', backgroundColor: Colors.white}}
                  textStyle={{color: Colors.black}}
                  isLoading={isAcceptLoading}
                />
              </View>
            )}
        </View>
      )}
    </View>
  );
};

export default OrderDetailScreen;

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
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('5%'),
  },
  orderIdText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginTop: hp('2%'),
    marginBottom: hp('3%'),
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  productImageContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: wp('4%'),
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    lineHeight: 20,
    marginBottom: hp('1%'),
  },
  productPrice: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.8,
    marginBottom: hp('1%'),
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  sizeLabel: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.8,
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  totalContainer: {
    gap: hp('1%'),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalIcon: {
    width: 16,
    height: 16,
    marginRight: wp('2%'),
    tintColor: Colors.white,
    opacity: 0.7,
  },
  totalLabel: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  totalAmount: {
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.greenColor,
  },
  trackButton: {
    paddingVertical: hp('0.5%'),
  },
  trackButtonText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textDecorationLine: 'underline',
  },
  addressDetail: {
    marginHorizontal: 0,
    marginTop: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
  },
});
