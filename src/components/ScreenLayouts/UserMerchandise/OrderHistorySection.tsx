import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import OrderHistoryItem from './OrderHistoryItem';
import dayjs from 'dayjs';
import {DateformatDate} from '@utils/general';

interface OrderHistorySectionProps {
  orders: Array<{
    _id: string;
    userId: string;
    storeId: string;
    creatorId: string;
    address: any;
    items: Array<{
      variant?: {
        size: string;
        color: string;
        price: number;
      };
      productId: string;
      productName: string;
      sku: string;
      media: string[];
      quantity: number;
      itemPrice: number;
      lineTotal: number;
    }>;
    totalAmount: number;
    status: string;
    payment: any;
    createdAt: string;
    updatedAt: string;
    __v: number;
    creator: any;
    id: string;
  }>;
  onOrderPress?: (orderId: string) => void;
}

const OrderHistorySection: React.FC<OrderHistorySectionProps> = ({
  orders,
  onOrderPress,
}) => {
  // Group orders by date
  const groupOrdersByDate = () => {
    const grouped: {[key: string]: typeof orders} = {};

    orders?.forEach(order => {
      const dateKey = dayjs(order?.createdAt).format('YYYY-MM-DD');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(order);
    });

    return grouped;
  };

  const groupedOrders = groupOrdersByDate();
  const sortedDates = Object.keys(groupedOrders)?.sort((a, b) =>
    dayjs(b).diff(dayjs(a)),
  );

  const renderOrderItems = ({item}: {item: (typeof orders)[0]}) => {
    const items = item?.items || [];

    if (items?.length === 1) {
      // Show single item normally
      return (
        <OrderHistoryItem
          key={`${item?._id}-0`}
          item={items[0]}
          onPress={() => onOrderPress?.(item?._id)}
        />
      );
    } else if (items?.length > 1) {
      // Show first item with count indicator
      return (
        <View key={`${item?._id}-group`}>
          <OrderHistoryItem
            item={items[0]}
            onPress={() => onOrderPress?.(item?._id)}
            showCount={true}
            count={items?.length - 1}
          />
        </View>
      );
    }

    return null;
  };

  const renderDateSection = ({item: dateKey}: {item: string}) => {
    const ordersForDate = groupedOrders[dateKey];

    return (
      <View style={styles.dateSection}>
        <Text style={styles.dateHeader}>{DateformatDate(dateKey)}</Text>
        {ordersForDate?.map(order => (
          <View key={order._id}>{renderOrderItems({item: order})}</View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedDates}
        renderItem={renderDateSection}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    color: Colors.white,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    marginBottom: 20,
    marginTop: 12,
    opacity: 0.9,
  },
});

export default OrderHistorySection;
