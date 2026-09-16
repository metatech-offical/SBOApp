import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {HeartIcon, HomeChevronIcon, WishListIcon} from '@assets/svg/HomeScreenIcon';
import FastImage from 'react-native-fast-image';
import {navigate} from '@navigation/utils';
import {useGetWishlistQuery} from '@rtkServices/CreatorStoreService';
import HomeEmptyRow from './HomeEmptyRow';
import {DUMMY_WISHLIST_PRODUCTS} from '@utils/dummyHome';

export const WishListCard = ({
  item,
  onPress,
}: {
  item: WishlistProduct;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.creatorCard}>
      <FastImage
        source={{
          uri: item?.media[0],
        }}
        style={styles.creatorImage}
      />
    </Pressable>
  );
};

export default function WishListSection() {
  const {data: wishlistData, isLoading} = useGetWishlistQuery(null, {
    skip: false,
  });
  const apiProducts = wishlistData?.data?.products || [];
  const products =
    apiProducts.length > 0 ? apiProducts : DUMMY_WISHLIST_PRODUCTS;

  const EmptyList = ({loading}: {loading: boolean}) => {
    if (loading) {
      return (
        <HomeEmptyRow
          icon={<ActivityIndicator size="small" color={Colors.white} />}
          text="Wishlist is loading..."
        />
      );
    }

    return (
      <HomeEmptyRow
        icon={<HeartIcon width={18} height={18} />}
        text="You can add your favorite products here"
        onPress={() => navigate('WishlistScreen', {})}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <WishListIcon width={18} height={18} />
          <Text style={styles.title}>My wishlist</Text>
        </View>
        <TouchableOpacity
          hitSlop={20}
          style={styles.viewAllContainer}
          onPress={() => navigate('WishlistScreen', {})}>
          <Text style={styles.seeAll}>View All</Text>
          <HomeChevronIcon />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <EmptyList loading={true} />
      ) : products.length > 0 ? (
        <View>
          <FlatList
            data={products}
            renderItem={({item}) => (
              <WishListCard
                item={item}
                onPress={() => navigate('ProductDetail', {_id: item?._id})}
              />
            )}
            keyExtractor={item => item?._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.creatorListContainer}
          />
        </View>
      ) : (
        <EmptyList loading={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  seeAll: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.45,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creatorListContainer: {
    gap: 16,
    paddingHorizontal: 8,
    marginTop: 12,
  },
  creatorCard: {
    width: 79,
    height: 68,
    borderRadius: 8,
    overflow: 'hidden',
  },
  creatorImage: {
    width: 79,
    height: 68,
    borderRadius: 8,
  },
});
