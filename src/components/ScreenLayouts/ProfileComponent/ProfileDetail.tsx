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
import {useFollowUnfollowUserMutation} from '@rtkServices/ContentActionService';
import {navigate} from '@navigation/utils';
import {useUnsubscribeFromCreatorMutation} from '@rtkServices/SubcriptionService';
import {Stream} from '@rtkServices/LiveStreamServices/LiveServices';
import {useToastMessage} from '@hooks/useToastMessage';

const ProfileActionButton = ({
  title,
  icon,
  style,
  onPress,
}: {
  title: string;
  icon?: any;
  style?: any;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionButtonContainer, style]}>
      <Text style={styles.actionButtonText}>{title}</Text>
      {icon && icon}
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
    }, [followAndUnfollow, profileData._id]);

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

        {profileData?.bio && (
          <Text style={styles.desStyle}>{profileData?.bio || 'No bio'}</Text>
        )}

        <View style={styles.followingContainer}>
          {profileType !== 'user' && (
            <Pressable
              onPress={() => {
                navigate('FollowAndFollowing', {
                  userId: profileData?._id,
                  type: 'followers',
                });
              }}
              style={styles.followCountItem}>
              <Text style={styles.followingCount}>
                {profileData?.followersCount || 0}
              </Text>
              <Text style={styles.followingText}>Followers</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => {
              navigate('FollowAndFollowing', {
                userId: profileData?._id,
                type: 'following',
              });
            }}
            style={styles.followCountItem}>
            <Text style={styles.followingCount}>
              {profileData?.followingCount || 0}
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
              <ProfileActionButton
                onPress={() => {
                  if (profileType === 'other') {
                    navigate('OtherUserStoreScreen', {
                      storeId: profileData?.storeId,
                      name: profileData?.displayName || profileData?.username,
                      profilePicture: profileData?.profilePicture || null,
                    });
                  } else {
                    navigate('CreatorStore', {});
                  }
                }}
                title="Visit store"
                icon={<BasketIcon width={20} height={20} />}
                style={
                  profileData?.storeId
                    ? profileType === 'other'
                      ? styles.actionButtonOther
                      : styles.actionButtonCreator
                    : [
                        profileType === 'other'
                          ? styles.actionButtonOther
                          : styles.actionButtonCreator,
                        styles.disabledButton,
                      ]
                }
              />
              <ProfileActionButton
                onPress={() => {
                  if (profileType === 'other') {
                    navigate('CreatorTicketingScreen', {
                      creatorId: profileData?._id,
                    });
                  } else {
                    navigate('CreatorTicketingScreen', {
                      creatorId: profileData?._id,
                    });
                  }
                }}
                style={
                  profileType === 'other'
                    ? styles.actionButtonOther
                    : styles.actionButtonCreator
                }
                title="Tickets"
                icon={<TicketIcon width={20} height={20} stroke={'#8800FF'} />}
              />
              {profileType === 'creator' && (
                <TouchableOpacity
                  onPress={() => {
                    navigate('EditProfileScreen', {});
                  }}
                  style={styles.editProfileButtonContainer}>
                  <EditProfileIcon width={20} height={20} />
                </TouchableOpacity>
              )}
            </View>
          )}
      </View>
    );
  },
);

export default ProfileDetail;
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  userImageStyle: {
    width: wp('35%'),
    height: wp('35%'),
    alignSelf: 'center',
    borderRadius: 100,
  },
  userImageLive: {
    borderWidth: 3,
    borderColor: Colors.green,
  },
  userImageContainer: {
    width: wp('35%'),
    height: wp('35%'),
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
    fontSize: fontSize.f30,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: wp('4%'),
    maxWidth: '100%',
  },
  desStyle: {
    fontSize: fontSize.f12,
    color: Colors.grey,
    marginTop: 10,
    fontFamily: fonts['Poppins-Medium'],
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: wp('4%'),
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
  },
  actionButtonOther: {
    width: wp('45%'),
  },
  actionButtonCreator: {
    width: wp('37%'),
  },
  disabledButton: {
    opacity: 0.5,
  },
  followingContainer: {
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    gap: 20,
  },
  followCountItem: {
    alignItems: 'center',
  },
  followingCount: {
    fontSize: fontSize.f22,
    color: Colors.white,
    fontFamily: fonts['Poppins-SemiBold'],
  },
  followingText: {
    fontSize: fontSize.f16,
    color: Colors.grey,
    fontFamily: fonts['Poppins-Medium'],
  },
  actionButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#0000001F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('37%'),
    height: wp('10%'),
    borderWidth: 2,
    borderColor: '#FFFFFF1A',
  },
  actionButtonText: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
  },
  editProfileButtonContainer: {
    backgroundColor: '#0000001F',
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('10%'),
    height: wp('10%'),
    borderWidth: 2,
    borderColor: '#FFFFFF1A',
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
  followButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderWidth: 2,
    borderColor: '#1AD655',
  },
  followButtonText: {
    fontSize: fontSize.f14,
    color: Colors.white,
    fontFamily: fonts['Poppins-Medium'],
    alignSelf: 'center',
  },
});
