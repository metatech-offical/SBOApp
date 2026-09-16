import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {HomeChevronIcon, StarIcon, UsersGroupIcon} from '@assets/svg/HomeScreenIcon';
import {navigate} from '@navigation/utils';
import {useGetMySubscribedCreatorsQuery} from '@rtkServices/SubcriptionService';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import HomeEmptyRow from './HomeEmptyRow';
import HomeAvatarGrid from './HomeAvatarGrid';
import {DUMMY_SUBSCRIBED_CREATORS} from '@utils/dummyHome';

export default function SubscriptionsScection() {
  const {data} = useGetMySubscribedCreatorsQuery({
    search: '',
    page: 1,
    limit: 10,
    sort: 'desc',
  });

  const apiSubscriptions = data?.data?.data || [];
  const subscriptionsData =
    apiSubscriptions.length > 0
      ? apiSubscriptions
      : DUMMY_SUBSCRIBED_CREATORS;
  const totalRecords =
    apiSubscriptions.length > 0
      ? data?.data?.total || subscriptionsData.length
      : DUMMY_SUBSCRIBED_CREATORS.length;
  const extraCount = Math.max(totalRecords - 7, 0);

  if (subscriptionsData.length > 0) {
    return (
      <View style={styles.container}>
        <HomeAvatarGrid
          title="My Subscriptions"
          icon={<StarIcon width={18} height={18} />}
          items={subscriptionsData.map(item => ({
            id: item._id,
            name: item.username,
            image: item.profilePicture,
            onPress: () => navigate('OtherUserProfile', {userId: item._id}),
          }))}
          extraCount={extraCount}
          onViewAll={() => navigate('Subscriptions', {})}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <StarIcon width={18} height={18} />
          <Text style={styles.title}>My Subscriptions</Text>
        </View>
        <Pressable
          hitSlop={20}
          onPress={() => navigate('Subscriptions', {})}
          style={styles.viewAllContainer}>
          <Text style={styles.seeAll}>View All</Text>
          <HomeChevronIcon />
        </Pressable>
      </View>
      <HomeEmptyRow
        icon={<UsersGroupIcon width={24} height={24} />}
        text="You don't have any subscriptions yet."
        onPress={() => navigate('Subscriptions', {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  headerContainer: {
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
});
