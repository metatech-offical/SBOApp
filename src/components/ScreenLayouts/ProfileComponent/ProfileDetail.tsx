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
import {VerifiedIcon} from '@assets/svg/AuthFlowIcons';
import {useFollowUnfollowUserMutation} from '@rtkServices/ContentActionService';
import {useGetUserContentByIdQuery} from '@rtkServices/ProfileService';
import {navigate} from '@navigation/utils';
import {useUnsubscribeFromCreatorMutation} from '@rtkServices/SubcriptionService';
import {Stream} from '@rtkServices/LiveStreamServices/LiveServices';
import {useToastMessage} from '@hooks/useToastMessage';
import {formatCount, shareProfile} from '@utils/helper';
import GlowActionButton from '@components/CustomButtons/GlowActionButton';

const USER_AVATAR_SIZE = 176;

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
    isOwnProfile,
  }: {
    profileType: 'user' | 'creator' | 'other';
    profileData: UserProfile;
    isBlocked?: boolean;
    liveData?: Stream[];
    isOwnProfile?: boolean;
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

    const isUserLayout = profileType === 'user';
    const displayName =
      profileData?.displayName || profileData?.username || 'No Name';
    const subtitle = profileData?.bio
      ? profileData.bio
      : profileData?.username
        ? `@${profileData.username}`
        : '';

    if (isUserLayout) {
      return (
        <View style={styles.userContainer}>
          <View style={styles.userHeroBlock}>
            <Pressable
              onPress={() => handleClickLive()}
              style={styles.userAvatarWrap}>
              <View style={styles.userAvatarRing}>
                <FastImage
                  source={
                    profileData?.profilePicture
                      ? {uri: profileData?.profilePicture}
                      : require('@assets/images/DummyUserImage.png')
                  }
                  style={styles.userAvatar}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
              {profileData?.isLive && (
                <View style={styles.liveIconContainer}>
                  <Text style={styles.liveIconText}>Live</Text>
                </View>
              )}
            </Pressable>

            <View style={styles.userIdentity}>
              <View style={styles.userNameRow}>
                <Text numberOfLines={1} style={styles.userDisplayName}>
                  {displayName}
                </Text>
                {profileData?.verified ? (
                  <VerifiedIcon width={20} height={20} />
                ) : null}
              </View>
              {!!subtitle && (
                <Text numberOfLines={2} style={styles.userSubtitle}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.userStatsRow}>
            <View style={styles.userStatItem}>
              <Text style={styles.userStatValue}>{formatCount(postsCount)}</Text>
              <Text style={styles.userStatLabel}>Posts</Text>
            </View>
            <Pressable
              onPress={() => openFollowList('followers')}
              style={styles.userStatItem}>
              <Text style={styles.userStatValue}>
                {formatCount(profileData?.followersCount)}
              </Text>
              <Text style={styles.userStatLabel}>Followers</Text>
            </Pressable>
            <Pressable
              onPress={() => openFollowList('following')}
              style={styles.userStatItem}>
              <Text style={styles.userStatValue}>
                {formatCount(profileData?.followingCount)}
              </Text>
              <Text style={styles.userStatLabel}>Following</Text>
            </Pressable>
          </View>

          {isOwnProfile && !isBlocked ? (
            <View style={styles.userPillsRow}>
              <GlowActionButton
                variant="follow"
                title="Edit"
                onPress={() => navigate('EditProfileScreen', {})}
              />
              <GlowActionButton
                variant="subscribe"
                title="Share"
                onPress={() => shareProfile(profileData)}
              />
            </View>
          ) : null}

          {!isOwnProfile && !isBlocked ? (
            <View style={styles.userPillsRow}>
              <GlowActionButton
                variant="follow"
                title={following ? 'Following' : 'Follow'}
                width={following ? 126 : 100}
                onPress={handleFollowToggle}
              />
              <GlowActionButton
                variant="subscribe"
                title={profileData?.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                width={profileData?.isSubscribed ? 140 : 126}
                onPress={handleSubmit}
              />
            </View>
          ) : null}
        </View>
      );
    }

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
            {displayName}
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
            <GlowActionButton
              variant="follow"
              title={following ? 'Following' : 'Follow'}
              width={following ? 126 : 100}
              onPress={handleFollowToggle}
            />
            <GlowActionButton
              variant="subscribe"
              title={profileData?.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              width={profileData?.isSubscribed ? 140 : 126}
              onPress={handleSubmit}
            />
          </View>
        )}

        {(profileType === 'other' || profileType === 'creator') &&
          !isBlocked && (
            <View style={styles.actionButtonsContainer}>
              <ProfileIconButton
                label="Merchandise"
                disabled={!profileData?.storeId && profileType === 'other'}
                onPress={openStore}
                icon={
                  <BasketIcon width={20} height={20} stroke={Colors.white} />
                }
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
  userContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
    marginTop: 4,
  },
  userHeroBlock: {
    alignItems: 'center',
    gap: 36,
    width: '100%',
  },
  userAvatarWrap: {
    width: USER_AVATAR_SIZE,
    height: USER_AVATAR_SIZE,
    alignSelf: 'center',
  },
  userAvatarRing: {
    width: USER_AVATAR_SIZE,
    height: USER_AVATAR_SIZE,
    borderRadius: USER_AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 4.4,
    borderColor: '#1AD655',
  },
  userAvatar: {
    width: '100%',
    height: '100%',
  },
  userIdentity: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  userDisplayName: {
    fontSize: 36,
    lineHeight: 40,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
    maxWidth: wp('70%'),
  },
  userSubtitle: {
    fontSize: fontSize.f14,
    lineHeight: 20,
    color: Colors.white,
    opacity: 0.5,
    fontFamily: fonts['Poppins-Regular'],
    textAlign: 'center',
    paddingHorizontal: wp('6%'),
  },
  userStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  userStatItem: {
    alignItems: 'center',
    minWidth: 52,
  },
  userStatValue: {
    fontSize: 24,
    lineHeight: 28,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
  },
  userStatLabel: {
    fontSize: fontSize.f12,
    color: Colors.white,
    opacity: 0.5,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
  },
  userPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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
    gap: 5,
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
    gap: 8,
    paddingHorizontal: wp('4%'),
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
