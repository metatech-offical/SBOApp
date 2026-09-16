import GlowBackground from '@components/AnimationComponent/GlowBackground';
import NodataFound from '@components/DataEmpty/NodataFound';
import {OrderHistoryProps} from '@navigation/screens';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useGetOrderHistoryQuery} from '@rtkServices/HomeService';
import OrderHistorySection from '@components/ScreenLayouts/UserMerchandise/OrderHistorySection';
import Loader from '@components/CustomLoader/Loader';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import {Colors} from '@constant/colors';
import {DUMMY_HOME_ORDERS} from '@utils/dummyHome';

const OrderHistory = ({navigation}: OrderHistoryProps) => {
  const {data, isLoading} = useGetOrderHistoryQuery({page: 1, limit: 10});
  const orders = data?.data?.orders?.length
    ? data.data.orders
    : DUMMY_HOME_ORDERS;

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetailScreen', {
      orderId: orderId,
      screenType: 'OrderHistory',
    });
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Order History"
          onBackPress={() => navigation.goBack()}
        />

        {isLoading ? (
          <Loader visible={isLoading} />
        ) : orders.length > 0 ? (
          <OrderHistorySection
            orders={orders}
            onOrderPress={handleOrderPress}
          />
        ) : (
          <NodataFound />
        )}
      </View>
    </View>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
    paddingHorizontal: 16,
  },
  headerGradient: {
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
    marginLeft: 20,
  },
  headerSpacer: {
    width: 40,
  },
});
