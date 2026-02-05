import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {fontSize, hp, wp} from '@constant/fontSize';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import {OrderIcon} from '@assets/svg/HomeScreenIcon';
import dayjs from 'dayjs';
import {getStatusInfo} from '@utils/general';

interface OrderManageItemProps {
  item: GetOrdersManagementResponse;
  navigation: any;
  style?: ViewStyle | ViewStyle[];
}

const OrderManageItem = ({item, navigation, style}: OrderManageItemProps) => {
  const statusInfo = getStatusInfo(item?.orderStatus);

  const handleOrderDetail = () => {
    navigation.navigate('OrderDetailScreen', {
      orderId: item?.orderId,
      screenType: 'OrderManagement',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleOrderDetail}>
      <View style={styles.iconContainer}>
        <OrderIcon />
      </View>
      <View style={styles.ticketInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.orderId}>
            Order Id: #{item?.orderId?.slice(-6)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusInfo.backgroundColor,
                borderColor: statusInfo.borderColor,
              },
            ]}>
            <Text style={[styles.statusText, {color: statusInfo.color}]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
        <Text numberOfLines={1} style={styles.ticketTitle}>
          {item?.user?.username}
        </Text>
        <Text style={styles.ticketDate}>
          {dayjs(item?.orderedAt).format('DD MMM YYYY')}
        </Text>
      </View>
      <TouchableOpacity
        hitSlop={20}
        style={styles.arrowContainer}
        onPress={handleOrderDetail}>
        <BackArrow
          width={16}
          height={16}
          color={Colors.white}
          opacity={0.6}
          style={{transform: [{rotate: '180deg'}]}}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default memo(OrderManageItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  iconContainer: {
    width: wp('13'),
    height: wp('13'),
    backgroundColor: 'rgba(198, 133, 255, 0.15)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3.5%'),
    borderWidth: 1,
    borderColor: 'rgba(198, 133, 255, 0.2)',
  },
  arrowContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  ticketInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  orderId: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    flex: 1,
    opacity: 0.9,
  },
  statusBadge: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 15,
    borderWidth: 1,
    minWidth: wp('22%'),
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    textTransform: 'capitalize',
  },
  ticketDate: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    marginTop: hp('0.3%'),
  },
  ticketTitle: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    opacity: 0.95,
  },
});
