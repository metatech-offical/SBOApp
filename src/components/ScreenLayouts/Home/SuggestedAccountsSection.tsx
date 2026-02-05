import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';
import {fontSize, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {StarIcon} from '@assets/svg/HomeScreenIcon';
import {navigate} from '@navigation/utils';
import NodataFound from '@components/DataEmpty/NodataFound';
import {RightArrowIcon} from '@assets/svg/CommonIcons';

interface SuggestedAccount {
  _id: string;
  username: string;
  verified: boolean;
  engagementScore: number;
}

const SuggestedAccountCard = ({
  item,
  index,
  totalRecord,
}: {
  item: SuggestedAccount;
  index: number;
  totalRecord: number;
}) => {
  const isViewAll = index === 3; // Fourth item is "View All"

  if (isViewAll) {
    const remainingCount = totalRecord - 3;
    return (
      <Pressable
        onPress={() => navigate('SuggestedAccounts', {})}
        style={styles.accountCard}>
        <View style={styles.viewAllCircle}>
          <Text style={styles.viewAllText}>{remainingCount}+</Text>
        </View>
        <Text style={styles.accountName}>View all</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => navigate('OtherUserProfile', {userId: item?._id})}
      style={styles.accountCard}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitial}>{item?.username?.charAt(0)}</Text>
      </View>
      <Text numberOfLines={1} style={styles.accountName}>
        {item?.username}
      </Text>
    </Pressable>
  );
};

export default function SuggestedAccountsSection({data, totalRecord}: any) {
  const suggestedAccounts = data || [];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <StarIcon width={20} height={20} />
          <Text style={styles.title}>Suggested accounts for you</Text>
        </View>
        <Pressable onPress={() => navigate('SuggestedAccounts', {})}>
          <RightArrowIcon width={20} height={20} fill={Colors.white} />
        </Pressable>
      </View>
      <FlatList
        data={suggestedAccounts?.slice(0, 4)}
        renderItem={({item, index}) => (
          <SuggestedAccountCard
            item={item}
            index={index}
            totalRecord={totalRecord}
          />
        )}
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
  accountCard: {
    alignItems: 'center',
    width: '25%',
  },
  avatarCircle: {
    width: wp('12'),
    height: wp('12'),
    borderRadius: wp('10'),
    backgroundColor: '#FFD700', // Yellow background like in the reference
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  avatarInitial: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.black,
    textTransform: 'uppercase',
  },
  accountName: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    textAlign: 'center',
    width: '90%',
  },
  viewAllCircle: {
    width: wp('12'),
    height: wp('12'),
    borderRadius: wp('10'),
    backgroundColor: 'rgba(128, 90, 213, 0.8)', // Dark purple like in reference
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.greenColor,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: fonts['Poppins-Bold'],
  },
});
