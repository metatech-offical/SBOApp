import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {HomeChevronIcon, PackageIcon} from '@assets/svg/HomeScreenIcon';
import {navigate} from '@navigation/utils';
import {useGetOrdersManagementQuery} from '@rtkServices/HomeService';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import HomeEmptyRow from './HomeEmptyRow';
import {DUMMY_MANAGE_ORDERS, isDummyHomeId} from '@utils/dummyHome';

type ManageOrder = GetOrdersManagementResponse & {
  media?: string;
  productName?: string;
};

const OrderRow = ({
  item,
  onPress,
}: {
  item: ManageOrder;
  onPress: () => void;
}) => {
  const image = item.media || item.user?.profilePicture;
  const date = item.orderedAt
    ? new Date(item.orderedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.username}>
          {item.productName || item.user?.username || 'Order'}
        </Text>
        <Text numberOfLines={1} style={styles.date}>
          {item.user?.username ? `@${item.user.username}` : date}
        </Text>
      </View>
      <View style={styles.thumbWrap}>
        <FastImage
          source={
            image
              ? {uri: image}
              : require('@assets/images/DummyUserImage.png')
          }
          style={styles.thumb}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', '#C685FF']}
          style={styles.thumbOverlay}
        />
      </View>
    </Pressable>
  );
};

export default function CreatorOrdersSection({navigation}: {navigation: any}) {
  const {data} = useGetOrdersManagementQuery({page: 1, limit: 10});
  const apiOrders = (data?.data?.orders || []) as ManageOrder[];
  const orders = apiOrders.length > 0 ? apiOrders : DUMMY_MANAGE_ORDERS;

  const openOrder = (orderId: string) => {
    if (isDummyHomeId(orderId)) {
      navigate('OrdersManagement', {});
      return;
    }
    navigation.navigate('OrderDetailScreen', {
      orderId,
      screenType: 'OrderManagement',
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigate('OrdersManagement', {})}
        style={styles.header}>
        <Text style={styles.title}>Manage orders</Text>
        <HomeChevronIcon strokeOpacity={0.7} />
      </Pressable>
      {orders.length > 0 ? (
        <View style={styles.list}>
          {orders.slice(0, 4).map(item => (
            <OrderRow
              key={item.orderId}
              item={item}
              onPress={() => openOrder(item.orderId)}
            />
          ))}
        </View>
      ) : (
        <HomeEmptyRow
          icon={<PackageIcon width={24} height={24} />}
          text="You don't have any orders yet."
          onPress={() => navigate('OrdersManagement', {})}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 20,
  },
  title: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  list: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 16,
  },
  row: {
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  username: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    opacity: 0.9,
  },
  date: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.6,
  },
  thumbWrap: {
    width: 79,
    height: 56,
  },
  thumb: {
    width: 79,
    height: 56,
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
});
