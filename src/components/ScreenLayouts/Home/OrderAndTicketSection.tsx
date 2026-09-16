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
import LinearGradient from 'react-native-linear-gradient';
import {UserCreatorHomeTabData} from '@utils/data';
import {useGetOrderHistoryQuery} from '@rtkServices/HomeService';
import {HomeChevronIcon, PackageIcon, TicketIcon} from '@assets/svg/HomeScreenIcon';
import {navigate} from '@navigation/utils';
import HomeEmptyRow from './HomeEmptyRow';
import {DUMMY_HOME_ORDERS, DUMMY_HOME_TICKETS} from '@utils/dummyHome';

const CARD_SIZE = 216;

type HomeTicket = {
  _id: string;
  eventName: string;
  title: string;
  date: string;
};

const ProductCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.productCard}>
      <FastImage
        source={{
          uri: item?.items[0]?.media?.[0],
        }}
        style={styles.productImage}
      />
      <Text numberOfLines={1} style={styles.productName}>
        {item?.items[0]?.productName || ''}
      </Text>
      <Text numberOfLines={1} style={styles.price}>
        {item?.items[0]?.itemPrice ? `$${item.items[0].itemPrice}` : ''}
      </Text>
    </Pressable>
  );
};

const TicketRow = ({
  item,
  onPress,
}: {
  item: HomeTicket;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.ticketRow}>
      <LinearGradient
        colors={['rgba(255,255,255,0.12)', 'rgba(198,133,255,0.18)']}
        style={styles.ticketIconBox}>
        <TicketIcon width={24} height={24} />
      </LinearGradient>
      <View style={styles.ticketCopy}>
        <Text numberOfLines={1} style={styles.ticketEventName}>
          {item.eventName}
        </Text>
        <Text numberOfLines={1} style={styles.ticketTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.ticketDate}>
          {item.date}
        </Text>
      </View>
      <HomeChevronIcon />
    </Pressable>
  );
};

export default function OrderAndTicketSection({
  navigation,
  variant = 'tabs',
}: {
  navigation: any;
  variant?: 'tabs' | 'section';
}) {
  const [activeTab, setActiveTab] = useState('orders');
  const {data} = useGetOrderHistoryQuery({page: 1, limit: 10});
  const apiOrders = data?.data?.orders || [];
  const OrderData = apiOrders.length > 0 ? apiOrders : DUMMY_HOME_ORDERS;
  const TicketData =
    DUMMY_HOME_TICKETS as HomeTicket[];

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetailScreen', {
      orderId: orderId,
      screenType: 'OrderHistory',
    });
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FastImage
        source={require('@assets/images/NoDataFound.png')}
        style={styles.emptyImage}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text style={styles.emptyText}>Nothing to show</Text>
    </View>
  );

  if (variant === 'section') {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleRow}>
            <PackageIcon width={18} height={18} />
            <Text style={styles.sectionTitle}>My orders</Text>
          </View>
          <TouchableOpacity
            hitSlop={20}
            style={styles.viewAllContainer}
            onPress={() => navigate('OrderHistory', {})}>
            <Text style={styles.seeAll}>View All</Text>
            <HomeChevronIcon />
          </TouchableOpacity>
        </View>
        {OrderData.length > 0 ? (
          <FlatList
            data={OrderData}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productCardContainer}
            renderItem={({item}) => (
              <ProductCard
                item={item}
                onPress={() => handleOrderPress(item?._id)}
              />
            )}
          />
        ) : (
          <HomeEmptyRow
            icon={<PackageIcon width={24} height={24} />}
            text="You don't have any orders yet."
            onPress={() => navigate('OrderHistory', {})}
          />
        )}
        <View style={[styles.sectionHeader, styles.ticketHeader]}>
          <View style={styles.titleRow}>
            <TicketIcon width={18} height={18} />
            <Text style={styles.sectionTitle}>My tickets</Text>
          </View>
          <TouchableOpacity
            hitSlop={20}
            style={styles.viewAllContainer}
            onPress={() => navigate('UserTicketing', {})}>
            <Text style={styles.seeAll}>View All</Text>
            <HomeChevronIcon />
          </TouchableOpacity>
        </View>
        {TicketData.length > 0 ? (
          <View style={styles.ticketList}>
            {TicketData.map(item => (
              <TicketRow
                key={item._id}
                item={item}
                onPress={() => navigate('UserTicketing', {})}
              />
            ))}
          </View>
        ) : (
          <HomeEmptyRow
            icon={<TicketIcon width={24} height={24} />}
            text="You don't have any tickets yet."
            onPress={() => navigate('UserTicketing', {})}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {UserCreatorHomeTabData?.map(item => (
          <TouchableOpacity
            key={item?.value}
            style={styles.tab}
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

      <View style={styles.contentContainer}>
        {activeTab === 'orders' ? (
          <FlatList
            data={OrderData}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              OrderData.length ? styles.productCardContainer : styles.emptyList
            }
            renderItem={({item}) => (
              <ProductCard
                item={item}
                onPress={() => handleOrderPress(item?._id)}
              />
            )}
            ListEmptyComponent={<EmptyComponent />}
          />
        ) : (
          TicketData.length > 0 ? (
            <View style={styles.ticketList}>
              {TicketData.map(item => (
                <TicketRow
                  key={item._id}
                  item={item}
                  onPress={() => navigate('UserTicketing', {})}
                />
              ))}
            </View>
          ) : (
            <EmptyComponent />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: hp('2%'),
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: hp('2%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  ticketHeader: {
    marginTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 12,
  },
  sectionTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seeAll: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.45,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 22,
  },
  tab: {
    paddingVertical: 4,
  },
  tabText: {
    fontSize: fontSize.f16,
    color: Colors.white,
    opacity: 0.4,
    fontFamily: fonts['Poppins-Medium'],
  },
  activeTabText: {
    opacity: 1,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  contentContainer: {
    paddingTop: 20,
  },
  productCardContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  ticketList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  ticketRow: {
    height: 95,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  ticketIconBox: {
    width: 48,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketCopy: {
    flex: 1,
    paddingRight: 8,
  },
  ticketEventName: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.6,
  },
  ticketTitle: {
    marginTop: 4,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  ticketDate: {
    marginTop: 2,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  productCard: {
    width: CARD_SIZE,
  },
  productImage: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
  },
  productName: {
    marginTop: 16,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  price: {
    marginTop: 4,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.7,
  },
  emptyContainer: {
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  emptyImage: {
    width: 120,
    height: 120,
  },
  emptyText: {
    marginTop: 8,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
});
