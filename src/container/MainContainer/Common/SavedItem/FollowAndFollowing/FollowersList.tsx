import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {useGetFollowersByIdQuery} from '@rtkServices/ProfileService';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FollowAndFollowingProps} from '@navigation/screens';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useFollowUnfollowUserMutation} from '@rtkServices/ContentActionService';
import {navigate} from '@navigation/utils';
import {RootState, useAppSelector} from '@store/index';
import {useToastMessage} from '@hooks/useToastMessage';
import {fontSize} from '@constant/fontSize';

interface FollowerUser {
  _id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  verified: boolean;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  membership: string;
  isLive: boolean;
}

const FollowersList = () => {
  const {showError, showSuccess} = useToastMessage();
  const route = useRoute<FollowAndFollowingProps['route']>();
  const {userId} = route?.params || {};
  const {user} = useAppSelector((state: RootState) => state.user);
  const [followUnfollowUser] = useFollowUnfollowUserMutation();

  const {
    data: followersData,
    isLoading,
    error,
  } = useGetFollowersByIdQuery({
    userId: userId,
    page: 1,
    limit: 20,
  });

  const navigation = useNavigation<any>();
  const followers = followersData?.data?.followers || [];

  const handleFollowUnfollow = async (targetUserId: string) => {
    try {
      await followUnfollowUser({targetUserId}).then((res: any) => {
        if (res.data) {
          showSuccess(res?.data?.message || '');
        }
        if (res.error) {
          showError(res?.error?.data?.message || 'Something went wrong');
        }
      });
    } catch (error) {
      console.log('Follow/Unfollow error:', error);
    }
  };

  const onPress = (profile: usersItem) => {
    if (user?._id === profile?._id) {
      if (user?.membership === 'creator') {
        navigation.navigate('HomeScreen', {
          screen: 'CreatorProfile',
          params: {userId: profile._id},
        });
      } else {
        navigation.navigate('HomeScreen', {
          screen: 'UserProfile',
          params: {userId: profile._id},
        });
      }
    } else {
      navigate('OtherUserProfile', {userId: profile._id});
    }
  };

  const renderUser = ({item}: {item: FollowerUser}) => (
    <Pressable style={styles.userCard} onPress={() => onPress(item)}>
      <View style={styles.userInfo}>
        <FastImage
          source={
            item.profilePicture
              ? {uri: item.profilePicture}
              : require('@assets/images/DummyUserImage.png')
          }
          style={styles.userImage}
        />
        <View style={styles.userTextContainer}>
          <Text style={styles.userName}>
            {item.displayName || item.username}
          </Text>
          <Text style={styles.userHandle}>@{item.username}</Text>
        </View>
      </View>
      {!(item.membership === 'standard' || item._id === user?._id) && (
        <CustomButton
          text={item.isFollowing ? 'Following' : 'Follow'}
          onPress={() => handleFollowUnfollow(item._id)}
          btnStyle={[
            styles.followButton,
            item.isFollowing ? styles.followingButton : null,
          ]}
          textStyle={[
            styles.followButtonText,
            item.isFollowing ? styles.followingButtonText : null,
          ]}
        />
      )}
    </Pressable>
  );

  if (isLoading) {
    return <Loader visible={isLoading} />;
  }

  if (error) {
    return <NodataFound />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        renderItem={renderUser}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NodataFound />}
        contentContainerStyle={{paddingHorizontal: 20}}
      />
    </View>
  );
};

export default FollowersList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userTextContainer: {
    marginLeft: 15,
  },
  userName: {
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f14,
    color: Colors.white,
  },
  userHandle: {
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  followButton: {
    width: 'auto',
    height: 36,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#FFFFFF14',
    marginBottom: 0,
    marginTop: 0,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  followButtonText: {
    fontFamily: fonts['Poppins-Medium'],
    fontSize: fontSize.f12,
    color: Colors.white,
  },
  followingButtonText: {
    color: Colors.white,
  },
});
