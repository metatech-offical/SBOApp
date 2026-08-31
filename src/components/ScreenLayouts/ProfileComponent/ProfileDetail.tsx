import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize, hp, wp} from '@constant/fontSize';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {BasketIcon, EditProfileIcon} from '@assets/svg/ProfileScreenIcon';
import {TicketIcon} from '@assets/svg/HomeScreenIcon';
import {ShareIcon} from '@assets/svg/CommonIcons';
import {useFollowUnfollowUserMutation} from '@rtkServices/ContentActionService';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import {navigate} from '@navigation/utils';
import {useUnsubscribeFromCreatorMutation} from '@rtkServices/SubcriptionService';
import {Stream} from '@rtkServices/LiveStreamServices/LiveServices';
import {useToastMessage} from '@hooks/useToastMessage';
import {formatCount, shareProfile} from '@utils/helper';

const ProfileIconButton = ({
  label,
  icon,
  onPress,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.iconActionButton, disabled && styles.disabledButton]}>
      {icon}
      <Text style={styles.iconActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const ProfileDetail = React.memo(
  ({
    profileType,
    profileData,
    isBlocked,
    liveData,
  }: {
    profileType: 'user' | 'creator' | 'other';
    profileData: UserProfile;
    isBlocked?: boolean;
    liveData?: Stream[];
  }) => {
    const {showError, showSuccess} = useToastMessage();
    const [followAndUnfollow] = useFollowUnfollowUserMutation();
    const [following, setFollowing] = useState(profileData?.isFollowing);
    const [unsubscribe] = useUnsubscribeFromCreatorMutation();
    const {data: postsData} = useGetUserContentByIdQuery(
      {
        id: profileData?._id,
        types: 'posts',
        page: 1,
        limit: 1,
        search: '',
      },
      {skip: !profileData?._id},
    );

    const postsCount =
      profileData?.postsCount ??
      postsData?.data?.pagination?.totalRecords ??
      0;

    const handleFollowToggle = useCallback(async () => {
      try {
        const payload = {targetUserId: profileData?._id};
        await followAndUnfollow(payload).then((res: any) => {
          if (res?.data) {
            setFollowing(prev => !prev);
          }
          if (res?.error) {
            showError(
              res?.error?.data?.message
                ? res?.error?.data?.message
                : res?.error?.data || '',
            );
          }
        });
      } catch (error) {
        // Optionally handle error
      }
    }, [followAndUnfollow, profileData._id, showError]);

    const handleUnsubscribe = () => {
      unsubscribe({creatorId: profileData?._id})
        .unwrap()
        .then(() => {
          showSuccess('Unsubscribed successfully');
        })
        .catch(error => {
          showError(error?.data?.message || 'Something went wrong');
        });
    };

    const handleSubmit = () => {
      if (profileData?.isSubscribed) {
        handleUnsubscribe();
      } else {
        navigate('SubscriptionScreen', {
          profileData: profileData,
        });
      }
    };

    const handleClickLive = () => {
      if (liveData && liveData?.length > 0) {
        navigate('LiveViewer', {liveID: liveData[0]?._id});
      }
    };

    const openFollowList = (type: 'followers' | 'following') => {
      navigate('FollowAndFollowing', {
        userId: profileData?._id,
        type,
      });
    };

    const openStore = () => {
      if (profileType === 'other') {
        navigate('OtherUserStoreScreen', {
          storeId: profileData?.storeId,
          name: profileData?.displayName || profileData?.username,
          profilePicture: profileData?.profilePicture || null,
        });
      } else {
        navigate('CreatorStore', {});
      }
    };

    const openTickets = () => {
      navigate('CreatorTicketingScreen', {
        creatorId: profileData?._id,
      });
    };

    return (
      <View style={styles.container}>
        <Pressable
          onPress={() => handleClickLive()}
          style={styles.userImageContainer}>
          <FastImage
            source={
              profileData?.profilePicture
                ? {uri: profileData?.profilePicture}
                : require('@assets/images/DummyUserImage.png')
            }
            style={[
              styles.userImageStyle,
              profileData?.isLive ? styles.userImageLive : null,
            ]}
          />
          {profileData?.isLive && (
            <View style={styles.liveIconContainer}>
              <Text style={styles.liveIconText}>Live</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.userNameRow}>
          <Text numberOfLines={1} style={styles.userNameStyle}>
            {profileData?.displayName || profileData?.username || 'No Name'}
          </Text>
        </View>
        {!!profileData?.username && (
          <Text style={styles.handleStyle}>@{profileData.username}</Text>
        )}

        {profileData?.bio && (
          <Text style={styles.desStyle}>{profileData?.bio || 'No bio'}</Text>
        )}

        <View style={styles.followingContainer}>
          <View style={styles.followCountItem}>
            <Text style={styles.followingCount}>{formatCount(postsCount)}</Text>
            <Text style={styles.followingText}>Posts</Text>
          </View>
          <Pressable
            onPress={() => openFollowList('followers')}
            style={styles.followCountItem}>
            <Text style={styles.followingCount}>
              {formatCount(profileData?.followersCount)}
            </Text>
            <Text style={styles.followingText}>Followers</Text>
          </Pressable>
          <Pressable
            onPress={() => openFollowList('following')}
            style={styles.followCountItem}>
            <Text style={styles.followingCount}>
              {formatCount(profileData?.followingCount)}
            </Text>
            <Text style={styles.followingText}>Following</Text>
          </Pressable>
        </View>

        {profileType === 'other' && !isBlocked && (
          <View style={styles.followButtonContainer}>
            <TouchableOpacity onPress={handleFollowToggle}>
              <FastImage
                source={require('@assets/images/Button.png')}
                style={[
                  styles.followButtonImage,
                  {width: following ? 130 : 100},
                ]}
                resizeMode={FastImage.resizeMode.stretch}>
                <Text style={styles.followButtonText}>
                  {following ? 'Following' : 'Follow'}
                </Text>
              </FastImage>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit}>
              <FastImage
                source={require('@assets/images/Button2.png')}
                style={styles.subscribedButtonImage}
                resizeMode={FastImage.resizeMode.stretch}>
                <Text style={styles.followButtonText}>
                  {profileData?.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </Text>
              </FastImage>
            </TouchableOpacity>
          </View>
        )}

        {(profileType === 'other' || profileType === 'creator') &&
          !isBlocked && (
            <View style={styles.actionButtonsContainer}>
              <ProfileIconButton
                label="Store"
                disabled={!profileData?.storeId && profileType === 'other'}
                onPress={openStore}
                icon={<BasketIcon width={20} height={20} stroke={Colors.white} />}
              />
              <ProfileIconButton
                label="Tickets"
                onPress={openTickets}
                icon={
                  <TicketIcon width={20} height={20} stroke={Colors.white} />
                }
              />
              {profileType === 'creator' && (
                <ProfileIconButton
                  label="Edit"
                  onPress={() => navigate('EditProfileScreen', {})}
                  icon={<EditProfileIcon width={20} height={20} />}
                />
              )}
              <ProfileIconButton
                label="Share"
                onPress={() => shareProfile(profileData)}
                icon={<ShareIcon width={20} height={20} />}
              />
            </View>
          )}
      </View>
    );
  },
);

export default ProfileDetail;
const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  userImageStyle: {
    width: wp('22%'),
    height: wp('22%'),
    alignSelf: 'center',
    borderRadius: 100,
  },
  userImageLive: {
    borderWidth: 3,
    borderColor: Colors.green,
  },
  userImageContainer: {
    width: wp('22%'),
    height: wp('22%'),
    alignSelf: 'center',
  },
  liveIconContainer: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: '#8800FF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  liveIconText: {
    fontSize: fontSize.f8,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameStyle: {
    fontSize: fontSize.f20,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: wp('4%'),
    maxWidth: '100%',
  },
  handleStyle: {
    fontSize: fontSize.f12,
    color: Colors.grey,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    marginTop: 2,
  },
  desStyle: {
    fontSize: fontSize.f12,
    color: Colors.grey,
    marginTop: 10,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
    paddingHorizontal: wp('8%'),
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: wp('4%'),
    marginTop: hp('1.2%'),
    marginBottom: hp('0.5%'),
  },
  disabledButton: {
    opacity: 0.4,
  },
  followingContainer: {
    paddingHorizontal: wp('8%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: hp('1.2%'),
  },
  followCountItem: {
    alignItems: 'center',
    minWidth: wp('20%'),
  },
  followingCount: {
    fontSize: fontSize.f18,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  followingText: {
    fontSize: fontSize.f12,
    color: Colors.grey,
    fontFamily: fonts['Poppins-Medium'],
  },
  iconActionButton: {
    backgroundColor: '#0000001F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('18%'),
    height: wp('16%'),
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    gap: 4,
  },
  iconActionLabel: {
    fontSize: fontSize.f10,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  followButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: wp('4%'),
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonImage: {
    width: 100,
    height: 35,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  subscribedButtonImage: {
    width: 130,
    height: 35,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    alignSelf: 'center',
  },
});
