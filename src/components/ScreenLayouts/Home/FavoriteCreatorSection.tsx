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
import {FavoriteIcon} from '@assets/svg/HomeScreenIcon';
import {BackArrow} from '@assets/svg/AuthFlowIcons';
import FastImage from 'react-native-fast-image';
import {useGetFavoriteCreatorsQuery} from '@rtkServices/HomeService';
import {navigate} from '@navigation/utils';

export const CreatorCard = ({creator}: {creator: FavoriteCreator}) => {
  return (
    <Pressable
      onPress={() => {
        navigate('OtherUserProfile', {userId: creator.creator._id});
      }}
      style={styles.creatorCard}>
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
    limit: 10,
  });

  const EmptyList = ({isLoading}: {isLoading: boolean}) => {
    return (
      <View style={styles.emptyListContainer}>
        <View style={styles.iconContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <FavoriteIcon />
          )}
        </View>
        <Text style={styles.emptyListText}>
          {isLoading
            ? 'Loading favorite creators...'
            : 'You can add your favorite creators here'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.favoriteIconContainer}>
          <FavoriteIcon />
          <Text style={styles.title}>My favorite creators</Text>
        </View>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            navigate('FavoriteCreatorList', {});
          }}
          style={styles.viewAllContainer}>
          <Text style={styles.seeAll}>View All</Text>
          <BackArrow
            fill={Colors.white}
            width={10}
            height={10}
            opacity={0.5}
            style={{transform: [{rotate: '180deg'}]}}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <EmptyList isLoading={true} />
      ) : data && data?.data?.creators?.length > 0 ? (
        <FlatList
          data={data?.data?.creators}
          renderItem={({item}) => <CreatorCard creator={item} />}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.creatorListContainer}
        />
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
    paddingHorizontal: 10,
  },
  creatorCard: {
    width: hp('10'),
    height: hp('13'),
    padding: 10,
    // backgroundColor: "red",
    borderRadius: 10,
    alignItems: 'center',
  },
  creatorImage: {
    width: hp('8'),
    height: hp('8'),
    borderRadius: hp('10'),
    alignSelf: 'center',
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
