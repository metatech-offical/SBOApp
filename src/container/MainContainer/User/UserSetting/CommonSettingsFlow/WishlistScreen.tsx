import GlowBackground from '@components/AnimationComponent/GlowBackground';
import SettingHeader from '@components/CustomHeaders/SettingHeader';
import NodataFound from '@components/DataEmpty/NodataFound';
import {WishlistScreenProps} from '@navigation/screens';
import {View, StyleSheet, FlatList} from 'react-native';
import WishlistAndOrderCard from '@components/ScreenLayouts/SettingsComponent/WishlistAndOrderCard';
import {useGetWishlistQuery} from '@rtkServices/CreatorStoreService';
import Loader from '@components/CustomLoader/Loader';
import {DUMMY_WISHLIST_PRODUCTS} from '@utils/dummyHome';

const WishlistScreen = ({navigation}: WishlistScreenProps) => {
  const {data: wishlist, isLoading} = useGetWishlistQuery(null, {
    skip: false,
  });
  const apiWishlist = wishlist?.data?.products || [];
  const wishlistData =
    apiWishlist.length > 0 ? apiWishlist : DUMMY_WISHLIST_PRODUCTS;
  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={styles.contentOverlay}>
        <SettingHeader
          title="Wishlist"
          onBackPress={() => navigation.goBack()}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <FlatList
            data={wishlistData}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            ListEmptyComponent={<NodataFound />}
            renderItem={({item}) => (
              <WishlistAndOrderCard
                item={item}
                isInWishlist={true}
                onPress={() =>
                  navigation.navigate('ProductDetail', {_id: item?._id})
                }
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default WishlistScreen;

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
});
