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
import {fontSize, hp, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {HeartIcon, WishListIcon} from '@assets/svg/HomeScreenIcon';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import FastImage from 'react-native-fast-image';
import {navigate} from '@navigation/utils';
import {useGetWishlistQuery} from '@rtkServices/CreatorStoreService';

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

  const EmptyList = ({isLoading}: {isLoading: boolean}) => {
    return (
      <View style={styles.emptyListContainer}>
        <View style={styles.iconContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <HeartIcon />
          )}
        </View>
        <Text style={styles.emptyListText}>
          {isLoading
            ? 'Wishlist is loading...'
            : 'You can add your favorite products here'}
        </Text>

        {/* <BackArrow
          fill={Colors.white}
          width={20}
          height={20}
          opacity={0.5}
          style={{transform: [{rotate: '180deg'}]}}
        /> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.favoriteIconContainer}>
          <WishListIcon />
          <Text style={styles.title}>My wishlist</Text>
        </View>
        <TouchableOpacity
          hitSlop={20}
          style={styles.viewAllContainer}
          onPress={() => navigate('WishlistScreen', {})}>
          <BackArrow
            fill={Colors.white}
            width={20}
            height={20}
            opacity={0.5}
            style={{transform: [{rotate: '180deg'}]}}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <EmptyList isLoading={true} />
      ) : wishlistData && wishlistData?.data?.products?.length > 0 ? (
        <View>
          <FlatList
            data={wishlistData?.data?.products}
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
        <EmptyList isLoading={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  favoriteIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  seeAll: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    opacity: 0.5,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  creatorListContainer: {
    gap: 5,
    paddingHorizontal: 20,
  },
  creatorCard: {
    width: wp('25'),
    height: wp('20'),
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  creatorImage: {
    width: wp('25'),
    height: wp('20'),
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  creatorName: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    marginTop: 5,
    // opacity: 0.5,
    textAlign: 'center',
  },

  emptyListContainer: {
    height: hp('10'),
    width: wp('95'),
    backgroundColor: '#FFFFFF0F',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    gap: 10,
    // justifyContent: "center",
  },
  iconContainer: {
    width: hp('6'),
    height: hp('6'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF0F',
    borderRadius: 10,
    // borderRadius: hp("5"),
  },
  emptyListText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    width: wp('65'),
  },
});
