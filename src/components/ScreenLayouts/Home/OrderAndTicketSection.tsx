import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize, wp, hp} from '@constant/fontSize';
import FastImage from 'react-native-fast-image';
import {UserCreatorHomeTabData} from '@utils/data';
import {useGetOrderHistoryQuery} from '@rtkServices/HomeService';
import NodataFound from '@components/DataEmpty/NodataFound';
import DataEmpty from '@components/DataEmpty/DataEmpty';

export default function OrderAndTicketSection({navigation}: any) {
  const [activeTab, setActiveTab] = useState('orders');
  const {data} = useGetOrderHistoryQuery({page: 1, limit: 10});
  const OrderData = data?.data?.orders || [];

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetailScreen', {
      orderId: orderId,
      screenType: 'OrderHistory',
    });
  };

  const ProductCard = ({item}: any) => {
    return (
      <Pressable
        onPress={() => {
          handleOrderPress(item?._id);
        }}
        style={styles.productCard}>
        <FastImage
          source={{
            uri: item?.items[0]?.media?.[0],
          }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {item?.items[0]?.productName || ''}
          </Text>
          <Text style={styles.price}>{item?.items[0]?.itemPrice || ''}</Text>
        </View>
      </Pressable>
    );
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <NodataFound style={styles.emptyComponent} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {UserCreatorHomeTabData?.map(item => (
          <TouchableOpacity
            key={item?.value}
            style={[styles.tab, activeTab === item?.value && styles.activeTab]}
            onPress={() => setActiveTab(item?.value)}>
            <Text
              style={[
                styles.tabText,
                activeTab === item?.value && styles.activeTabText,
              ]}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'orders' ? (
          <FlatList
            data={OrderData}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productCardContainer}
            renderItem={({item}) => <ProductCard item={item} />}
            ListEmptyComponent={<EmptyComponent />}
          />
        ) : (
          <FlatList
            data={[]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productCardContainer}
            renderItem={({item}) => <ProductCard item={item} />}
            ListEmptyComponent={<EmptyComponent />}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('2%'),
    borderRadius: 10,
    overflow: 'hidden',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingHorizontal: wp('2%'),
  },
  tab: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.white,
  },
  tabText: {
    fontSize: fontSize.f16,
    color: '#666',
    fontFamily: fonts['Poppins-Medium'],
  },
  activeTabText: {
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  contentContainer: {
    paddingVertical: hp('2%'),
  },
  productCardContainer: {
    paddingHorizontal: wp('2%'),
  },
  productCard: {
    borderRadius: 10,
    marginHorizontal: wp('2%'),
    backgroundColor: '#FFFFFF0F',
    padding: wp('2%'),
  },
  productImage: {
    width: wp('47'),
    height: wp('47'),
    borderRadius: 10,
    marginBottom: hp('1%'),
  },
  productInfo: {},
  productName: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  price: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: wp('100%'),
    minHeight: hp('20%'),
  },
  emptyComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
