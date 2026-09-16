import {StyleSheet, View} from 'react-native';
import React from 'react';
import {StarIcon} from '@assets/svg/HomeScreenIcon';
import {navigate} from '@navigation/utils';
import HomeAvatarGrid from './HomeAvatarGrid';

interface SuggestedAccount {
  _id: string;
  username: string;
  displayName?: string;
  verified: boolean;
  profilePicture?: string;
}

export default function SuggestedAccountsSection({
  data,
  totalRecord = 0,
}: {
  data?: SuggestedAccount[];
  totalRecord?: number;
}) {
  const suggestedAccounts = data || [];

  if (!suggestedAccounts.length) {
    return null;
  }

  const extraCount = Math.max(totalRecord - 7, 0);

  return (
    <View style={styles.container}>
      <HomeAvatarGrid
        title="Suggested accounts for you"
        icon={<StarIcon width={18} height={18} />}
        items={suggestedAccounts.map(item => ({
          id: item._id,
          name: item.displayName || item.username,
          image: item.profilePicture,
          onPress: () => navigate('OtherUserProfile', {userId: item._id}),
        }))}
        extraCount={extraCount}
        onViewAll={() => navigate('SuggestedAccounts', {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
});
