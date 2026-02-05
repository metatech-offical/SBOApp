import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';
import {fontSize, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {StarIcon} from '@assets/svg/HomeScreenIcon';
import {navigate} from '@navigation/utils';
import {useGetMySubscribedCreatorsQuery} from '@rtkServices/SubcriptionService';
import FastImage from 'react-native-fast-image';
import NodataFound from '@components/DataEmpty/NodataFound';
import {RightArrowIcon} from '@assets/svg/CommonIcons';

const SubscriptionCard = ({item}: {item: SubscribedCreator}) => {
  return (
    <Pressable
      onPress={() => navigate('OtherUserProfile', {userId: item?._id})}
      style={styles.subscriptionCard}>
      {item?.profilePicture ? (
        <FastImage
          source={{uri: item?.profilePicture}}
          style={styles.avatarCircle}
        />
      ) : (
        <View style={styles.viewAllCircle}>
          <Text style={styles.avatarInitial}>{item?.username?.charAt(0)}</Text>
        </View>
      )}
      <Text numberOfLines={1} style={styles.creatorName}>
        {item?.username}
      </Text>
    </Pressable>
  );
};

export default function SubscriptionsScection() {
  const {data} = useGetMySubscribedCreatorsQuery({
    search: '',
    page: 1,
    limit: 10,
    sort: 'desc',
  });

  const subscriptionsData = data?.data?.data || [];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <StarIcon width={20} height={20} />
          <Text style={styles.title}>My Subscriptions</Text>
        </View>
        <Pressable onPress={() => navigate('Subscriptions', {})}>
          <RightArrowIcon width={20} height={20} fill={Colors.white} />
        </Pressable>
      </View>
      <FlatList
        data={subscriptionsData?.slice(0, 3)}
        renderItem={({item}) => <SubscriptionCard item={item} />}
        keyExtractor={(item, index) => `${item?._id}-${index}`}
        horizontal={false}
        numColumns={4}
        ListEmptyComponent={<NodataFound style={{marginTop: -150}} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF0F',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
  },
  title: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  listContainer: {
    paddingVertical: 8,
  },
  subscriptionCard: {
    alignItems: 'center',
    width: '25%',
  },
  avatarCircle: {
    width: wp('15'),
    height: wp('15'),
    borderRadius: wp('10'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInitial: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
    textTransform: 'uppercase',
  },
  creatorName: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    textAlign: 'center',
    width: '90%',
  },
  viewAllCircle: {
    width: wp('15'),
    height: wp('15'),
    borderRadius: wp('10'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
});
