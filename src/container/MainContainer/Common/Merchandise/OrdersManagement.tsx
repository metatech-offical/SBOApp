import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {OrdersManagementProps} from '@navigation/screens';
import StackHeader from '@components/CustomHeaders/StackHeader';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import NodataFound from '@components/DataEmpty/NodataFound';
import OrderManageItem from '@components/ScreenLayouts/Home/OrderManageItem';
import {useGetOrdersManagementQuery} from '@rtkServices/HomeService';
import Loader from '@components/CustomLoader/Loader';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {hp, wp} from '@constant/fontSize';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {OrderTabs} from '@utils/data';
import {getStatusForTab} from '@utils/general';

const OrdersManagement = ({navigation}: OrdersManagementProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const {data, isLoading, isFetching, refetch} = useGetOrdersManagementQuery({
    page: 1,
    limit: 10,
    status: getStatusForTab(activeTab),
  });

  const orders = data?.data?.orders || [];

  const handleLoadMore = () => {};

  const handleRefresh = () => {
    refetch();
  };

  const renderTab = (tab: {id: string; title: string}) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tab, activeTab === tab.id && styles.activeTab]}
      onPress={() => setActiveTab(tab.id)}>
      <Text
        style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StackHeader
        title="Manage Orders"
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
        <View style={styles.contentOverlay}>
          {/* Enhanced Tab Section */}
          <View style={styles.tabSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScrollContainer}>
              <View style={styles.tabsContainer}>
                {OrderTabs?.map(renderTab)}
              </View>
            </ScrollView>
          </View>

          {/* Orders Count */}
          <View style={styles.ordersCountContainer}>
            <Text style={styles.ordersCountText}>
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </Text>
          </View>

          {/* Orders List */}
          <FlatList
            data={orders}
            renderItem={({item}) => (
              <OrderManageItem
                item={item}
                navigation={navigation}
                style={styles.orderItem}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <NodataFound />
              </View>
            }
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.8}
            refreshControl={
              <CustomRefreshControler
                refreshing={isFetching}
                onRefresh={handleRefresh}
              />
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
};

export default OrdersManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1538',
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  tabSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    paddingVertical: hp('1%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabsScrollContainer: {
    paddingHorizontal: wp('2%'),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp('1%'),
  },
  tab: {
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 25,
    minWidth: wp('20%'),
    alignItems: 'center',
    marginHorizontal: wp('1%'),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    opacity: 0.7,
  },
  activeTabText: {
    color: Colors.white,
    opacity: 1,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  ordersCountContainer: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
  },
  ordersCountText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    opacity: 0.8,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: hp('2%'),
  },
  orderItem: {
    marginVertical: hp('0.5%'),
  },
  separator: {
    height: hp('0.5%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('10%'),
  },
});
