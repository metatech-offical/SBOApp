import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
} from 'react-native';
import React, {useEffect, useCallback, useMemo, useState, useRef} from 'react';
import {OtherUserProfileProps} from '@navigation/screens';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import ProfileHeader from '@components/CustomHeaders/ProfileHeader';
import ProfileDetail from '@components/ScreenLayouts/ProfileComponent/ProfileDetail';
import ProfileTabUI from '@components/ScreenLayouts/ProfileComponent/ProfileTabUI';
import {fontSize} from '@constant/fontSize';
import {
  useBlockUnblockUserMutation,
  useGetUserProfileByIdQuery,
  useMarkAccountViewedMutation,
} from '@rtkServices/ProfileService';
import {useReportContentMutation} from '@rtkServices/ContentActionService';
import {MoreIcon} from '@assets/svg/CommonIcons';
import {useSelector} from 'react-redux';
import {RootState} from '@store/index';
import Loader from '@components/CustomLoader/Loader';
import CustomBottomSheet from '@components/CustomBottomSheet/CustomBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import UnblockModal from '@components/CustomModal/UnBlockModal';
import {
  otherProfileSheetContent,
  unblockUserSheetContent,
  REPORT_DATA,
} from '@utils/data';
import UserBlockSheet from './UserBlockSheet';
import NewCommentSheet from '@components/Common/NewCommentSheet';
import {useGetLiveByUserIDQuery} from '@rtkServices/LiveStreamServices';
import {useToastMessage} from '@hooks/useToastMessage';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import CustomRadioButton from '@components/CustomRadioButton/CustomRadioButton';
import {shareProfile} from '@utils/helper';

