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
import {FavoriteIcon, HomeChevronIcon} from '@assets/svg/HomeScreenIcon';
import FastImage from 'react-native-fast-image';
import {useGetFavoriteCreatorsQuery} from '@rtkServices/HomeService';
import {navigate} from '@navigation/utils';
import HomeEmptyRow from './HomeEmptyRow';
import {DUMMY_FAVORITE_CREATORS} from '@utils/dummyHome';

const AVATAR_SIZE = 76;
const ITEM_WIDTH = 76;

const goToFavoriteList = () => navigate('FavoriteCreatorList', {});

export const CreatorCard = ({creator}: {creator: FavoriteCreator}) => {
  return (
    <Pressable
      onPress={() => {
        navigate('OtherUserProfile', {userId: creator.creator._id});
      }}
      style={styles.cell}>
      <FastImage
        source={
          creator.creator.profilePicture
            ? {uri: creator.creator.profilePicture}
            : require('@assets/images/DummyUserImage.png')
        }
        style={styles.creatorImage}
      />
      <Text numberOfLines={1} style={styles.creatorName}>
        {creator.creator.displayName || creator.creator.username}
      </Text>
    </Pressable>
  );
};

export default function FavoriteCreatorSection() {
  const {data, isLoading} = useGetFavoriteCreatorsQuery({
    page: 1,
    limit: 16,
  });

  const creators = data?.data?.creators?.length
    ? data.data.creators
    : DUMMY_FAVORITE_CREATORS;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <FavoriteIcon width={18} height={18} />
          <Text style={styles.title}>My favorite creators</Text>
        </View>
        <TouchableOpacity
          hitSlop={20}
          onPress={goToFavoriteList}
          style={styles.viewAllContainer}>
          <Text style={styles.seeAll}>View All</Text>
          <HomeChevronIcon />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <HomeEmptyRow
          icon={<ActivityIndicator size="small" color={Colors.white} />}
          text="Loading favorite creators..."
        />
      ) : creators.length > 0 ? (
        <FlatList
          data={creators}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({item}) => <CreatorCard creator={item} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <HomeEmptyRow
          icon={<FavoriteIcon width={18} height={18} />}
          text="Add your favorite creators"
          onPress={goToFavoriteList}
        />
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
  listContainer: {
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cell: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  creatorImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  creatorName: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    marginTop: 8,
    textAlign: 'center',
    width: '100%',
  },
});