const OtherUserProfile = ({navigation, route}: OtherUserProfileProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {userId} = route?.params as {userId: string};
  const {user} = useSelector((state: RootState) => state.user);
  const [markAccountViewed] = useMarkAccountViewedMutation();
  const [blockUserSheet, setBlockUserSheet] = useState(false);
  const blockUserSheetRef = useRef<BottomSheetModal>(null);
  const newCommentSheetRef = useRef<any>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [showBlockUserDetails, setShowBlockUserDetails] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState('');
  const [blockUser, {isLoading: blockUserLoading}] =
    useBlockUnblockUserMutation();
  const [reportUser] = useReportContentMutation();

  const {
    data,
    isLoading: isProfileLoading,
    refetch,
  } = useGetUserProfileByIdQuery({id: userId});

  const {data: liveData} = useGetLiveByUserIDQuery({userID: userId});

  const handleMarkAccountViewed = useCallback(
    async (id: string) => {
      try {
        await markAccountViewed({id}).unwrap();
      } catch (e) {}
    },
    [markAccountViewed],
  );

  useEffect(() => {
    if (data) {
      setProfileData(data?.data);
      setIsBlocked(data?.data?.isBlocked);
      if (user?._id != data?.data?._id && data?.data?.isViewed === false) {
        handleMarkAccountViewed(data?.data._id);
      }
    }
  }, [data, user?._id, handleMarkAccountViewed]);

  const handleBlockUser = useCallback(async () => {
    try {
      await blockUser({id: userId, action: 'block'}).then((res: any) => {
        if (res?.data) {
          refetch();
          setBlockUserSheet(false);
          setShowBlockUserDetails(false);
          showSuccess(res?.data?.message || '');
        }
        if (res?.error) {
          showError(res?.error?.data?.message || '');
        }
      });
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  }, [userId, blockUser]);

  const handleUnblock = useCallback(async () => {
    try {
      await blockUser({id: userId, action: 'unblock'}).then((res: any) => {
        if (res?.data) {
          refetch();
          setModalVisible(false);
          setBlockUserSheet(false);
          setShowBlockUserDetails(false);
          showSuccess(res?.data?.message || '');
        }
        if (res?.error) {
          showError(res?.error?.data?.message || '');
        }
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  }, [userId, blockUser]);

  const moreIcon = useMemo(
    () => <MoreIcon width={20} height={20} style={styles.moreIcon} />,
    [],
  );

  const handleUnblockPress = () => {
    setModalVisible(true);
  };

  const handleShareProfile = useCallback(async () => {
    setBlockUserSheet(false);
    await shareProfile(profileData);
  }, [profileData]);

  const handleReportProfile = useCallback(async () => {
    const reasonLabel = selectedFilter?.label;
    if (!reasonLabel) {
      showError('Please select a reason.');
      return;
    }
    const body = {
      contentId: userId,
      reason: reasonLabel,
      contentType: 'users',
      description: 'profile report',
    };
    await reportUser(body).then((res: any) => {
      if (res?.data) {
        setBlockUserSheet(false);
        setShowReportSheet(false);
        setSelectedFilter(null);
        showSuccess(res?.data?.message || 'Profile reported');
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Something went wrong');
      }
    });
  }, [selectedFilter, userId, reportUser, showError, showSuccess]);

  const handleProfileAction = (action: string) => {
    if (action === 'share') {
      handleShareProfile();
    } else if (action === 'report') {
      setShowReportSheet(true);
    } else if (action === 'block') {
      setShowBlockUserDetails(true);
    }
  };

  const RenderBlockUserSheet = useCallback(() => {
    return (
      <View>
        {isBlocked ? (
          <FlatList
            data={unblockUserSheetContent}
            renderItem={({item}) => (
              <Pressable
                onPress={handleUnblockPress}
                style={styles.blockUserSheetContainer}>
                <FastImage
                  source={item.icon}
                  style={styles.blockUserSheetIcon}
                />
                <Text style={styles.blockUserSheetText}>{item.title}</Text>
              </Pressable>
            )}
          />
        ) : showBlockUserDetails ? (
          <UserBlockSheet
            userDetail={profileData}
            onBlockPress={handleBlockUser}
            isLoading={blockUserLoading}
          />
        ) : showReportSheet ? (
          <View style={styles.reportSheetContent}>
            <CustomRadioButton
              data={REPORT_DATA}
              selectedFilter={selectedFilter?.value}
              onPress={(item: any) => setSelectedFilter(item)}
              customTitleStyle={{}}
            />
          </View>
        ) : (
          <FlatList
            data={otherProfileSheetContent}
            renderItem={({item}) => (
              <Pressable
                onPress={() => handleProfileAction(item.action)}
                style={styles.blockUserSheetContainer}>
                <FastImage
                  source={item.icon}
                  style={styles.blockUserSheetIcon}
                />
                <Text
                  style={[
                    styles.blockUserSheetText,
                    {color: item.color || '#D13C50'},
                  ]}>
                  {item.title}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>
    );
  }, [
    showBlockUserDetails,
    showReportSheet,
    isBlocked,
    selectedFilter,
    profileData,
    blockUserLoading,
    handleBlockUser,
  ]);

  const handleCommentPress = (postId: string) => {
    setCurrentPostId(postId);
    setTimeout(() => {
      newCommentSheetRef.current?.open();
    }, 500);
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <ProfileHeader
          onBackPress={() => navigation.goBack()}
          onSettingsPress={() => {
            setBlockUserSheet(true);
          }}
          Icon={moreIcon}
        />
        {isProfileLoading ? (
          <Loader visible={isProfileLoading} />
        ) : (
          <View style={styles.body}>
            {profileData && (
              <ProfileDetail
                profileData={profileData}
                liveData={liveData?.data}
                isBlocked={isBlocked}
                profileType={
                  profileData?.membership === 'creator' ? 'other' : 'user'
                }
              />
            )}
            {!isBlocked && (
              <View style={styles.profileTabContainer}>
                <ProfileTabUI
                  profileType="other"
                  userId={userId}
                  handleCommentPress={handleCommentPress}
                />
              </View>
            )}
          </View>
        )}
      </View>

      {blockUserSheet && (
        <CustomBottomSheet
          label={showReportSheet ? 'Report Profile' : ''}
          ref={blockUserSheetRef}
          index={showBlockUserDetails || showReportSheet ? 3 : 2}
          renderView={RenderBlockUserSheet}
          containerStyle={{backgroundColor: '#251E37'}}
          submitLabel="Submit"
          onSubmit={showReportSheet ? handleReportProfile : undefined}
          onClose={() => {
            setBlockUserSheet(false);
            setShowBlockUserDetails(false);
            setShowReportSheet(false);
            setSelectedFilter(null);
          }}
          onPress={() => {
            setBlockUserSheet(false);
            setShowBlockUserDetails(false);
            setShowReportSheet(false);
            setSelectedFilter(null);
          }}
        />
      )}

      <UnblockModal
        modalVisible={modalVisible}
        handleCancel={() => setModalVisible(false)}
        selectedUser={profileData}
        handleUnblock={handleUnblock}
        isLoading={blockUserLoading}
      />

      <NewCommentSheet
        ref={newCommentSheetRef}
        itemId={currentPostId}
        creatorId={userId}
        currentItemType="posts"
      />
    </View>
  );
};

export default OtherUserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.red,
  },
  contentOverlay: {
    position: 'relative',
    flex: 1,
  },
  body: {
    flex: 1,
  },
  profileTabContainer: {
    flex: 1,
    marginTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#00000057',
    overflow: 'hidden',
  },
  profileTabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    transform: [{rotate: '90deg'}],
  },
  blockUserSheetContainer: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginTop: 25,
  },
  blockUserSheetIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  blockUserSheetText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: '#D13C50',
  },
  reportSheetContent: {
    marginTop: 10,
  },
});
